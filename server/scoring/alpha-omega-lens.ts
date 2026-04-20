import OpenAI from "openai";
import { randomUUID } from "crypto";
import {
  type EvaluationInput,
  type EvaluationResult,
  type LLMEvaluationResponse,
  llmEvaluationResponseSchema,
  evaluationInputSchema,
  computeConsumability,
  toLegacyAIScore,
  type LegacyAIScore,
} from "./schema";
import {
  ALPHA_OMEGA_LENS_SYSTEM_PROMPT,
  ALPHA_OMEGA_LENS_PROMPT_VERSION,
  buildEvaluationUserPrompt,
} from "./alpha-omega-lens-prompt";

const MODEL = "gpt-4o";
const MAX_RETRIES = 3;
const TEMPERATURE = 0;

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. " +
          "The Alpha-Omega Lens requires an OpenAI API key to evaluate plants."
      );
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Parse and validate the LLM response JSON.
 * Strips markdown code fences if present, then validates against the schema.
 */
function parseLLMResponse(raw: string): LLMEvaluationResponse {
  let cleaned = raw.trim();

  // Strip markdown code fences if the LLM wraps its response
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`LLM returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  return llmEvaluationResponseSchema.parse(parsed);
}

/**
 * Call the LLM and get a validated evaluation response.
 * Retries up to MAX_RETRIES times on malformed responses.
 */
async function callLLM(
  userPrompt: string
): Promise<{ response: LLMEvaluationResponse; tokensUsed: { input: number; output: number } }> {
  const client = getOpenAIClient();
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        temperature: TEMPERATURE,
        messages: [
          { role: "system", content: ALPHA_OMEGA_LENS_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("LLM returned empty response");
      }

      const tokensUsed = {
        input: completion.usage?.prompt_tokens ?? 0,
        output: completion.usage?.completion_tokens ?? 0,
      };

      const response = parseLLMResponse(content);
      return { response, tokensUsed };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES) {
        console.warn(
          `Alpha-Omega Lens attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}. Retrying...`
        );
      }
    }
  }

  throw new Error(
    `Alpha-Omega Lens evaluation failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Evaluate a plant using the Alpha-Omega Lens.
 *
 * Accepts plant text + metadata, sends to OpenAI with the 6-point
 * evaluation protocol, and returns structured 7-dimension scores
 * plus assessment, markers, and consumability.
 */
export async function evaluatePlant(
  input: EvaluationInput
): Promise<EvaluationResult> {
  // Validate input
  const validated = evaluationInputSchema.parse(input);

  const startTime = Date.now();

  // Build the user prompt
  const userPrompt = buildEvaluationUserPrompt({
    text: validated.text,
    plant_type: validated.plant_type,
    contribution_type: validated.contribution_type,
    parent_text: validated.parent_text,
  });

  // Call the LLM with retry logic
  const { response, tokensUsed } = await callLLM(userPrompt);

  const latencyMs = Date.now() - startTime;

  // Compute consumability from scores
  const { is_consumable, consumption_reason } = computeConsumability(
    response.scores
  );

  const result: EvaluationResult = {
    plant_id: validated.plant_id,
    evaluation_id: randomUUID(),
    scores: response.scores,
    assessment: response.assessment,
    rhetoric_markers: response.rhetoric_markers,
    logic_markers: response.logic_markers,
    is_consumable,
    consumption_reason,
    model: MODEL,
    prompt_version: ALPHA_OMEGA_LENS_PROMPT_VERSION,
    tokens_used: tokensUsed,
    latency_ms: latencyMs,
    evaluated_at: new Date().toISOString(),
  };

  return result;
}

/**
 * Evaluate plant text and return the result in legacy AIScore format
 * (0-10 scale) for backward compatibility with the existing frontend.
 */
export async function evaluatePlantLegacy(
  text: string,
  plantType: "seed" | "contribution" = "seed",
  parentText?: string | null,
  contributionType?: string | null
): Promise<LegacyAIScore> {
  const result = await evaluatePlant({
    text,
    plant_type: plantType,
    contribution_type: contributionType as EvaluationInput["contribution_type"],
    parent_text: parentText,
  });

  return toLegacyAIScore(result);
}

// ===== HEURISTIC FALLBACK =====
// Kept as a fallback when OPENAI_API_KEY is not configured.
// This is the original keyword-based scorer from the prototype.

export function generateHeuristicScore(content: string): LegacyAIScore {
  const lower = content.toLowerCase();
  const words = lower.split(/\s+/);
  const totalWords = words.length || 1;

  const logicMarkers = ["therefore", "because", "evidence", "proves", "demonstrates", "data shows", "research", "if...then", "consequently", "analysis", "measured", "calculated", "specifically", "according to", "statistically", "per capita", "cost", "costs", "percent", "structural", "structurally", "systemic"];
  let logicCount = 0;
  logicMarkers.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const matches = lower.match(regex);
    if (matches) logicCount += matches.length;
  });

  const rhetoricMarkers = ["believe", "always", "never", "everyone knows", "obviously", "clearly", "undeniably", "without question", "nobody can deny", "it's clear that", "we all know", "the truth is", "simply put", "make no mistake"];
  let rhetoricCount = 0;
  rhetoricMarkers.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const matches = lower.match(regex);
    if (matches) rhetoricCount += matches.length;
  });

  const nostalgiaMarkers = ["used to be", "good old days", "back when", "remember when", "things were better", "in my day", "once upon a time", "we used to", "before all this", "how it used to"];
  let nostalgiaCount = 0;
  nostalgiaMarkers.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const matches = lower.match(regex);
    if (matches) nostalgiaCount += matches.length;
  });

  const emotionalMarkers = ["feel", "feeling", "heart", "passion", "love", "hate", "fear", "angry", "disgusted", "horrified", "beautiful", "terrible", "wonderful", "devastating", "outraged", "heartbreaking"];
  let emotionalCount = 0;
  emotionalMarkers.forEach(m => {
    const regex = new RegExp(`\\b${m}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) emotionalCount += matches.length;
  });

  const questionMarks = (content.match(/\?/g) || []).length;
  const numbers = (content.match(/\d+/g) || []).length;
  const citations = (lower.match(/\b(source|study|according|research|data|report|survey|census)\b/g) || []).length;
  const verifiabilityRaw = (questionMarks * 0.5 + numbers * 1 + citations * 2);

  const scopeMarkers = ["might", "could", "perhaps", "in this context", "in this case", "specifically", "within", "limited to", "for this area", "locally", "in our community", "at this scale"];
  let scopeCount = 0;
  scopeMarkers.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const matches = lower.match(regex);
    if (matches) scopeCount += matches.length;
  });

  const uniqueWords = new Set(words).size;
  const noveltyRaw = (uniqueWords / totalWords) * 10;

  const normalize = (val: number, max: number) => Math.min(Math.round((val / max) * 10), 10);

  const logic = normalize(logicCount, 5);
  const rhetoric = normalize(rhetoricCount, 4);
  const nostalgia = normalize(nostalgiaCount, 3);
  const emotionalAppeal = normalize(emotionalCount, 4);
  const verifiability = normalize(verifiabilityRaw, 8);
  const scope = normalize(scopeCount, 4);
  const novelty = Math.min(Math.round(noveltyRaw), 10);

  let assessment = "";
  if (logic > rhetoric && logic >= 5) {
    assessment = "Strong logical foundation. This plant has deep roots — the reasoning holds structural weight. The claims are grounded and the evidence supports the conclusion.";
  } else if (logic > rhetoric) {
    assessment = "Moderate logical structure with room to grow. The reasoning shows promise but could benefit from more concrete evidence and data points.";
  } else if (rhetoric > logic && rhetoric >= 5) {
    assessment = "High rhetoric density detected. This plant relies heavily on persuasion mechanics rather than structural logic. Vulnerable to consumption by logic-based challenges.";
  } else if (rhetoric > logic) {
    assessment = "Some rhetorical patterns present. The argument leans on persuasion over evidence. Strengthening the logical framework would increase resilience.";
  } else if (emotionalAppeal > 4) {
    assessment = "Emotional appeal is dominant. While passion drives engagement, this plant needs structural reinforcement to survive logical scrutiny.";
  } else if (nostalgia > 3) {
    assessment = "Nostalgia-driven content detected. Appeals to how things 'used to be' without structural basis. Needs present-tense, evidence-based framing to survive.";
  } else {
    assessment = "Balanced content with no dominant signal pattern. The plant shows moderate structural integrity. Contributing joins and expansions would strengthen its root system.";
  }

  return { logic, rhetoric, nostalgia, emotionalAppeal, novelty, verifiability, scope, assessment };
}

/**
 * Score a plant — uses LLM if OPENAI_API_KEY is set, falls back to heuristic.
 */
export async function scorePlant(
  content: string,
  options?: {
    plantType?: "seed" | "contribution";
    parentText?: string | null;
    contributionType?: string | null;
  }
): Promise<LegacyAIScore> {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await evaluatePlantLegacy(
        content,
        options?.plantType ?? "seed",
        options?.parentText,
        options?.contributionType
      );
    } catch (error) {
      console.error(
        "Alpha-Omega Lens evaluation failed, falling back to heuristic:",
        error instanceof Error ? error.message : error
      );
      return generateHeuristicScore(content);
    }
  }
  return generateHeuristicScore(content);
}

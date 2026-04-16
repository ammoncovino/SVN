import { z } from "zod";

// ===== INPUT SCHEMA =====

export const evaluationInputSchema = z.object({
  plant_id: z.string().optional(),
  plant_type: z.enum(["seed", "contribution"]),
  contribution_type: z
    .enum(["join", "expand", "clarify", "consume", "correct"])
    .nullable()
    .optional(),
  text: z.string().min(1, "Plant text is required"),
  parent_plant_id: z.string().nullable().optional(),
  parent_text: z.string().nullable().optional(),
  biome_layer: z.enum(["plot", "grove", "forest", "biosphere"]).optional(),
  author_id: z.string().optional(),
  created_at: z.string().optional(),
});

export type EvaluationInput = z.infer<typeof evaluationInputSchema>;

// ===== SCORE SCHEMA =====
// All dimensions 0.0-1.0

const scoreValue = z
  .number()
  .min(0.0, "Score must be >= 0.0")
  .max(1.0, "Score must be <= 1.0");

export const scoresSchema = z.object({
  logic: scoreValue,
  rhetoric: scoreValue,
  nostalgia: scoreValue,
  emotional_appeal: scoreValue,
  novelty: scoreValue,
  verifiability: scoreValue,
  scope: scoreValue,
});

export type Scores = z.infer<typeof scoresSchema>;

// ===== LLM RESPONSE SCHEMA =====
// What the LLM returns (before we add metadata)

export const llmEvaluationResponseSchema = z.object({
  scores: scoresSchema,
  assessment: z
    .string()
    .min(1, "Assessment is required"),
  rhetoric_markers: z.array(z.string()),
  logic_markers: z.array(z.string()),
});

export type LLMEvaluationResponse = z.infer<typeof llmEvaluationResponseSchema>;

// ===== FULL EVALUATION RESULT =====
// What the service returns (LLM response + computed fields + metadata)

export const evaluationResultSchema = llmEvaluationResponseSchema.extend({
  plant_id: z.string().optional(),
  evaluation_id: z.string(),
  is_consumable: z.boolean(),
  consumption_reason: z.string().nullable(),
  model: z.string(),
  prompt_version: z.string(),
  tokens_used: z.object({
    input: z.number(),
    output: z.number(),
  }),
  latency_ms: z.number(),
  evaluated_at: z.string(),
});

export type EvaluationResult = z.infer<typeof evaluationResultSchema>;

// ===== LEGACY AIScore BRIDGE =====
// Converts the new 0.0-1.0 evaluation result to the legacy 0-10 AIScore format
// used by the existing frontend

export interface LegacyAIScore {
  logic: number;
  rhetoric: number;
  nostalgia: number;
  emotionalAppeal: number;
  novelty: number;
  verifiability: number;
  scope: number;
  assessment: string;
}

export function toLegacyAIScore(result: EvaluationResult): LegacyAIScore {
  return {
    logic: Math.round(result.scores.logic * 10),
    rhetoric: Math.round(result.scores.rhetoric * 10),
    nostalgia: Math.round(result.scores.nostalgia * 10),
    emotionalAppeal: Math.round(result.scores.emotional_appeal * 10),
    novelty: Math.round(result.scores.novelty * 10),
    verifiability: Math.round(result.scores.verifiability * 10),
    scope: Math.round(result.scores.scope * 10),
    assessment: result.assessment,
  };
}

// ===== CONSUMABILITY RULE =====
// is_consumable = (rhetoric > logic) AND (rhetoric >= 0.4)

export function computeConsumability(scores: Scores): {
  is_consumable: boolean;
  consumption_reason: string | null;
} {
  const isConsumable =
    scores.rhetoric > scores.logic && scores.rhetoric >= 0.4;

  const reason = isConsumable
    ? `Rhetoric (${scores.rhetoric.toFixed(2)}) exceeds logic (${scores.logic.toFixed(2)}) and meets the 0.4 threshold — this plant is vulnerable to consumption by logic-based challenges.`
    : null;

  return { is_consumable: isConsumable, consumption_reason: reason };
}

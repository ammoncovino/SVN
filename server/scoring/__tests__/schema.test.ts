import { describe, it, expect } from "vitest";
import {
  scoresSchema,
  llmEvaluationResponseSchema,
  evaluationInputSchema,
  evaluationResultSchema,
  computeConsumability,
  toLegacyAIScore,
  type EvaluationResult,
} from "../schema";

// ===== SCORE SCHEMA TESTS =====

describe("scoresSchema", () => {
  it("accepts valid scores (all at boundary values)", () => {
    const valid = {
      logic: 0.0,
      rhetoric: 1.0,
      nostalgia: 0.5,
      emotional_appeal: 0.75,
      novelty: 0.33,
      verifiability: 0.9,
      scope: 0.1,
    };
    expect(scoresSchema.parse(valid)).toEqual(valid);
  });

  it("rejects scores below 0.0", () => {
    const invalid = {
      logic: -0.1,
      rhetoric: 0.5,
      nostalgia: 0.5,
      emotional_appeal: 0.5,
      novelty: 0.5,
      verifiability: 0.5,
      scope: 0.5,
    };
    expect(() => scoresSchema.parse(invalid)).toThrow();
  });

  it("rejects scores above 1.0", () => {
    const invalid = {
      logic: 0.5,
      rhetoric: 1.1,
      nostalgia: 0.5,
      emotional_appeal: 0.5,
      novelty: 0.5,
      verifiability: 0.5,
      scope: 0.5,
    };
    expect(() => scoresSchema.parse(invalid)).toThrow();
  });

  it("rejects missing dimensions", () => {
    const invalid = {
      logic: 0.5,
      rhetoric: 0.5,
      // missing nostalgia, emotional_appeal, novelty, verifiability, scope
    };
    expect(() => scoresSchema.parse(invalid)).toThrow();
  });

  it("rejects non-numeric values", () => {
    const invalid = {
      logic: "high",
      rhetoric: 0.5,
      nostalgia: 0.5,
      emotional_appeal: 0.5,
      novelty: 0.5,
      verifiability: 0.5,
      scope: 0.5,
    };
    expect(() => scoresSchema.parse(invalid)).toThrow();
  });
});

// ===== LLM EVALUATION RESPONSE TESTS =====

describe("llmEvaluationResponseSchema", () => {
  const validResponse = {
    scores: {
      logic: 0.7,
      rhetoric: 0.3,
      nostalgia: 0.1,
      emotional_appeal: 0.2,
      novelty: 0.6,
      verifiability: 0.8,
      scope: 0.75,
    },
    assessment: "This plant has strong structural roots with evidence-based claims.",
    rhetoric_markers: ["everyone knows", "obviously"],
    logic_markers: ["according to the 2023 census data", "if we compare rates"],
  };

  it("accepts a valid LLM response", () => {
    const result = llmEvaluationResponseSchema.parse(validResponse);
    expect(result.scores.logic).toBe(0.7);
    expect(result.assessment).toContain("structural roots");
    expect(result.rhetoric_markers).toHaveLength(2);
    expect(result.logic_markers).toHaveLength(2);
  });

  it("rejects empty assessment", () => {
    const invalid = { ...validResponse, assessment: "" };
    expect(() => llmEvaluationResponseSchema.parse(invalid)).toThrow();
  });

  it("accepts empty marker arrays", () => {
    const valid = { ...validResponse, rhetoric_markers: [], logic_markers: [] };
    const result = llmEvaluationResponseSchema.parse(valid);
    expect(result.rhetoric_markers).toHaveLength(0);
    expect(result.logic_markers).toHaveLength(0);
  });

  it("rejects missing scores object", () => {
    const { scores: _, ...noScores } = validResponse;
    expect(() => llmEvaluationResponseSchema.parse(noScores)).toThrow();
  });
});

// ===== EVALUATION INPUT TESTS =====

describe("evaluationInputSchema", () => {
  it("accepts a minimal seed plant input", () => {
    const input = {
      text: "The evidence shows a 15% reduction in crime rates.",
      plant_type: "seed" as const,
    };
    const result = evaluationInputSchema.parse(input);
    expect(result.text).toContain("15%");
    expect(result.plant_type).toBe("seed");
  });

  it("accepts a full contribution input", () => {
    const input = {
      plant_id: "abc-123",
      plant_type: "contribution" as const,
      contribution_type: "expand" as const,
      text: "Building on the parent claim with additional data.",
      parent_plant_id: "parent-456",
      parent_text: "Original parent plant text here.",
      biome_layer: "grove" as const,
      author_id: "user-789",
      created_at: "2026-04-16T12:00:00Z",
    };
    const result = evaluationInputSchema.parse(input);
    expect(result.contribution_type).toBe("expand");
    expect(result.parent_text).toContain("Original");
  });

  it("rejects empty text", () => {
    const invalid = { text: "", plant_type: "seed" };
    expect(() => evaluationInputSchema.parse(invalid)).toThrow();
  });

  it("rejects invalid plant_type", () => {
    const invalid = { text: "Some content", plant_type: "blog" };
    expect(() => evaluationInputSchema.parse(invalid)).toThrow();
  });

  it("rejects invalid contribution_type", () => {
    const invalid = {
      text: "Some content",
      plant_type: "contribution",
      contribution_type: "like",
    };
    expect(() => evaluationInputSchema.parse(invalid)).toThrow();
  });
});

// ===== CONSUMABILITY RULE TESTS =====

describe("computeConsumability", () => {
  it("marks as consumable when rhetoric > logic AND rhetoric >= 0.4", () => {
    const scores = {
      logic: 0.3,
      rhetoric: 0.6,
      nostalgia: 0.1,
      emotional_appeal: 0.2,
      novelty: 0.5,
      verifiability: 0.4,
      scope: 0.5,
    };
    const result = computeConsumability(scores);
    expect(result.is_consumable).toBe(true);
    expect(result.consumption_reason).toContain("Rhetoric");
    expect(result.consumption_reason).toContain("0.60");
    expect(result.consumption_reason).toContain("0.30");
  });

  it("NOT consumable when rhetoric > logic but rhetoric < 0.4", () => {
    const scores = {
      logic: 0.05,
      rhetoric: 0.08,
      nostalgia: 0.0,
      emotional_appeal: 0.0,
      novelty: 0.1,
      verifiability: 0.1,
      scope: 0.1,
    };
    const result = computeConsumability(scores);
    expect(result.is_consumable).toBe(false);
    expect(result.consumption_reason).toBeNull();
  });

  it("NOT consumable when logic > rhetoric", () => {
    const scores = {
      logic: 0.8,
      rhetoric: 0.2,
      nostalgia: 0.0,
      emotional_appeal: 0.1,
      novelty: 0.7,
      verifiability: 0.9,
      scope: 0.8,
    };
    const result = computeConsumability(scores);
    expect(result.is_consumable).toBe(false);
    expect(result.consumption_reason).toBeNull();
  });

  it("NOT consumable when logic == rhetoric (must be strictly greater)", () => {
    const scores = {
      logic: 0.5,
      rhetoric: 0.5,
      nostalgia: 0.1,
      emotional_appeal: 0.1,
      novelty: 0.5,
      verifiability: 0.5,
      scope: 0.5,
    };
    const result = computeConsumability(scores);
    expect(result.is_consumable).toBe(false);
  });

  it("consumable at exact threshold: rhetoric 0.4, logic 0.39", () => {
    const scores = {
      logic: 0.39,
      rhetoric: 0.4,
      nostalgia: 0.0,
      emotional_appeal: 0.0,
      novelty: 0.0,
      verifiability: 0.0,
      scope: 0.0,
    };
    const result = computeConsumability(scores);
    expect(result.is_consumable).toBe(true);
  });
});

// ===== LEGACY BRIDGE TESTS =====

describe("toLegacyAIScore", () => {
  it("converts 0.0-1.0 scores to 0-10 scale", () => {
    const evaluationResult: EvaluationResult = {
      evaluation_id: "test-id",
      scores: {
        logic: 0.7,
        rhetoric: 0.3,
        nostalgia: 0.15,
        emotional_appeal: 0.25,
        novelty: 0.6,
        verifiability: 0.85,
        scope: 0.9,
      },
      assessment: "Strong plant with deep structural roots.",
      rhetoric_markers: [],
      logic_markers: [],
      is_consumable: false,
      consumption_reason: null,
      model: "gpt-4o",
      prompt_version: "abc123",
      tokens_used: { input: 500, output: 200 },
      latency_ms: 1500,
      evaluated_at: "2026-04-16T12:00:00Z",
    };

    const legacy = toLegacyAIScore(evaluationResult);

    expect(legacy.logic).toBe(7);
    expect(legacy.rhetoric).toBe(3);
    expect(legacy.nostalgia).toBe(2); // Math.round(0.15 * 10) = 2
    expect(legacy.emotionalAppeal).toBe(3); // Math.round(0.25 * 10) = 3
    expect(legacy.novelty).toBe(6);
    expect(legacy.verifiability).toBe(9); // Math.round(0.85 * 10) = 9
    expect(legacy.scope).toBe(9);
    expect(legacy.assessment).toBe("Strong plant with deep structural roots.");
  });

  it("handles boundary values (0.0 and 1.0)", () => {
    const evaluationResult: EvaluationResult = {
      evaluation_id: "test-id",
      scores: {
        logic: 0.0,
        rhetoric: 1.0,
        nostalgia: 0.0,
        emotional_appeal: 1.0,
        novelty: 0.0,
        verifiability: 1.0,
        scope: 0.0,
      },
      assessment: "Boundary test.",
      rhetoric_markers: [],
      logic_markers: [],
      is_consumable: true,
      consumption_reason: "test",
      model: "gpt-4o",
      prompt_version: "abc123",
      tokens_used: { input: 100, output: 50 },
      latency_ms: 500,
      evaluated_at: "2026-04-16T12:00:00Z",
    };

    const legacy = toLegacyAIScore(evaluationResult);
    expect(legacy.logic).toBe(0);
    expect(legacy.rhetoric).toBe(10);
    expect(legacy.emotionalAppeal).toBe(10);
    expect(legacy.verifiability).toBe(10);
  });
});

// ===== FULL EVALUATION RESULT SCHEMA TESTS =====

describe("evaluationResultSchema", () => {
  it("accepts a complete evaluation result", () => {
    const result = {
      plant_id: "plant-123",
      evaluation_id: "eval-456",
      scores: {
        logic: 0.7,
        rhetoric: 0.3,
        nostalgia: 0.1,
        emotional_appeal: 0.2,
        novelty: 0.6,
        verifiability: 0.8,
        scope: 0.75,
      },
      assessment: "Solid structural foundation.",
      rhetoric_markers: ["clearly"],
      logic_markers: ["according to data"],
      is_consumable: false,
      consumption_reason: null,
      model: "gpt-4o",
      prompt_version: "sha256hash",
      tokens_used: { input: 500, output: 200 },
      latency_ms: 1500,
      evaluated_at: "2026-04-16T12:00:00Z",
    };
    expect(() => evaluationResultSchema.parse(result)).not.toThrow();
  });

  it("rejects missing evaluation_id", () => {
    const result = {
      scores: {
        logic: 0.7, rhetoric: 0.3, nostalgia: 0.1,
        emotional_appeal: 0.2, novelty: 0.6, verifiability: 0.8, scope: 0.75,
      },
      assessment: "Test.",
      rhetoric_markers: [],
      logic_markers: [],
      is_consumable: false,
      consumption_reason: null,
      model: "gpt-4o",
      prompt_version: "hash",
      tokens_used: { input: 0, output: 0 },
      latency_ms: 0,
      evaluated_at: "2026-04-16T12:00:00Z",
    };
    expect(() => evaluationResultSchema.parse(result)).toThrow();
  });
});

import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import type { AIScore } from "@shared/schema";

// AI Scoring heuristic
function generateAIScore(content: string): AIScore {
  const lower = content.toLowerCase();
  const words = lower.split(/\s+/);
  const totalWords = words.length || 1;

  // Logic markers
  const logicMarkers = ["therefore", "because", "evidence", "proves", "demonstrates", "data shows", "research", "if...then", "consequently", "analysis", "measured", "calculated", "specifically", "according to", "statistically", "per capita", "cost", "costs", "percent", "structural", "structurally", "systemic"];
  let logicCount = 0;
  logicMarkers.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const matches = lower.match(regex);
    if (matches) logicCount += matches.length;
  });

  // Rhetoric markers
  const rhetoricMarkers = ["believe", "always", "never", "everyone knows", "obviously", "clearly", "undeniably", "without question", "nobody can deny", "it's clear that", "we all know", "the truth is", "simply put", "make no mistake"];
  let rhetoricCount = 0;
  rhetoricMarkers.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const matches = lower.match(regex);
    if (matches) rhetoricCount += matches.length;
  });

  // Nostalgia markers
  const nostalgiaMarkers = ["used to be", "good old days", "back when", "remember when", "things were better", "in my day", "once upon a time", "we used to", "before all this", "how it used to"];
  let nostalgiaCount = 0;
  nostalgiaMarkers.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const matches = lower.match(regex);
    if (matches) nostalgiaCount += matches.length;
  });

  // Emotional markers
  const emotionalMarkers = ["feel", "feeling", "heart", "passion", "love", "hate", "fear", "angry", "disgusted", "horrified", "beautiful", "terrible", "wonderful", "devastating", "outraged", "heartbreaking"];
  let emotionalCount = 0;
  emotionalMarkers.forEach(m => {
    const regex = new RegExp(`\\b${m}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) emotionalCount += matches.length;
  });

  // Verifiability — questions, citations, numbers
  const questionMarks = (content.match(/\?/g) || []).length;
  const numbers = (content.match(/\d+/g) || []).length;
  const citations = (lower.match(/\b(source|study|according|research|data|report|survey|census)\b/g) || []).length;
  const verifiabilityRaw = (questionMarks * 0.5 + numbers * 1 + citations * 2);

  // Scope — hedging (positive — appropriate scoping)
  const scopeMarkers = ["might", "could", "perhaps", "in this context", "in this case", "specifically", "within", "limited to", "for this area", "locally", "in our community", "at this scale"];
  let scopeCount = 0;
  scopeMarkers.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const matches = lower.match(regex);
    if (matches) scopeCount += matches.length;
  });

  // Novelty — simple: longer, more specific content with unique words = more novel
  const uniqueWords = new Set(words).size;
  const noveltyRaw = (uniqueWords / totalWords) * 10;

  // Normalize scores (0-10)
  const normalize = (val: number, max: number) => Math.min(Math.round((val / max) * 10), 10);

  const logic = normalize(logicCount, 5);
  const rhetoric = normalize(rhetoricCount, 4);
  const nostalgia = normalize(nostalgiaCount, 3);
  const emotionalAppeal = normalize(emotionalCount, 4);
  const verifiability = normalize(verifiabilityRaw, 8);
  const scope = normalize(scopeCount, 4);
  const novelty = Math.min(Math.round(noveltyRaw), 10);

  // Assessment
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

export async function registerRoutes(server: Server, app: Express) {
  // ===== USERS =====
  app.get("/api/users", (_req, res) => {
    const allUsers = storage.getAllUsers();
    res.json(allUsers);
  });

  app.get("/api/users/:id", (req, res) => {
    const user = storage.getUser(parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  // ===== PLANTS =====
  app.get("/api/plants", (_req, res) => {
    const allPlants = storage.getAllPlants();
    res.json(allPlants);
  });

  app.get("/api/plants/biome/:biome", (req, res) => {
    const plantsInBiome = storage.getPlantsByBiome(req.params.biome);
    res.json(plantsInBiome);
  });

  app.get("/api/plants/user/:userId", (req, res) => {
    const userPlants = storage.getPlantsByUser(parseInt(req.params.userId));
    res.json(userPlants);
  });

  app.get("/api/plants/:id", (req, res) => {
    const plant = storage.getPlant(parseInt(req.params.id));
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  });

  app.post("/api/plants", (req, res) => {
    const { userId, title, content, biome } = req.body;

    // Biome planting costs
    const biomeCosts: Record<string, number> = { plot: 1, grove: 2, forest: 3, biosphere: 5 };
    const cost = biomeCosts[biome] || 1;

    const user = storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.energy < cost) return res.status(400).json({ message: "Not enough energy to plant in this biome" });

    // Generate AI score
    const aiScore = generateAIScore(content);

    // Deduct energy from user
    storage.updateUserEnergy(userId, user.energy - cost);

    // Create plant with initial energy based on content quality
    const initialEnergy = Math.max(1, aiScore.logic - aiScore.rhetoric + 2);

    const plant = storage.createPlant({
      userId,
      title,
      content,
      biome,
      energy: initialEnergy,
      aiScore: JSON.stringify(aiScore),
      status: "growing",
      createdAt: new Date().toISOString(),
    });

    res.json(plant);
  });

  // ===== CONTRIBUTIONS =====
  app.get("/api/contributions/plant/:plantId", (req, res) => {
    const contribs = storage.getContributionsByPlant(parseInt(req.params.plantId));
    res.json(contribs);
  });

  app.get("/api/contributions/user/:userId", (req, res) => {
    const contribs = storage.getContributionsByUser(parseInt(req.params.userId));
    res.json(contribs);
  });

  app.post("/api/contributions", (req, res) => {
    const { plantId, userId, content, type } = req.body;

    const user = storage.getUser(userId);
    const plant = storage.getPlant(plantId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    let energyTransferred = 0;
    let userEnergyChange = 0;
    let plantEnergyChange = 0;

    switch (type) {
      case "join":
      case "expand":
      case "clarify":
        // Costs 1 energy, adds 1 to plant
        if (user.energy < 1) return res.status(400).json({ message: "Not enough energy" });
        energyTransferred = 1;
        userEnergyChange = -1;
        plantEnergyChange = 1;
        break;

      case "consume": {
        // Costs 2 energy
        if (user.energy < 2) return res.status(400).json({ message: "Not enough energy to consume" });
        const aiScore: AIScore = JSON.parse(plant.aiScore);
        if (aiScore.rhetoric > aiScore.logic) {
          // Weak plant — consumer gains 3 energy, plant loses 2
          userEnergyChange = 1; // net: -2 + 3 = +1
          plantEnergyChange = -2;
          energyTransferred = -2;
        } else {
          // Strong plant — consumer loses 2, gains nothing
          userEnergyChange = -2;
          plantEnergyChange = 0;
          energyTransferred = 0;
        }
        break;
      }

      case "correct":
        // Costs 1, no energy transfer
        if (user.energy < 1) return res.status(400).json({ message: "Not enough energy" });
        userEnergyChange = -1;
        energyTransferred = 0;
        break;

      default:
        return res.status(400).json({ message: "Invalid contribution type" });
    }

    // Apply energy changes
    storage.updateUserEnergy(userId, user.energy + userEnergyChange);

    const newPlantEnergy = plant.energy + plantEnergyChange;
    storage.updatePlantEnergy(plantId, Math.max(0, newPlantEnergy));

    // If plant hits 0, compost it
    if (newPlantEnergy <= 0) {
      storage.updatePlantStatus(plantId, "composted");
    }

    const contribution = storage.createContribution({
      plantId,
      userId,
      content,
      type,
      energyTransferred,
      createdAt: new Date().toISOString(),
    });

    // Return updated user and plant
    const updatedUser = storage.getUser(userId);
    const updatedPlant = storage.getPlant(plantId);

    res.json({ contribution, user: updatedUser, plant: updatedPlant });
  });
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, TreePine, Trees, Globe, Zap, MessageSquare, Leaf } from "lucide-react";
import { Link } from "wouter";
import type { Plant, AIScore } from "@shared/schema";

const biomeIcons: Record<string, typeof Sprout> = {
  plot: Sprout,
  grove: TreePine,
  forest: Trees,
  biosphere: Globe,
};

const biomeLabels: Record<string, string> = {
  plot: "Plot",
  grove: "Grove",
  forest: "Forest",
  biosphere: "Biosphere",
};

interface PlantCardProps {
  plant: Plant;
  authorName?: string;
  contributionCount?: number;
}

export function PlantCard({ plant, authorName, contributionCount = 0 }: PlantCardProps) {
  const BiomeIcon = biomeIcons[plant.biome] || Sprout;
  const aiScore: AIScore = JSON.parse(plant.aiScore);
  const isComposted = plant.status === "composted";
  const energyPercent = Math.min(plant.energy * 10, 100);

  // Visual energy level
  const getEnergyColor = () => {
    if (isComposted) return "bg-amber-900/40";
    if (plant.energy >= 8) return "bg-emerald-500";
    if (plant.energy >= 5) return "bg-emerald-600/80";
    if (plant.energy >= 3) return "bg-emerald-700/60";
    return "bg-emerald-800/40";
  };

  const getGlowIntensity = () => {
    if (isComposted) return "";
    if (plant.energy >= 8) return "shadow-[0_0_20px_rgba(16,185,129,0.3)]";
    if (plant.energy >= 5) return "shadow-[0_0_12px_rgba(16,185,129,0.15)]";
    return "";
  };

  return (
    <Link href={`/plant/${plant.id}`}>
      <Card
        className={`p-4 cursor-pointer transition-all duration-300 grow-in hover-elevate ${getGlowIntensity()} ${
          isComposted ? "opacity-60" : ""
        }`}
        data-testid={`card-plant-${plant.id}`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-semibold leading-snug line-clamp-2 ${
                isComposted ? "text-muted-foreground line-through" : ""
              }`}
              data-testid={`text-plant-title-${plant.id}`}
            >
              {plant.title}
            </h3>
            {authorName && (
              <p className="text-xs text-muted-foreground mt-1">by {authorName}</p>
            )}
          </div>
          <Badge
            variant="outline"
            className="shrink-0 gap-1 text-[10px]"
          >
            <BiomeIcon className="w-3 h-3" />
            {biomeLabels[plant.biome]}
          </Badge>
        </div>

        {/* Energy bar */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            {isComposted ? (
              <Leaf className="w-3 h-3 text-amber-700 dark:text-amber-600" />
            ) : (
              <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            )}
            <span className="text-xs font-medium" data-testid={`text-plant-energy-${plant.id}`}>
              {plant.energy}
            </span>
            <span className="text-[10px] text-muted-foreground">energy</span>
            {isComposted && (
              <Badge variant="secondary" className="ml-auto text-[10px] py-0">
                composted
              </Badge>
            )}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getEnergyColor()}`}
              style={{ width: `${energyPercent}%` }}
            />
          </div>
        </div>

        {/* AI Score summary */}
        <div className="flex items-center gap-2 flex-wrap">
          {aiScore.logic > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Logic {aiScore.logic}
            </span>
          )}
          {aiScore.rhetoric > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-red-600 dark:text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Rhetoric {aiScore.rhetoric}
            </span>
          )}
          {aiScore.verifiability > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Verifiable {aiScore.verifiability}
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            {contributionCount}
          </span>
        </div>
      </Card>
    </Link>
  );
}

"use client";

import { Calendar, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { RELEASE_STEPS } from "@/constants/steps";
import { Release } from "@/hooks/use-releases";
import { Button } from "@/components/ui/button";

interface ReleaseCardProps {
  release: Release;
  isSelected: boolean;
  onClick: () => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export function ReleaseCard({
  release,
  isSelected,
  onClick,
  onDeleteClick,
}: ReleaseCardProps) {
  const completedCount = release.stepsCompleted.length;
  const totalSteps = RELEASE_STEPS.length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  // Status theme
  let statusVariant: "default" | "secondary" | "outline" | "destructive" = "secondary";
  let statusClasses = "border-border";

  if (release.status === "planned") {
    statusVariant = "outline";
    statusClasses = "bg-sky-500/5 text-sky-400 border-sky-500/20";
  } else if (release.status === "ongoing") {
    statusVariant = "secondary";
    statusClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else if (release.status === "done") {
    statusVariant = "default";
    statusClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10";
  }

  return (
    <Card
      onClick={onClick}
      className={`p-4 transition-all duration-200 cursor-pointer relative group border ${
        isSelected
          ? "bg-muted/80 border-primary shadow-sm"
          : "bg-card/40 border-border hover:bg-card/90"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-card-foreground group-hover:text-foreground transition-colors break-words max-w-[200px]">
          {release.name}
        </div>

        {/* Delete icon button */}
        <Button
          onClick={onDeleteClick}
          variant="ghost"
          size="sm"
          className="h-7 px-2 shrink-0 flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="Delete Release"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Status & Date */}
      <div className="mt-2.5 flex items-center gap-2">
        <Badge variant={statusVariant} className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${statusClasses}`}>
          {release.status}
        </Badge>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(release.date)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground font-medium">Steps completed</span>
          <span className="font-bold text-card-foreground">{completedCount}/{totalSteps} ({progressPercentage}%)</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-border/20">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              release.status === "done"
                ? "bg-emerald-500"
                : release.status === "ongoing"
                ? "bg-amber-500"
                : "bg-primary"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Desktop Selection Indicator */}
      {isSelected && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-l-md hidden md:block" />
      )}
    </Card>
  );
}

"use client";

import { Activity, Clock, Layers, Loader2, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "./mode-toggle";

interface DashboardHeaderProps {
  totalReleases: number;
  plannedCount: number;
  ongoingCount: number;
  doneCount: number;
  onNewReleaseClick: () => void;
}

export function DashboardHeader({
  totalReleases,
  plannedCount,
  ongoingCount,
  doneCount,
  onNewReleaseClick,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
          <Layers className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
            LoomRelease
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Checklist tool for release engineers</p>
        </div>
      </div>

      {/* Header Stats */}
      <div className="hidden md:flex items-center gap-3">
        <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-muted/40 text-muted-foreground border-border font-semibold text-xs h-7 rounded-lg">
          <Activity className="w-3.5 h-3.5" />
          <span>Total: {totalReleases}</span>
        </Badge>
        <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-sky-500/5 text-sky-400 border-sky-500/20 font-semibold text-xs h-7 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>Planned: {plannedCount}</span>
        </Badge>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold text-xs h-7 rounded-lg">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Ongoing: {ongoingCount}</span>
        </Badge>
        <Badge variant="default" className="gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 font-semibold text-xs h-7 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed: {doneCount}</span>
        </Badge>
      </div>

      <div className="flex items-center gap-2.5">
        <ModeToggle />
        <Button onClick={onNewReleaseClick} className="gap-2 cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Release</span>
        </Button>
      </div>
    </header>
  );
}

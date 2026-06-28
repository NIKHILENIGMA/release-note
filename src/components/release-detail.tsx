"use client";

import React from "react";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Check, 
  CheckCircle, 
  FileText, 
  Info, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { RELEASE_STEPS } from "@/constants/steps";
import { Release } from "@/hooks/use-releases";

interface ReleaseDetailProps {
  activeRelease: Release | undefined;
  notesText: string;
  savingNotesStatus: "idle" | "saving" | "saved" | "error";
  onBackClick: () => void;
  onToggleStep: (stepId: string) => void;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ReleaseDetail({
  activeRelease,
  notesText,
  savingNotesStatus,
  onBackClick,
  onToggleStep,
  onNotesChange,
}: ReleaseDetailProps) {
  if (!activeRelease) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-background">
        <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground/60" />
        </div>
        <h2 className="text-lg font-bold text-foreground">No Release Selected</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Select a release from the sidebar checklist or click \"New Release\" to start tracking one.
        </p>
      </div>
    );
  }

  const completedCount = activeRelease.stepsCompleted.length;
  const totalSteps = RELEASE_STEPS.length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  // Status theme
  let badgeVariant: "default" | "secondary" | "outline" = "secondary";
  let badgeClasses = "";
  if (activeRelease.status === "planned") {
    badgeVariant = "outline";
    badgeClasses = "bg-sky-500/5 text-sky-400 border-sky-500/20";
  } else if (activeRelease.status === "ongoing") {
    badgeVariant = "secondary";
    badgeClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else if (activeRelease.status === "done") {
    badgeVariant = "default";
    badgeClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10";
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Detail Header */}
      <div className="px-6 py-4 border-b border-border bg-card/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-h-[116px] shrink-0">
        
        {/* Back button & Name details */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackClick}
            className="p-2 -ml-2 rounded-lg bg-muted border border-border hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors md:hidden cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{activeRelease.name}</h2>
              <Badge variant={badgeVariant} className={`text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${badgeClasses}`}>
                {activeRelease.status}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Release Date: {formatDate(activeRelease.date)}</span>
            </div>
          </div>
        </div>

        {/* Circular Progress Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-medium">Global Completion</div>
            <div className="text-sm font-bold text-foreground">
              {completedCount} of {totalSteps} Steps
            </div>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="currentColor" className="text-muted/20" strokeWidth="3" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                className={
                  activeRelease.status === "done" 
                    ? "text-emerald-500" 
                    : activeRelease.status === "ongoing" 
                    ? "text-amber-500" 
                    : "text-primary"
                }
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 16}
                strokeDashoffset={2 * Math.PI * 16 * (1 - completedCount / totalSteps)}
              />
            </svg>
            <span className="text-[10px] font-bold text-card-foreground absolute">
              {progressPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Detail Content Grid */}
      <div className="p-6 flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-y-auto custom-scrollbar">
        
        {/* Steps Checklist Pane */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Deployment Checklist</span>
          </h3>
          
          <div className="space-y-3">
            {RELEASE_STEPS.map((step, idx) => {
              const isCompleted = activeRelease.stepsCompleted.includes(step.id);
              return (
                <Card
                  key={step.id}
                  onClick={() => onToggleStep(step.id)}
                  className={`p-4 transition-all cursor-pointer flex items-start gap-4 border hover:border-border/80 ${
                    isCompleted
                      ? "bg-emerald-500/[0.03] border-emerald-500/20 hover:bg-emerald-500/[0.05]"
                      : "bg-card/25 border-border/80 hover:bg-card/50"
                  }`}
                >
                  {/* Checkbox equivalent styled with Tailwind */}
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-background border-input text-transparent hover:border-muted-foreground"
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                        Step {idx + 1}
                      </span>
                      <h4 className={`text-sm font-semibold transition-colors ${
                        isCompleted ? "text-muted-foreground line-through decoration-muted-foreground/50 decoration-1" : "text-card-foreground"
                      }`}>
                        {step.name}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                  </div>

                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide shrink-0">
                      Done
                    </span>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Info / Notes Textarea */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Additional Information</span>
            </h3>

            {/* Auto-save Status */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {savingNotesStatus === "saving" && (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  <span>Saving...</span>
                </div>
              )}
              {savingNotesStatus === "saved" && (
                <div className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Auto-saved</span>
                </div>
              )}
              {savingNotesStatus === "error" && (
                <div className="flex items-center gap-1 text-destructive font-semibold">
                  <AlertCircle className="w-3 h-3" />
                  <span>Save failed</span>
                </div>
              )}
              {savingNotesStatus === "idle" && (
                <span className="text-muted-foreground/60">Up to date</span>
              )}
            </div>
          </div>

          <Card className="bg-card/30 border border-border p-4 flex flex-col gap-3 h-[400px]">
            <textarea
              placeholder="Add release notes, instructions, post-mortem findings, or logs. Note: edits are automatically saved as you type..."
              value={notesText}
              onChange={onNotesChange}
              className="w-full flex-1 bg-transparent text-sm text-card-foreground placeholder-muted-foreground/50 resize-none focus:outline-none leading-relaxed"
            />
            <div className="text-[10px] text-muted-foreground/60 border-t border-border pt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Rich notes persisted in DB. Max 2000 characters.</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

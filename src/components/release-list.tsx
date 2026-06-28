"use client";

import React from "react";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { ReleaseCard } from "./release-card";
import { Release } from "@/hooks/use-releases";
import { ReleaseStatus } from "@/constants/steps";
import { Button } from "@/components/ui/button";

interface ReleaseListProps {
  loading: boolean;
  filteredReleases: Release[];
  selectedReleaseId: number | null;
  searchQuery: string;
  statusFilter: "all" | ReleaseStatus;
  totalReleases: number;
  plannedCount: number;
  ongoingCount: number;
  doneCount: number;
  isMobileDetailView: boolean;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (filter: "all" | ReleaseStatus) => void;
  setSelectedReleaseId: (id: number) => void;
  setIsMobileDetailView: (open: boolean) => void;
  onDeleteRelease: (release: Release, e: React.MouseEvent) => void;
}

export function ReleaseList({
  loading,
  filteredReleases,
  selectedReleaseId,
  searchQuery,
  statusFilter,
  totalReleases,
  plannedCount,
  ongoingCount,
  doneCount,
  isMobileDetailView,
  setSearchQuery,
  setStatusFilter,
  setSelectedReleaseId,
  setIsMobileDetailView,
  onDeleteRelease,
}: ReleaseListProps) {
  return (
    <section className={`w-full md:w-100 shrink-0 border-r border-border flex flex-col bg-card/10 ${
      isMobileDetailView ? "hidden md:flex" : "flex"
    }`}>
      {/* List Search & Filters */}
      <div className="px-4 py-4 border-b border-border flex flex-col gap-3 min-h-29 justify-center bg-card/5">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search releases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="h-8 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
          >
            All ({totalReleases})
          </Button>
          <Button
            variant={statusFilter === "planned" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("planned")}
            className={`h-8 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
              statusFilter === "planned" ? "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20" : ""
            }`}
          >
            Planned ({plannedCount})
          </Button>
          <Button
            variant={statusFilter === "ongoing" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("ongoing")}
            className={`h-8 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
              statusFilter === "ongoing" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20" : ""
            }`}
          >
            Ongoing ({ongoingCount})
          </Button>
          <Button
            variant={statusFilter === "done" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("done")}
            className={`h-8 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
              statusFilter === "done" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" : ""
            }`}
          >
            Done ({doneCount})
          </Button>
        </div>
      </div>

      {/* Releases Cards list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="h-40 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm">Loading releases...</span>
          </div>
        ) : filteredReleases.length === 0 ? (
          <div className="py-12 px-4 border border-dashed border-border rounded-xl text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No releases found</p>
            <p className="text-xs text-muted-foreground/40 mt-1">Try matching query or create a new release.</p>
          </div>
        ) : (
          filteredReleases.map((release) => (
            <ReleaseCard
              key={release.id}
              release={release}
              isSelected={release.id === selectedReleaseId}
              onClick={() => {
                setSelectedReleaseId(release.id);
                setIsMobileDetailView(true);
              }}
              onDeleteClick={(e) => onDeleteRelease(release, e)}
            />
          ))
        )}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { AlertCircle, Loader2, CalendarIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateReleaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  info: string;
  setInfo: (info: string) => void;
  error: string;
  isSubmitting: boolean;
}

export function CreateReleaseDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  name,
  setName,
  date,
  setDate,
  time,
  setTime,
  info,
  setInfo,
  error,
  isSubmitting,
}: CreateReleaseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border border-border text-foreground rounded-2xl overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-bold text-foreground">Create New Release</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="px-6 pb-6 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive-foreground text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Release Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. v2.1.0-alpha, release-2026-06"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Date & Time Picker */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scheduled Date & Time *</label>
            <div className="flex gap-2">
              {/* Date Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal bg-background border border-border hover:bg-muted/50 cursor-pointer h-11 rounded-xl",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Time Selector Input */}
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-32 px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-11 transition-colors"
              />
            </div>
          </div>

          {/* Optional Info */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Additional Information (Optional)</label>
            <textarea
              placeholder="Add any initial scope details, release notes or references..."
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground/60 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex gap-3 justify-end pt-2 border-t border-border/80">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer shadow-md bg-primary text-primary-foreground hover:bg-primary/95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Release</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

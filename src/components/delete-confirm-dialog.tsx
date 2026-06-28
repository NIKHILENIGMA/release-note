"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  releaseName: string;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  releaseName,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border border-border text-foreground rounded-2xl overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 pt-6 flex flex-row items-start gap-4 space-y-0">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <DialogTitle className="text-lg font-bold text-foreground">Delete Release</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{releaseName}"</span>? 
              This action cannot be undone and will permanently remove this release and all of its checklist records.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="px-6 pb-6 pt-4 flex gap-3 justify-end border-t border-border/20 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="cursor-pointer shadow-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

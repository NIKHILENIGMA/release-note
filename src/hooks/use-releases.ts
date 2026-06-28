import { useState, useEffect, useCallback, useRef } from "react";
import { RELEASE_STEPS, ReleaseStatus } from "@/constants/steps";

export interface Release {
  id: number;
  name: string;
  date: string;
  status: ReleaseStatus;
  additionalInfo: string | null;
  stepsCompleted: string[];
  createdAt: string;
  updatedAt: string;
}

export function useReleases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReleaseId, setSelectedReleaseId] = useState<number | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReleaseStatus>("all");
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReleaseName, setNewReleaseName] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState<Date | undefined>(undefined);
  const [newReleaseTime, setNewReleaseTime] = useState("12:00");
  const [newReleaseInfo, setNewReleaseInfo] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notesText, setNotesText] = useState("");
  const [savingNotesStatus, setSavingNotesStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [releaseToDelete, setReleaseToDelete] = useState<Release | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteMap, setDeleteConfirmMap] = useState<Record<number, boolean>>({});

  const fetchReleases = async () => {
    try {
      const res = await fetch("/api/releases");
      if (res.ok) {
        const data = await res.json();
        setReleases(data);
        if (data.length > 0 && selectedReleaseId === null) {
          setSelectedReleaseId(data[0].id);
          setNotesText(data[0].additionalInfo || "");
        }
      }
    } catch (err) {
      console.error("Error loading releases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const activeRelease = releases.find((r) => r.id === selectedReleaseId);

  useEffect(() => {
    if (activeRelease) {
      setNotesText(activeRelease.additionalInfo || "");
      setSavingNotesStatus("idle");
      setDeleteConfirmMap({});
    }
  }, [selectedReleaseId, releases]);

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!newReleaseName.trim()) {
      setFormError("Release Name is required");
      return;
    }
    if (!newReleaseDate) {
      setFormError("Release Date is required");
      return;
    }

    const finalDate = new Date(newReleaseDate);
    if (newReleaseTime) {
      const [hours, minutes] = newReleaseTime.split(":");
      finalDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReleaseName,
          date: finalDate.toISOString(),
          additionalInfo: newReleaseInfo,
        }),
      });

      if (res.ok) {
        const newRel = await res.json();
        setReleases((prev) => [newRel, ...prev]);
        setSelectedReleaseId(newRel.id);
        setIsModalOpen(false);
        setNewReleaseName("");
        setNewReleaseDate(undefined);
        setNewReleaseTime("12:00");
        setNewReleaseInfo("");
        setIsMobileDetailView(true);
      } else {
        const errData = await res.json();
        setFormError(errData.error || "Failed to create release");
      }
    } catch (err) {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStep = async (stepId: string) => {
    if (!activeRelease) return;

    const isCompleted = activeRelease.stepsCompleted.includes(stepId);
    let newStepsCompleted: string[];

    if (isCompleted) {
      newStepsCompleted = activeRelease.stepsCompleted.filter((id) => id !== stepId);
    } else {
      newStepsCompleted = [...activeRelease.stepsCompleted, stepId];
    }

    const wasDoneBefore = activeRelease.stepsCompleted.length === RELEASE_STEPS.length;
    const isNowDone = newStepsCompleted.length === RELEASE_STEPS.length;

    let newStatus: ReleaseStatus = "ongoing";
    if (newStepsCompleted.length === 0) newStatus = "planned";
    else if (isNowDone) newStatus = "done";

    setReleases((prev) =>
      prev.map((r) =>
        r.id === activeRelease.id
          ? { ...r, stepsCompleted: newStepsCompleted, status: newStatus }
          : r
      )
    );

    if (isNowDone && !wasDoneBefore) {
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#10b981", "#f59e0b", "#ec4899"],
        });
      } catch (err) {
        console.error("Confetti error:", err);
      }
    }

    try {
      const res = await fetch(`/api/releases/${activeRelease.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepsCompleted: newStepsCompleted }),
      });
      if (!res.ok) {
        fetchReleases();
      }
    } catch (err) {
      fetchReleases();
    }
  };

  const saveNotesAPI = useCallback(async (releaseId: number, text: string) => {
    setSavingNotesStatus("saving");
    try {
      const res = await fetch(`/api/releases/${releaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ additionalInfo: text }),
      });

      if (res.ok) {
        setSavingNotesStatus("saved");
        setReleases((prev) =>
          prev.map((r) => (r.id === releaseId ? { ...r, additionalInfo: text } : r))
        );
      } else {
        setSavingNotesStatus("error");
      }
    } catch (err) {
      setSavingNotesStatus("error");
    }
  }, []);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNotesText(text);

    if (!activeRelease) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSavingNotesStatus("saving");
    saveTimeoutRef.current = setTimeout(() => {
      saveNotesAPI(activeRelease.id, text);
    }, 1000);
  };

  const triggerDelete = (release: Release, e: React.MouseEvent) => {
    e.stopPropagation();
    setReleaseToDelete(release);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!releaseToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/releases/${releaseToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReleases((prev) => prev.filter((r) => r.id !== releaseToDelete.id));
        if (selectedReleaseId === releaseToDelete.id) {
          setSelectedReleaseId(null);
          setIsMobileDetailView(false);
        }
        setIsDeleteOpen(false);
        setReleaseToDelete(null);
      }
    } catch (err) {
      console.error("Error deleting release:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReleases = releases.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalReleases = releases.length;
  const plannedCount = releases.filter((r) => r.status === "planned").length;
  const ongoingCount = releases.filter((r) => r.status === "ongoing").length;
  const doneCount = releases.filter((r) => r.status === "done").length;

  return {
    releases,
    loading,
    selectedReleaseId,
    activeRelease,
    searchQuery,
    statusFilter,
    isMobileDetailView,
    isModalOpen,
    newReleaseName,
    newReleaseDate,
    newReleaseTime,
    newReleaseInfo,
    formError,
    isSubmitting,
    notesText,
    savingNotesStatus,
    releaseToDelete,
    isDeleteOpen,
    isDeleting,
    filteredReleases,
    totalReleases,
    plannedCount,
    ongoingCount,
    doneCount,
    setSelectedReleaseId,
    setSearchQuery,
    setStatusFilter,
    setIsMobileDetailView,
    setIsModalOpen,
    setNewReleaseName,
    setNewReleaseDate,
    setNewReleaseTime,
    setNewReleaseInfo,
    handleCreateRelease,
    handleToggleStep,
    handleNotesChange,
    setIsDeleteOpen,
    triggerDelete,
    handleConfirmDelete,
  };
}

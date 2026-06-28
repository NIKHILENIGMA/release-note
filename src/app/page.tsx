"use client";

import React from "react";
import { useReleases } from "@/hooks/use-releases";
import { DashboardHeader } from "@/components/dashboard-header";
import { ReleaseList } from "@/components/release-list";
import { ReleaseDetail } from "@/components/release-detail";
import { CreateReleaseDialog } from "@/components/create-release-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

export default function ReleaseTracker() {
  const {
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
  } = useReleases();

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground min-h-screen">
      {/* Top Banner Navigation */}
      <DashboardHeader
        totalReleases={totalReleases}
        plannedCount={plannedCount}
        ongoingCount={ongoingCount}
        doneCount={doneCount}
        onNewReleaseClick={() => setIsModalOpen(true)}
      />

      {/* Main Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Releases List Pane */}
        <ReleaseList
          loading={loading}
          filteredReleases={filteredReleases}
          selectedReleaseId={selectedReleaseId}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          totalReleases={totalReleases}
          plannedCount={plannedCount}
          ongoingCount={ongoingCount}
          doneCount={doneCount}
          isMobileDetailView={isMobileDetailView}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
          setSelectedReleaseId={setSelectedReleaseId}
          setIsMobileDetailView={setIsMobileDetailView}
          onDeleteRelease={triggerDelete}
        />

        {/* Right Side: Active Release Details Checklist Pane */}
        <ReleaseDetail
          activeRelease={activeRelease}
          notesText={notesText}
          savingNotesStatus={savingNotesStatus}
          onBackClick={() => setIsMobileDetailView(false)}
          onToggleStep={handleToggleStep}
          onNotesChange={handleNotesChange}
        />
      </main>

      {/* Modal / Dialog for New Release */}
      <CreateReleaseDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateRelease}
        name={newReleaseName}
        setName={setNewReleaseName}
        date={newReleaseDate}
        setDate={setNewReleaseDate}
        time={newReleaseTime}
        setTime={setNewReleaseTime}
        info={newReleaseInfo}
        setInfo={setNewReleaseInfo}
        error={formError}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        releaseName={releaseToDelete?.name || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}

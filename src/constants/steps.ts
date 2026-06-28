export interface Step {
  id: string;
  name: string;
  description: string;
}

export const RELEASE_STEPS: Step[] = [
  { id: "code_freeze", name: "Code Freeze", description: "Merge all pull requests and freeze main branch." },
  { id: "lint_tests", name: "Lint & Run Tests", description: "Run linters, formatting checks, and local test suite." },
  { id: "db_migrations", name: "Database Migrations", description: "Review and apply database migrations to staging." },
  { id: "deploy_staging", name: "Deploy to Staging", description: "Deploy build and verify it resolves successfully on staging." },
  { id: "smoke_tests", name: "Smoke Tests", description: "Run automated integration and manual verification tests on staging." },
  { id: "deploy_prod", name: "Deploy to Production", description: "Trigger production deployment pipeline." },
  { id: "prod_migrations", name: "Run Prod Migrations", description: "Ensure production database schema is up-to-date." },
  { id: "sanity_check", name: "Sanity Checks", description: "Verify production health, metrics, SSL, and main flows." },
  { id: "slack_announcement", name: "Slack Announcement", description: "Broadcast release notes to the team Slack channel." }
];

export type ReleaseStatus = "planned" | "ongoing" | "done";

export function computeReleaseStatus(completedSteps: string[]): ReleaseStatus {
  if (!completedSteps || completedSteps.length === 0) {
    return "planned";
  }
  if (completedSteps.length === RELEASE_STEPS.length) {
    return "done";
  }
  return "ongoing";
}

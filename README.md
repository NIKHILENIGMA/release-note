# LoomRelease — Release Checklist Tool

LoomRelease is a single-page full-stack web application designed to help developers track and coordinate software releases. This project is built using **Next.js (App Router)**, **PostgreSQL** (via **Drizzle ORM**), and **Tailwind CSS v4**.

## 🚀 Quick Start (Local Setup)

Follow these steps to run the application locally:

### 1. Install Dependencies
Make sure you have `pnpm` installed. Run the following command in the project root:
```bash
pnpm install
```

### 2. Start PostgreSQL via Docker Compose
Ensure you have Docker running, then start the PostgreSQL service:
```bash
docker compose up -d
```
This spins up a local PostgreSQL container running at `postgres://postgres:postgrespassword@localhost:5432/releasecheck`.

### 3. Sync Database Schema
Sync your database schema structure with PostgreSQL using Drizzle Kit:
```bash
pnpm db:push
```

### 4. Start Next.js Dev Server
Start the Next.js development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🗄️ Database Schema

The database consists of a single primary table called `releases`. Below is the Drizzle schema mapping:

```typescript
export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),                  // Primary Key
  name: text("name").notNull(),                    // Name of release (Mandatory)
  date: timestamp("date").notNull(),              // Target datetime (Mandatory)
  status: text("status").notNull(),                // Auto-computed: 'planned' | 'ongoing' | 'done'
  additionalInfo: text("additional_info"),        // Notes & extra details (Optional)
  stepsCompleted: jsonb("steps_completed"),        // JSONB array storing IDs of completed steps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### Generated SQL Schema
If you were to construct this table manually, the PostgreSQL SQL is:
```sql
CREATE TABLE IF NOT EXISTS "releases" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "status" TEXT DEFAULT 'planned' NOT NULL,
  "additional_info" TEXT,
  "steps_completed" JSONB DEFAULT '[]'::jsonb NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

## 🔌 API Endpoints

The server communicates via a REST API layer located under `src/app/api`.

### 1. Get All Releases
*   **Endpoint:** `GET /api/releases`
*   **Response:** `200 OK`
*   **Body Example:**
    ```json
    [
      {
        "id": 1,
        "name": "v1.2.0-stable",
        "date": "2026-06-30T10:00:00.000Z",
        "status": "ongoing",
        "additionalInfo": "Deployment notes...",
        "stepsCompleted": ["code_freeze", "lint_tests"],
        "createdAt": "2026-06-27T22:00:00.000Z",
        "updatedAt": "2026-06-27T23:05:00.000Z"
      }
    ]
    ```

### 2. Create a Release
*   **Endpoint:** `POST /api/releases`
*   **Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "name": "v2.0.0-rc1",
      "date": "2026-07-04T12:00:00.000Z",
      "additionalInfo": "Major release with UI redesign"
    }
    ```
*   **Response:** `201 Created`

### 3. Update a Release (Toggle Checklist / Notes)
*   **Endpoint:** `PATCH /api/releases/[id]`
*   **Headers:** `Content-Type: application/json`
*   **Request Body:**
    *   *To toggle completed steps (status auto-updates on backend):*
        ```json
        {
          "stepsCompleted": ["code_freeze", "lint_tests", "db_migrations"]
        }
        ```
    *   *To edit additional notes (supports debounced autosave):*
        ```json
        {
          "additionalInfo": "Updated post-mortem notes."
        }
        ```
*   **Response:** `200 OK` (returns full updated release object)

### 4. Delete a Release
*   **Endpoint:** `DELETE /api/releases/[id]`
*   **Response:** `200 OK`
    ```json
    {
      "success": true,
      "message": "Release deleted successfully"
    }
    ```

---

## 🧪 Testing with Playwright

Playwright is configured for End-to-End integration testing. 

### 1. Install Playwright Browsers
```bash
pnpm playwright install
```

### 2. Run Tests
```bash
pnpm playwright test
```

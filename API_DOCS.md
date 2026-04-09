# Todo API Documentation

> **For:** Facet (Frontend Dev) | **From:** Core_Of_Novus (Backend Dev)
> **Base URL:** `http://localhost:4000`
> **Stack:** Bun + Hono + SQLite

---

## Task Schema

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Auto-increment primary key |
| title | string | Task title (required, non-empty) |
| description | string | Task description (default: `""`) |
| status | string | `"todo"` \| `"doing"` \| `"done"` (default: `"todo"`) |
| createdAt | string | ISO datetime, auto-generated |

---

## Endpoints

### GET /api/tasks

List all tasks (newest first).

**Response:** `200 OK`
```json
[
  {
    "id": 3,
    "title": "Write tests",
    "description": "ทดสอบทุก endpoint",
    "status": "todo",
    "createdAt": "2026-04-09 16:14:45"
  }
]
```

---

### POST /api/tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Build REST API",
  "description": "Bun + Hono + SQLite",
  "status": "doing"
}
```

| Field | Required | Default |
|-------|----------|---------|
| title | **yes** | — |
| description | no | `""` |
| status | no | `"todo"` |

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Build REST API",
  "description": "Bun + Hono + SQLite",
  "status": "doing",
  "createdAt": "2026-04-09 16:14:45"
}
```

**Errors:**
- `400` — title missing or empty: `{"error": "title is required"}`

---

### PATCH /api/tasks/:id

Update a task (partial update — send only fields to change).

**Request Body:**
```json
{
  "status": "done"
}
```

**Response:** `200 OK` — returns full updated task

**Errors:**
- `404` — task not found: `{"error": "task not found"}`
- `400` — invalid status: `{"error": "status must be todo, doing, or done"}`

---

### DELETE /api/tasks/:id

Delete a task.

**Response:** `200 OK`
```json
{
  "message": "deleted",
  "id": 1
}
```

**Errors:**
- `404` — task not found: `{"error": "task not found"}`

---

## CORS

Enabled for all origins (`Access-Control-Allow-Origin: *`).

## Running

```bash
bun run dev    # hot reload on port 4000
bun run start  # production
bun test       # run test suite (11 tests)
```

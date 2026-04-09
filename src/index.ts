import { Hono } from "hono";
import { cors } from "hono/cors";
import db from "./db";

const app = new Hono();

app.use("/*", cors());

// GET /api/tasks — list all tasks
app.get("/api/tasks", (c) => {
  const tasks = db.query("SELECT * FROM tasks ORDER BY id DESC").all();
  return c.json(tasks);
});

// POST /api/tasks — create a task
app.post("/api/tasks", async (c) => {
  const body = await c.req.json();
  const { title, description, status } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return c.json({ error: "title is required" }, 400);
  }

  const validStatuses = ["todo", "doing", "done"];
  const taskStatus = status && validStatuses.includes(status) ? status : "todo";

  const result = db
    .query(
      "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?) RETURNING *"
    )
    .get(title.trim(), (description ?? "").toString(), taskStatus);

  return c.json(result, 201);
});

// PATCH /api/tasks/:id — update a task
app.patch("/api/tasks/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const existing = db.query("SELECT * FROM tasks WHERE id = ?").get(id);

  if (!existing) {
    return c.json({ error: "task not found" }, 404);
  }

  const body = await c.req.json();
  const { title, description, status } = body;

  const validStatuses = ["todo", "doing", "done"];
  if (status && !validStatuses.includes(status)) {
    return c.json({ error: "status must be todo, doing, or done" }, 400);
  }

  const updated = db
    .query(
      `UPDATE tasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status)
      WHERE id = ? RETURNING *`
    )
    .get(title ?? null, description ?? null, status ?? null, id);

  return c.json(updated);
});

// DELETE /api/tasks/:id — delete a task
app.delete("/api/tasks/:id", (c) => {
  const id = Number(c.req.param("id"));
  const existing = db.query("SELECT * FROM tasks WHERE id = ?").get(id);

  if (!existing) {
    return c.json({ error: "task not found" }, 404);
  }

  db.run("DELETE FROM tasks WHERE id = ?", [id]);
  return c.json({ message: "deleted", id });
});

export default {
  port: 4000,
  fetch: app.fetch,
};

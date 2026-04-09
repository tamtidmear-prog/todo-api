import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { app } from "./index";
import db from "./db";

let createdId: number;

beforeAll(() => {
  db.run("DELETE FROM tasks");
});

afterAll(() => {
  db.run("DELETE FROM tasks");
});

const json = (body: object) => ({
  method: "POST" as const,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

describe("POST /api/tasks", () => {
  test("creates a task with all fields", async () => {
    const res = await app.request("/api/tasks", json({ title: "Test task", description: "desc", status: "doing" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBeDefined();
    expect(data.title).toBe("Test task");
    expect(data.description).toBe("desc");
    expect(data.status).toBe("doing");
    expect(data.createdAt).toBeDefined();
    createdId = data.id;
  });

  test("creates a task with defaults", async () => {
    const res = await app.request("/api/tasks", json({ title: "Default task" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.status).toBe("todo");
    expect(data.description).toBe("");
  });

  test("rejects missing title", async () => {
    const res = await app.request("/api/tasks", json({ description: "no title" }));
    expect(res.status).toBe(400);
  });

  test("rejects empty title", async () => {
    const res = await app.request("/api/tasks", json({ title: "   " }));
    expect(res.status).toBe(400);
  });
});

describe("GET /api/tasks", () => {
  test("returns array of tasks", async () => {
    const res = await app.request("/api/tasks");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(2);
  });
});

describe("PATCH /api/tasks/:id", () => {
  test("updates status", async () => {
    const res = await app.request(`/api/tasks/${createdId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("done");
    expect(data.title).toBe("Test task");
  });

  test("updates title and description", async () => {
    const res = await app.request(`/api/tasks/${createdId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated", description: "new desc" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Updated");
    expect(data.description).toBe("new desc");
  });

  test("returns 404 for nonexistent", async () => {
    const res = await app.request("/api/tasks/9999", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    expect(res.status).toBe(404);
  });

  test("rejects invalid status", async () => {
    const res = await app.request(`/api/tasks/${createdId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/tasks/:id", () => {
  test("deletes a task", async () => {
    const res = await app.request(`/api/tasks/${createdId}`, { method: "DELETE" });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe("deleted");
  });

  test("returns 404 when already deleted", async () => {
    const res = await app.request(`/api/tasks/${createdId}`, { method: "DELETE" });
    expect(res.status).toBe(404);
  });
});

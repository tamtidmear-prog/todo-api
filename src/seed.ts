import db from "./db";

const tasks = [
  { title: "ออกแบบ database schema", description: "Tables, relations, indexes สำหรับ Todo App", status: "done" },
  { title: "สร้าง REST API", description: "Bun + Hono — GET/POST/PATCH/DELETE endpoints", status: "done" },
  { title: "เขียน test suite", description: "ทดสอบทุก endpoint ด้วย bun test", status: "done" },
  { title: "เชื่อม Frontend", description: "Facet integrate กับ API ผ่าน fetch", status: "doing" },
  { title: "เพิ่ม authentication", description: "JWT login + protected routes", status: "todo" },
  { title: "Deploy to production", description: "Docker + CI/CD pipeline", status: "todo" },
];

db.run("DELETE FROM tasks");

const insert = db.prepare("INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)");
for (const t of tasks) {
  insert.run(t.title, t.description, t.status);
}

const count = db.query("SELECT COUNT(*) as count FROM tasks").get() as { count: number };
console.log(`Seeded ${count.count} tasks`);

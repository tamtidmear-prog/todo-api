import { Database } from "bun:sqlite";

const db = new Database("todo.db");

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'doing', 'done')),
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;

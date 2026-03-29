const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── DB Connection ──────────────────────────────────────────
const db = mysql.createConnection({
  host: "mysql.railway.internal",
  user: "root",
  password: "ahPkcAdhjdXnsXpuWDBXIpOKlXwxjZbZ",
  database: "railway",
  port: 3306,
});

db.connect((err) => {
  if (err) { console.error("DB connection failed:", err); process.exit(1); }
  console.log("Connected to MySQL");
});

// ── USERS ──────────────────────────────────────────────────

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/users/:id", (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  });
});

app.post("/users", (req, res) => {
  const { college_name, full_name, mobile_number, is_host } = req.body;
  if (!college_name || !full_name || !mobile_number)
    return res.status(400).json({ error: "college_name, full_name, mobile_number are required" });

  db.query(
    "INSERT INTO users (college_name, full_name, mobile_number, is_host) VALUES (?, ?, ?, ?)",
    [college_name, full_name, mobile_number, is_host ?? false],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: "User created" });
    }
  );
});

app.put("/users/:id", (req, res) => {
  const { college_name, full_name, mobile_number, is_host } = req.body;
  db.query(
    "UPDATE users SET college_name=?, full_name=?, mobile_number=?, is_host=? WHERE id=?",
    [college_name, full_name, mobile_number, is_host, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.affectedRows) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User updated" });
    }
  );
});

app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  });
});

// ── INTER-CAMPUS TOURNAMENTS ───────────────────────────────

app.get("/tournaments/inter", (req, res) => {
  db.query("SELECT * FROM inter_campus_tournaments", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/tournaments/inter/:id", (req, res) => {
  db.query("SELECT * FROM inter_campus_tournaments WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Tournament not found" });
    res.json(rows[0]);
  });
});

app.post("/tournaments/inter", (req, res) => {
  const { tournament_name, prize_pool, date, colleges, g_form, game, description, organizers } = req.body;
  if (!tournament_name) return res.status(400).json({ error: "tournament_name is required" });

  db.query(
    `INSERT INTO inter_campus_tournaments
     (tournament_name, prize_pool, date, colleges, g_form, game, description, organizers)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tournament_name, prize_pool, date, JSON.stringify(colleges ?? []), g_form, game, description, JSON.stringify(organizers ?? [])],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: "Inter-campus tournament created" });
    }
  );
});

app.put("/tournaments/inter/:id", (req, res) => {
  const { tournament_name, prize_pool, date, colleges, g_form, game, description, organizers } = req.body;
  db.query(
    `UPDATE inter_campus_tournaments SET
     tournament_name=?, prize_pool=?, date=?, colleges=?, g_form=?, game=?, description=?, organizers=?
     WHERE id=?`,
    [tournament_name, prize_pool, date, JSON.stringify(colleges ?? []), g_form, game, description, JSON.stringify(organizers ?? []), req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.affectedRows) return res.status(404).json({ error: "Tournament not found" });
      res.json({ message: "Inter-campus tournament updated" });
    }
  );
});

app.delete("/tournaments/inter/:id", (req, res) => {
  db.query("DELETE FROM inter_campus_tournaments WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: "Tournament not found" });
    res.json({ message: "Inter-campus tournament deleted" });
  });
});

// ── INTRA-CAMPUS TOURNAMENTS ───────────────────────────────

app.get("/tournaments/intra", (req, res) => {
  db.query("SELECT * FROM intra_campus_tournaments", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/tournaments/intra/:id", (req, res) => {
  db.query("SELECT * FROM intra_campus_tournaments WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Tournament not found" });
    res.json(rows[0]);
  });
});

app.post("/tournaments/intra", (req, res) => {
  const { tournament_name, prize_pool, date, college, g_form, game, description, organizers } = req.body;
  if (!tournament_name) return res.status(400).json({ error: "tournament_name is required" });

  db.query(
    `INSERT INTO intra_campus_tournaments
     (tournament_name, prize_pool, date, college, g_form, game, description, organizers)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tournament_name, prize_pool, date, college, g_form, game, description, JSON.stringify(organizers ?? [])],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: "Intra-campus tournament created" });
    }
  );
});

app.put("/tournaments/intra/:id", (req, res) => {
  const { tournament_name, prize_pool, date, college, g_form, game, description, organizers } = req.body;
  db.query(
    `UPDATE intra_campus_tournaments SET
     tournament_name=?, prize_pool=?, date=?, college=?, g_form=?, game=?, description=?, organizers=?
     WHERE id=?`,
    [tournament_name, prize_pool, date, college, g_form, game, description, JSON.stringify(organizers ?? []), req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.affectedRows) return res.status(404).json({ error: "Tournament not found" });
      res.json({ message: "Intra-campus tournament updated" });
    }
  );
});

app.delete("/tournaments/intra/:id", (req, res) => {
  db.query("DELETE FROM intra_campus_tournaments WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: "Tournament not found" });
    res.json({ message: "Intra-campus tournament deleted" });
  });
});

// ── START ──────────────────────────────────────────────────
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
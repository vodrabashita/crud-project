const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("./db");
router.get("/", (req, res) => {
  res.send("Auth route working");
});

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await getConnection();

    await conn.execute(
      `INSERT INTO users (email, password) VALUES (:email, :password)`,
      [email, hashedPassword],
      { autoCommit: true }
    );

    res.send("User created");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT * FROM users WHERE email = :email`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = result.rows[0];
    const dbPassword = user[1];

    const isMatch = await bcrypt.compare(password, dbPassword);

    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign({ email }, "secretkey");

    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

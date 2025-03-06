import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs"

// Registrazione utente
router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const db = req.db
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Utente registrato!" });
    });
});

// Login utente
router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const db = req.db


    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(401).json({ message: "Utente non trovato" });

        const isMatch = await bcrypt.compare(password, results[0].password);
        if (!isMatch) return res.status(401).json({ message: "Password errata" });


        res.json({ user:results[0] });
    });
});


export default router;

import express from "express";
const router = express.Router();

// Aggiungere un commento a un dataset
router.post("/add", (req, res) => {
    const db = req.db;
    const { discussionId, username, comment } = req.body;

    if (!discussionId || !username || !comment) {
        return res.status(400).json({ message: "Mancano dei parametri" });
    }

    const sql = `
        INSERT INTO comments (discussion_id, username, comment)
        VALUES (?, ?, ?)
    `;
    const commentData = [discussionId, username, comment];

    db.query(sql, commentData, (err, result) => {
        if (err) {
            console.error("❌ Errore nell'inserimento del commento:", err);
            return res.status(500).json({ error: "Errore nel database", details: err });
        }
        res.json({ message: "✅ Commento aggiunto con successo!", id: result.insertId });
    });
});

// Ottenere i commenti di un dataset specifico
router.get("/:discussionId", (req, res) => {
    const db = req.db;
    const { discussionId } = req.params;

    const sql = "SELECT * FROM comments WHERE discussion_id = ?";

    db.query(sql, [discussionId], (err, results) => {
        if (err) {
            console.error("❌ Errore nel recupero dei commenti:", err);
            return res.status(500).json({ error: "Errore nel database", details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Nessun commento trovato per questo dataset." });
        }

        res.json({ comments: results });
    });
});

export default router;




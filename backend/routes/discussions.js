import express from "express";
import * as path from "node:path";
import * as fs from "node:fs";
import {fileURLToPath} from "url";
const router = express.Router();

// GET - Ottenere tutte le discussioni
router.get("/", (req, res) => {
    const db = req.db;
    db.query("SELECT * FROM discussions ORDER BY timestamp DESC", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const db = req.db;
    db.query("SELECT * FROM discussions WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Discussione non trovata" });
        }
        res.json(results[0]);
    });
});

// POST - Creare una nuova discussione
router.post("/", (req, res) => {
    const { titolo, username, text_discussion } = req.body;
    const db = req.db;
    if (!titolo || !username || !text_discussion) {
        return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
    }

    db.query(
        "INSERT INTO discussions (titolo, username, text_discussion) VALUES (?, ?, ?)",
        [titolo, username, text_discussion],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId, titolo, username, text_discussion });
        }
    );
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const db = req.db;
    db.query("DELETE FROM discussions WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Discussione non trovata" });
        }
        res.json({ message: "Discussione eliminata con successo" });
    });
});

// PUT - Modificare il titolo, il testo o entrambi
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { titolo, text_discussion } = req.body;

    if (!titolo && !text_discussion) {
        return res.status(400).json({ message: "Fornire almeno un campo da aggiornare" });
    }

    let query = "UPDATE discussions SET ";
    const values = [];

    if (titolo) {
        query += "titolo = ?, ";
        values.push(titolo);
    }

    if (text_discussion) {
        query += "text_discussion = ?, ";
        values.push(text_discussion);
    }

    query = query.slice(0, -2); // Rimuove l'ultima virgola
    query += " WHERE id = ?";
    values.push(id);
    const db = req.db;

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Discussione non trovata" });
        }
        res.json({ message: "Discussione aggiornata con successo" });
    });
});





export default router;
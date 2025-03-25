import express from "express";
import * as path from "node:path";
import * as fs from "node:fs";
import {fileURLToPath} from "url";
const router = express.Router();

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const db = req.db;
    db.query("SELECT * FROM comments WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Commento non trovato" });
        }
        res.json(results[0]);
    });
});

router.get("/ref/:riferimento_id", (req, res) => {
    const { riferimento_id } = req.params;
    const db = req.db;
    db.query("SELECT * FROM comments WHERE riferimento_id = ?", [riferimento_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

router.post("/", (req, res) => {
    const { riferimento_id, riferimento_tipo, username, comment, rating } = req.body;
    const db = req.db;
    console.log(req.body)
    if (!riferimento_id || !riferimento_tipo || !username || !comment) {
        return res.status(400).json({ error: "Tutti i campi obbligatori devono essere compilati" });
    }

    // Inserisce il commento nel database
    db.query(
        "INSERT INTO comments (riferimento_id, riferimento_tipo, username, comment, rating) VALUES (?, ?, ?, ?, ?)",
        [riferimento_id, riferimento_tipo, username, comment, rating || null],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Se il rating è null, non serve aggiornare il rating del dataset
            if (rating === null || rating === undefined) {
                return res.status(201).json({ message: "Commento aggiunto con successo", id: result.insertId, comment:comment });
            }else {

                // Calcola la nuova media del rating per il dataset
                db.query(
                    "SELECT AVG(rating) AS media_rating FROM comments WHERE riferimento_id = ? AND rating IS NOT NULL",
                    [riferimento_id],
                    (err, avgResult) => {
                        if (err) {
                            return res.status(500).json({error: err.message});
                        }

                        const mediaRating = avgResult[0].media_rating || 0.0 ; // Se non ci sono rating, imposta 0

                        // Aggiorna il rating nella tabella dataset
                        db.query(
                            "UPDATE datasets SET rating = ? WHERE id = ?",
                            [mediaRating, riferimento_id],
                            (err, updateResult) => {
                                if (err) {
                                    return res.status(500).json({error: err.message});
                                }
                                res.status(201).json({
                                    message: "Commento aggiunto e rating aggiornato",
                                    id: result.insertId,
                                    username: username,
                                    rating: mediaRating,
                                    comment: comment
                                });
                            }
                        );
                    }
                );
            }
        }
    );
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const db = req.db;

    // Prima recuperiamo il riferimento_id e il rating del commento da eliminare
    db.query("SELECT riferimento_id, rating FROM comments WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Commento non trovato" });
        }

        const { riferimento_id, rating } = results[0];

        // Eliminare il commento
        db.query("DELETE FROM comments WHERE id = ?", [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Se il commento eliminato non aveva rating, non serve aggiornare il dataset
            if (rating === null) {
                return res.json({ message: "Commento eliminato con successo" });
            }

            // Ricalcolare la media dei rating rimasti
            db.query(
                "SELECT AVG(rating) AS media_rating FROM comments WHERE riferimento_id = ? AND rating IS NOT NULL",
                [riferimento_id],
                (err, avgResult) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const mediaRating = avgResult[0].media_rating || 0; // Se non ci sono rating, imposta 0

                    // Aggiornare la tabella dataset con la nuova media
                    db.query(
                        "UPDATE datasets SET rating = ? WHERE id = ?",
                        [mediaRating, riferimento_id],
                        (err, updateResult) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                            res.json({
                                message: "Commento eliminato e rating aggiornato",
                                nuovo_rating: mediaRating
                            });
                        }
                    );
                }
            );
        });
    });
});



export default router;
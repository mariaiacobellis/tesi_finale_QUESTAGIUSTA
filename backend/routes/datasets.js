import express from "express";
const router = express.Router();

// Registrazione utente
router.post("/add", async (req, res) => {
    const db = req.db; // Connessione al database

    // Estrai i dati e imposta NULL se non esistono
    const {
        author, editor, title, booktitle, pages, series, volume, publisher,
        year, number, location, address, keywords, url, doi, timestamp,
        biburl, bibsource, journal, valutazione, storage
    } = req.body;

    // Converte undefined → NULL per sicurezza
    const publicationData = [
        author || null,
        editor || null,
        title || null,
        booktitle || null,
        pages || null,
        series || null,
        volume || null,
        publisher || null,
        year || null,
        number || null,
        location || null,
        address || null,
        keywords || null,
        url || null,
        doi || null,
        timestamp || null,
        biburl || null,
        bibsource || null,
        journal || null,
        valutazione || null,
        storage
    ];

    const sql = `
        INSERT INTO datasets (
            author, editor, title, booktitle, pages, series, volume, publisher, year,
            number, location, address, keywords, url, doi, timestamp, biburl, bibsource, journal, valutazione, storage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, publicationData, (err, result) => {
        if (err) {
            console.error("❌ Errore nell'inserimento della pubblicazione:", err);
            return res.status(500).json({ error: "Errore nel database", details: err });
        }
        res.json({ message: "✅ Pubblicazione inserita con successo!", id: result.insertId });
    });
});

// Ottenere un dataset specifico
router.get("/get/:id", (req, res) => {
    const id = req.params.id;
    const db = req.db;


    const sql = "SELECT * FROM datasets WHERE id = ?";

    db.query(sql, [id], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(401).json({ message: "Dataset non trovato" });

        res.json({ datasets: results[0] });
    });
});

// Ottenere tutti i dataset presenti nel sistema
router.get("/all", (req, res) => {
    const db = req.db;

    const sql = "SELECT * FROM datasets";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Errore nel recupero dei dataset:", err);
            return res.status(500).json({ error: "Errore nel database", details: err });
        }
        res.json({ datasets: results });
    });
});

export default router;

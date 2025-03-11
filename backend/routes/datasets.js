import express from "express";
import * as path from "node:path";
import * as fs from "node:fs";
import {fileURLToPath} from "url";
const router = express.Router();



const readTSVFile = (nomeFile) => {
    console.log(nomeFile);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "/fileDataset",nomeFile);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const rows = fileContent.split('\n').map(row => row.split('\t'));
    return rows;
};

// Registrazione utente
router.post("/add", async (req, res) => {
    const db = req.db; // Connessione al database

    // Estrai i dati e imposta NULL se non esistono
    const {
        author, editor, title, booktitle, pages, series, volume, publisher,
        year, number, location, address, keywords, url, doi, timestamp,
        biburl, bibsource, journal, valutazione, storage, category, img
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
        rating || null,
        storage,
        category,
        img
    ];

    const sql = `
        INSERT INTO datasets (
            author, editor, title, booktitle, pages, series, volume, publisher, year,
            number, location, address, keywords, url, doi, timestamp, biburl, bibsource, journal, rating, storage, category, img
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

router.get("/getFile/:id", (req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    console.log(req.params.id);

    const data = readTSVFile(req.params.id);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = data.slice(startIndex, endIndex);

    res.json(paginatedData);
} );

export default router;

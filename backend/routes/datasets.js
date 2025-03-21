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
    console.log(req.body)

    // Estrai i dati e imposta NULL se non esistono
    const status = "Pending";
    const {
        author, editor, title, booktitle, pages, series, volume, publisher,
        year, number, location, address, keywords, url, doi, timestamp,
        biburl, bibsource, journal, rating, storage, category, img, numRatings, numUsers, numItems, density
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
        img,
        numRatings || 0.0,
        numUsers || 0.0,
        numItems || 0.0,
        density || 0.0,
        status
    ];

    const sql = `
        INSERT INTO datasets (
            author, editor, title, booktitle, pages, series, volume, publisher, year,
            number, location, address, keywords, url, doi, timestamp, biburl, bibsource, journal, rating, storage, category, img, numRatings, numUsers, numItems, density, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    db.query(sql, publicationData, (err, result) => {
        if (err) {
            console.error("❌ Errore nell'inserimento della pubblicazione:", err);
            return res.status(500).json({ error: "Errore nel database", details: err });
        }
        res.json({ message: "✅ Pubblicazione inserita con successo!", id: result.insertId });
    });
});

router.get("/trending", (req, res) => {
    const db = req.db;

    const sql = "SELECT * FROM datasets WHERE status='Approved' ORDER BY rating DESC LIMIT 3";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Errore nel recupero dei dataset in trending:", err);
            return res.status(500).json({ error: "Errore nel database", details: err });
        }
        res.json({ datasets: results });
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

    const sql = "SELECT * FROM datasets WHERE status='Approved'";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Errore nel recupero dei dataset:", err);
            return res.status(500).json({ error: "Errore nel database", details: err });
        }
        res.json({ datasets: results });
    });
});

// Ottenere tutti i dataset presenti nel sistema
router.get("/all/pending", (req, res) => {
    const db = req.db;

    const sql = "SELECT * FROM datasets WHERE status='Pending'";

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

router.put("/status/:id", (req, res) => {
    const datasetId = req.params.id;
    const db = req.db; // Connessione al database
    const sql = "UPDATE datasets SET status = 'Approved' WHERE id = ?";

    db.query(sql, [datasetId], (err, result) => {
        if (err) {
            console.error("Errore nell'approvazione del dataset:", err);
            return res.status(500).json({ message: "Errore interno del server" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Dataset non trovato" });
        }

        res.status(200).json({ message: "Dataset approvato con successo" });
    });
});

router.delete("/:id", (req, res) => {
    const datasetId = req.params.id;
    const db = req.db; // Connessione al database
    const sql = "DELETE FROM datasets WHERE id = ?";

    db.query(sql, [datasetId], (err, result) => {
        if (err) {
            console.error("Errore nell'eliminazione del dataset:", err);
            return res.status(500).json({ message: "Errore interno del server" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Dataset non trovato" });
        }

        res.status(200).json({ message: "Dataset eliminato con successo" });
    });
});
export default router;

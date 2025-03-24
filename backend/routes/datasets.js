import express from "express";
import * as path from "node:path";
import * as fs from "node:fs";
import {fileURLToPath} from "url";
import * as readline from "readline";
const router = express.Router();


// Route per servire il file
router.get('/download/:id', (req, res) => {
    console.log("entro");
    const id = req.params.id;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, 'fileDataset', id);
    console.log(filePath);
    // Verifica che il file esista
    if (fs.existsSync(filePath)) {
        // Stream del file
        const fileStream = fs.createReadStream(filePath);
        res.setHeader('Content-Disposition', 'attachment; filename="file-1741888336628.tsv"');
        res.setHeader('Content-Type', 'text/tab-separated-values'); // Modifica il tipo MIME se necessario
        fileStream.pipe(res); // Esegui lo stream del file alla risposta
    } else {
        res.status(404).send('File non trovato');
    }
});


const readTSVFile = async (nomeFile, start,end,res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "/fileDataset", nomeFile);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File non trovato" });
    }
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let currentLine = 0;
    let rows = [];
    const batchSize = 20;

    for await (const line of rl) {
        currentLine++;
        if (currentLine < start) continue; // Salta le righe prima di "start"
        if (currentLine > end) break; // Interrompe la lettura quando raggiunge "end"

        const rows_temp = line.split('\t')
        if (rows_temp.length === 1){
            console.log(rows_temp);
            const rows_ok = rows_temp[0].split(',');
            rows.push(rows_ok)
        } else {
            rows.push(line.split('\t'));
        }



        if (rows.length === batchSize) {
            break


        }
    }
    return rows


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
        biburl, bibsource, journal, rating, storage, category, img, numRatings, numUsers, numItems, density, veryColdUser, coldUser, warmUser, hotUser, VeryColdItem, ColdItem, WarmItem, PopularItem
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
        status,
        veryColdUser || 0.0,
        coldUser || 0.0,
        warmUser || 0.0,
        hotUser || 0.0,
        VeryColdItem || 0.0,
        ColdItem || 0.0,
        WarmItem || 0.0,
        PopularItem || 0.0
    ];

    const sql = `
        INSERT INTO datasets (
            author, editor, title, booktitle, pages, series, volume, publisher, year,
            number, location, address, keywords, url, doi, timestamp, biburl, bibsource, journal, rating, storage, category, img, numRatings, numUsers, numItems, density, status, veryColdUser, coldUser, warmUser, hotUser, VeryColdItem, ColdItem, WarmItem, PopularItem
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)
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

router.get("/getFile/:id", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    console.log(req.params.id);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = await readTSVFile(req.params.id, startIndex, endIndex);
    res.json({ data: data });  // Invia i dati come JSON


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

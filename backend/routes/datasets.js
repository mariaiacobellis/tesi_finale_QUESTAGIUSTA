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

// Funzione per inserire i dati nelle tre tabelle
function createDataset(datasetData, categoryData, statisticheData, callback, req) {
    const db = req.db; // Connessione al database
    // Inizia una transazione
    db.beginTransaction(function(err) {
        if (err) {
            return callback(err);
        }

        // Inserisce nella tabella datasets
        const datasetQuery = `
      INSERT INTO datasets (title, descrizione, rating, storage, category, img, status, username) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        db.query(datasetQuery, [datasetData.title, datasetData.descrizione, datasetData.rating, datasetData.storage, datasetData.category, datasetData.img, datasetData.status, datasetData.username], function(err, result) {
            if (err) {
                return db.rollback(function() {
                    callback(err);
                });
            }

            const datasetId = result.insertId;

            // Inserisce più righe nella tabella categorydatasets per ogni elemento di categoryData
            const categoryQuery = `
        INSERT INTO categorydatasets (titolocategoria, valorecategoria, datasetriferimento) 
        VALUES (?, ?, ?)
      `;

            // Eseguiamo gli inserimenti per ogni elemento in categoryData
            const categoryInsertPromises = categoryData.map(item => {
                return new Promise((resolve, reject) => {
                    db.query(categoryQuery, [item.titolocategoria, item.valorecategoria, datasetId], function(err, result) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(result);
                    });
                });
            });

            // Dopo aver inserito tutte le righe per categoryData, proseguiamo con statisticheData
            Promise.all(categoryInsertPromises)
                .then(() => {
                    // Inserisce più righe nella tabella statistichedatasets per ogni elemento di statisticheData
                    const statisticheQuery = `
            INSERT INTO statistichedatasets (titolocategoria, valorecategoria, datasetriferimento) 
            VALUES (?, ?, ?)
          `;

                    // Eseguiamo gli inserimenti per ogni elemento in statisticheData
                    const statisticheInsertPromises = statisticheData.map(item => {
                        return new Promise((resolve, reject) => {
                            db.query(statisticheQuery, [item.titolocategoria, item.valorecategoria, datasetId], function(err, result) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(result);
                            });
                        });
                    });

                    // Dopo aver inserito tutte le righe per statisticheData, confermiamo la transazione
                    Promise.all(statisticheInsertPromises)
                        .then(() => {
                            // Se tutto è andato a buon fine, conferma la transazione
                            db.commit(function(err) {
                                if (err) {
                                    return db.rollback(function() {
                                        callback(err);
                                    });
                                }
                                callback(null, 'Dati inseriti correttamente');
                            });
                        })
                        .catch(err => {
                            db.rollback(function() {
                                callback(err);
                            });
                        });
                })
                .catch(err => {
                    db.rollback(function() {
                        callback(err);
                    });
                });
        });
    });
}

// Registrazione utente
router.post("/add", async (req, res) => {
    const db = req.db; // Connessione al database
    console.log(req.body)

    createDataset(req.body.datasetData, req.body.categoryData, req.body.statisticheData, function(err, message) {
        if (err) {
            console.error('Errore:', err);
            res.status(500).json({ error: "Errore nel database", details: err })
        } else {
            console.log(message);
            res.json({ message: "✅ Pubblicazione inserita con successo!"});
        }
    }, req)


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

const getDatasetById = async (req, res) => {
    const { id } = req.params; // Ottieni l'ID del dataset dalla richiesta
    const db = req.db;
    const connection = await db.getConnection(); // Assicurati di avere una connessione al database

    try {
        // Query per ottenere i dati del dataset
        const [datasetRows] = await connection.query(
            "SELECT * FROM datasets WHERE id = ?",
            [id]
        );

        if (datasetRows.length === 0) {
            return res.status(404).json({ error: "Dataset non trovato" });
        }

        const dataset = datasetRows[0];

        // Query per ottenere i dati di categoria
        const [categoryRows] = await connection.query(
            "SELECT titolocategoria, valorecategoria FROM categorydatasets WHERE datasetriferimento = ?",
            [id]
        );

        // Query per ottenere i dati delle statistiche
        const [statisticheRows] = await connection.query(
            "SELECT titolocategoria, valorecategoria FROM statistichedatasets WHERE datasetriferimento = ?",
            [id]
        );

        // Costruisci l'output secondo il formato richiesto
        const result = {
            datasetData: {
                title: dataset.title,
                descrizione: dataset.descrizione,
                rating: dataset.rating,
                storage: dataset.storage,
                category: dataset.category,
                img: dataset.img,
                status: dataset.status, // Se status è null, metti "Pending"
                username: dataset.username,
            },
            categoryData: categoryRows, // Array di categorie associate
            statisticheData: statisticheRows // Array di statistiche associate
        };

        res.json(result);
    } catch (error) {
        console.error("Errore nel recupero del dataset:", error);
        res.status(500).json({ error: "Errore del server" });
    } finally {
        connection.release(); // Rilascia la connessione
    }
};


// Ottenere un dataset specifico
router.get("/get/:id", async (req, res) => {

    const db = req.db;


    const { id } = req.params;

    try {
        // Query per ottenere i dati del dataset
        const [datasetRows] = await db.query("SELECT * FROM datasets WHERE id = ?", [id]);

        if (datasetRows.length === 0) {
            return res.status(404).json({ error: "Dataset non trovato" });
        }

        const dataset = datasetRows[0];

        // Eseguiamo entrambe le altre query in parallelo
        const [categoryRows, statisticheRows] = await Promise.all([
            db.query("SELECT titolocategoria, valorecategoria FROM categorydatasets WHERE datasetriferimento = ?", [id]),
            db.query("SELECT titolocategoria, valorecategoria FROM statistichedatasets WHERE datasetriferimento = ?", [id]),
        ]);

        // Costruiamo l'oggetto di risposta
        const result = {
            datasetData: {
                title: dataset.title,
                descrizione: dataset.descrizione,
                rating: dataset.rating || 0.0,
                storage: dataset.storage,
                category: dataset.category,
                img: dataset.img,
                status: dataset.status || "Pending",
                username: dataset.username,
            },
            categoryData: categoryRows[0], // Array di categorie associate
            statisticheData: statisticheRows[0], // Array di statistiche associate
        };

        res.json(result);
    } catch (error) {
        console.error("Errore nel recupero del dataset:", error);
        res.status(500).json({ error: "Errore del server" });
    }
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
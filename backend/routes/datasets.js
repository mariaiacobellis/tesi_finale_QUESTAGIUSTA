import express from "express";
import * as path from "node:path";
import * as fs from "node:fs";
import {fileURLToPath} from "url";
import * as readline from "readline";
const router = express.Router();



router.get('/download/:id', (req, res) => {
    console.log("entro");
    const id = req.params.id;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, 'fileDataset', id);
    console.log(filePath);

    if (fs.existsSync(filePath)) {
        // Stream del file
        const fileStream = fs.createReadStream(filePath);
        res.setHeader('Content-Disposition', 'attachment; filename="file-1741888336628.tsv"');
        res.setHeader('Content-Type', 'text/tab-separated-values');
        fileStream.pipe(res);
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

function getDataset(id, req) {
    return new Promise((resolve, reject) => {
        const db = req.db; // Connessione al database

        db.beginTransaction((err) => {
            if (err) {
                return reject(err);
            }

            const resultData = {}
            const datasetQuery = `SELECT * FROM  datasets WHERE id = ?`;

            db.query(datasetQuery, [id], (err, result) => {
                if (err) {
                    return db.rollback(() => reject(err));
                }
                resultData.dataset = result

                const categoryQuery = `SELECT titolocategoria, valorecategoria FROM categorydatasets WHERE datasetriferimento = ?`;

                db.query(categoryQuery, [id], (err, categoryResult) => {
                    if (err) {
                        return db.rollback(() => reject(err));
                    }
                    resultData.category = categoryResult;

                    const statisticheQuery = `SELECT titolocategoria, valorecategoria FROM statistichedatasets WHERE datasetriferimento = ?`;

                    db.query(statisticheQuery, [id], (err, statisticheResult) => {
                        if (err) {
                            return db.rollback(() => reject(err));
                        }
                        resultData.statistiche = statisticheResult;

                        // Se tutto è andato bene, effettuiamo il commit
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => reject(err));
                            }
                            resolve(resultData); // Restituisce il risultato completo
                        });
                    });
                });
            });
        });
    });
}

// Ottenere un dataset specifico
router.get("/get/:id", async (req, res) => {


    getDataset(req.params.id, req).then((data) => {
        res.json(data)
    })
        .catch((err) => {
            res.status(500).json({ error: "Errore nel database", details: err })
            console.error("Errore:", err);
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

function deleteDataset(id, req) {
    return new Promise((resolve, reject) => {
        const db = req.db; // Connessione al database

        db.beginTransaction((err) => {
            if (err) {
                return reject(err);
            }

            // Query per eliminare i commenti relativi al dataset
            const deleteCommentsQuery = "DELETE FROM comments WHERE riferimento_id = ?";

            db.query(deleteCommentsQuery, [id], (err, commentsResult) => {
                if (err) {
                    return db.rollback(() => reject(err));
                }

                // Query per eliminare le categorie associate al dataset
                const deleteCategoriesQuery = "DELETE FROM categorydatasets WHERE datasetriferimento = ?";

                db.query(deleteCategoriesQuery, [id], (err, categoryResult) => {
                    if (err) {
                        return db.rollback(() => reject(err));
                    }

                    // Query per eliminare le statistiche associate al dataset
                    const deleteStatisticheQuery = "DELETE FROM statistichedatasets WHERE datasetriferimento = ?";

                    db.query(deleteStatisticheQuery, [id], (err, statisticheResult) => {
                        if (err) {
                            return db.rollback(() => reject(err));
                        }

                        // Query per eliminare il dataset stesso
                        const deleteDatasetQuery = "DELETE FROM datasets WHERE id = ?";

                        db.query(deleteDatasetQuery, [id], (err, datasetResult) => {
                            if (err) {
                                return db.rollback(() => reject(err));
                            }

                            // Se tutto è andato bene, effettuiamo il commit
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => reject(err));
                                }
                                resolve({
                                    message: "Dataset eliminato con successo",
                                    affectedRows: {
                                        comments: commentsResult.affectedRows,
                                        categories: categoryResult.affectedRows,
                                        statistiche: statisticheResult.affectedRows,
                                        dataset: datasetResult.affectedRows
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

router.delete("/:id", (req, res) => {
    const datasetId = req.params.id;

    deleteDataset(datasetId,req).then((data) => {
        res.json(data)
    })
        .catch((err) => {
            res.status(500).json({ error: "Errore nel database", details: err })
            console.error("Errore:", err);
        });

});
export default router;
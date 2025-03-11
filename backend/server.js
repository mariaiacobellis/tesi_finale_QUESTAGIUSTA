import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2";
import cors from "cors"; //sistema di sicurezza

import auth from "./routes/auth.js"
import datasets from "./routes/datasets.js"; //cripta la password nel database

//Da tenere sempre sopra tutto
const app = express();
app.use(express.json());
app.use(cors());



// Connessione temporanea senza DB per crearlo
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connetti a MySQL
db.connect((err) => {
    if (err) {
        console.error("Errore di connessione a MySQL:", err);
        return;
    }
    console.log("Connesso a MySQL!");

    // **Crea il database se non esiste**
    db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err, result) => {
        if (err) {
            console.error("Errore nella creazione del database:", err);
            return;
        }
        console.log(`Database ${process.env.DB_NAME} pronto!`);

        // Ora connettiamo al database appena creato
        const dbWithDB = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        dbWithDB.connect((err) => {
            if (err) {
                console.error("Errore di connessione al DB:", err);
                return;
            }
            console.log("Connesso al database:", process.env.DB_NAME);

            // Crea la tabella utenti se non esiste
            const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
        )
      `;



            dbWithDB.query(createUsersTable, (err, result) => {
                if (err) {
                    console.error("Errore nella creazione della tabella utenti:", err);
                    return;
                }
                console.log("Tabella 'users' pronta!");
            });

            const createDatasetsTable = `
    CREATE TABLE IF NOT EXISTS datasets ( 
        id INT AUTO_INCREMENT PRIMARY KEY,
        author TEXT,
        editor TEXT,
        title TEXT NOT NULL,
        booktitle TEXT,
        pages TEXT,
        series TEXT,
        volume TEXT,
        publisher TEXT,
        year TEXT,
        number TEXT,
        location TEXT,
        address TEXT,
        keywords TEXT,
        url TEXT,
        doi TEXT,
        timestamp TEXT,
        biburl TEXT,
        bibsource TEXT,
        journal TEXT,
        valutazione FLOAT,
        storage VARCHAR(255) NOT NULL UNIQUE )  `;

            dbWithDB.query(createDatasetsTable, (err, result) => {
                if (err) {
                    console.error("Errore nella creazione della tabella dataset:", err);
                    return;
                }
                console.log("Tabella 'dataset' pronta!");
            });












        }); //chiusura connessione

    });
});




app.use((req,res,next)=>{
    req.db = db
    next()
});
app.use("/auth", auth)
app.use("/datasets", datasets)
app.listen(5000, () => console.log("Server avviato su http://localhost:5000"));
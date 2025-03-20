import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2";
import cors from "cors"; // sistema di sicurezza

import auth from "./routes/auth.js";
import datasets from "./routes/datasets.js";
import comments from "./routes/comments.js";

import multer from "multer";
import * as path from "node:path";
import {fileURLToPath} from "url";
import * as fs from "node:fs";
import discussions from "./routes/discussions.js";



const app = express();
app.use(express.json());
app.use(cors());

// Connessione al database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connessione al database
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

            // Creazione delle tabelle
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
                    rating FLOAT,
                    storage VARCHAR(255) NOT NULL UNIQUE,
                    category TEXT NOT NULL,
                    img TEXT,
                    numRatings FLOAT ,  -- Numero di valutazioni
                    numUsers FLOAT,    -- Numero di utenti
                    numItems FLOAT ,    -- Numero di item
                    density FLOAT,  -- Densità del dataset
                    status TEXT
                )
            `;
            dbWithDB.query(createDatasetsTable, (err, result) => {
                if (err) {
                    console.error("Errore nella creazione della tabella dataset:", err);
                    return;
                }
                console.log("Tabella 'dataset' pronta!");
            });

            //Creazione della tabella commenti
            const createCommentsTable = `
                CREATE TABLE IF NOT EXISTS comments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    riferimento_id INT NOT NULL,
                    riferimento_tipo TEXT NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    comment TEXT NOT NULL,
                    rating FLOAT, 
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;
            dbWithDB.query(createCommentsTable, (err, result) => {
                if (err) {
                    console.error("Errore nella creazione della tabella commenti:", err);
                    return;
                }
                console.log("Tabella 'comments' pronta!");
            });

            const createDiscussionsTable = `
                CREATE TABLE IF NOT EXISTS discussions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    titolo TEXT NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    text_discussion TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;
            dbWithDB.query(createDiscussionsTable, (err, result) => {
                if (err) {
                    console.error("Errore nella creazione della tabella discussions:", err);
                    return;
                }
                console.log("Tabella 'discussions' pronta!");
            });

        });
    });
});



const upload=multer({dest:'uploads/'})
// Iniettiamo la connessione al db nelle richieste
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.post('/image',upload.single('image'),(req,res)=>{
    if(!req.file){
        res.send({code:500,msg:'err'})
    }else{
        res.send(req.file.filename)
    }
})




// Configurazione di Multer per salvare i file nella cartella 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'routes/fileDataset/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const uploadFile = multer({ storage });


// Endpoint per gestire l'upload del file
app.post("/upload/file", uploadFile.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato." });
    }

    // Legge il file TSV


        res.json({ message: "File caricato con successo!", data: req.file.path});

});
app.get('/image/:id',(req,res)=>{
    res.contentType('image/jpeg');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    res.sendFile(path.join(__dirname,'/uploads',req.params.id));

})
app.use("/auth", auth);
app.use("/datasets", datasets);
app.use("/comments", comments);
app.use("/discussions", discussions)

app.listen(5000, () => console.log("Server avviato su http://localhost:5000"));

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardMedia, CardContent, Button, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from "@mui/material";
import { tokens } from "../src/theme";
import data from "../src/data";  // Assicurati che il percorso di importazione dei dati sia corretto
import DownloadIcon from '@mui/icons-material/Download';

const DatasetDetail = () => {
    const { id } = useParams();  // Ottieni l'ID dai parametri della URL
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dataset = data.find((d) => d.id === id);  // Trova il dataset con l'ID

    const [rating, setRating] = useState(0);

    if (!dataset) {
        return <Typography variant="h4" color="error">Dataset non trovato</Typography>;
    }

    // Esempio di dati tabellari (puoi sostituirli con dati reali)
    const sampleData = [
        { nome: "Damiano David", punteggio: 85 },
        { nome: "Harry Styles", punteggio: 78 },
        { nome: "Olly", punteggio: 92 },
        { nome: "The kolors", punteggio: 65 },
    ];

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
            <Card sx={{ maxWidth: 800, width: '100%', backgroundColor: colors.primary[400], boxShadow: 3, borderRadius: 2, mb: 3 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={dataset.image}
                    alt={dataset.title}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom color={colors.blueAccent[500]}>
                        {dataset.title}
                    </Typography>
                    <Typography variant="body1" color={colors.grey[100]} mb={2}>
                        {dataset.description}
                    </Typography>
                    <Typography variant="subtitle1" color={colors.greenAccent[500]}>
                        Categoria: {dataset.category}
                    </Typography>

                    {/* Sezione di valutazione */}
                    <Box mt={2} display="flex" alignItems="center">
                        <Typography variant="body1" color={colors.grey[100]} mr={1}>
                            Valutazione:
                        </Typography>
                        <Rating
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                            precision={0.5}
                        />
                    </Box>

                    {/* Pulsante di download */}
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2, display: 'flex', alignItems: 'center' }}
                        onClick={() => alert("Download avviato!")}
                    >
                        <DownloadIcon sx={{ mr: 1 }} /> {/* Aggiungi l'icona */}
                        Scarica Dataset
                    </Button>
                </CardContent>
            </Card>

            {/* Tabella dei dati */}
            <TableContainer component={Paper} sx={{ maxWidth: 800, backgroundColor: colors.primary[400] }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: colors.grey[100] }}>Nome</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Punteggio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sampleData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ color: colors.grey[100] }}>{row.nome}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{row.punteggio}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DatasetDetail;




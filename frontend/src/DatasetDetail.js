import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box, Typography, Card, CardMedia, CardContent, Button, Rating,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Grid, Chip, useTheme
} from "@mui/material";
import { tokens } from "../src/theme";
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";

const DatasetDetail = () => {
    const { id } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dataset, setDataset] = useState(null);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                console.log("Fetching dataset with ID:", id);
                const response = await axios.get(`http://localhost:5000/datasets/get/${id}`);
                console.log("Response:", response.data);

                if (response.data.datasets) {
                    setDataset(response.data.datasets);
                } else {
                    console.error("Nessun dataset trovato nella risposta!");
                }
            } catch (error) {
                console.error("Errore nel fetch del dataset:", error);
            }
        };

        fetchDataset();
    }, [id]);

    if (!dataset) {
        return <Typography variant="h4" color="error">Dataset non trovato</Typography>;
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
            <Card sx={{ maxWidth: 800, width: '100%', backgroundColor: colors.primary[400], boxShadow: 3, borderRadius: 2, mb: 3 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={dataset?.image || "default-image.jpg"}
                    alt={dataset?.title || "Dataset"}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom color={colors.blueAccent[500]}>
                        {dataset?.title}
                    </Typography>
                    <Typography variant="body1" color={colors.grey[100]} mb={2}>
                        {dataset?.description}
                    </Typography>
                    <Typography variant="subtitle1" color={colors.greenAccent[500]}>
                        Categoria: {dataset?.category}
                    </Typography>

                    {/* Griglia con tutti i campi */}
                    <Grid container spacing={2} mt={2}>
                        {[
                            { key: "author", label: "Autore" },
                            { key: "editor", label: "Editor" },
                            { key: "booktitle", label: "Titolo del Libro" },
                            { key: "pages", label: "Pagine" },
                            { key: "series", label: "Serie" },
                            { key: "volume", label: "Volume" },
                            { key: "publisher", label: "Editore" },
                            { key: "year", label: "Anno" },
                            { key: "number", label: "Numero" },
                            { key: "location", label: "Luogo" },
                            { key: "address", label: "Indirizzo" },
                            { key: "biburl", label: "BibURL" },
                            { key: "bibsource", label: "Fonte Bibliografica" },
                            { key: "journal", label: "Giornale" },
                            { key: "timestamp", label: "Timestamp" },
                            { key: "valutazione", label: "Valutazione" },
                        ].map(({ key, label }) =>
                            dataset?.[key] ? (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Typography variant="body1" color={colors.grey[100]}>
                                        <strong>{label}:</strong> {dataset[key]}
                                    </Typography>
                                </Grid>
                            ) : null
                        )}

                        {/* Keywords con i Chip */}
                        {dataset?.keywords && (
                            <Grid item xs={12}>
                                <Typography variant="body2" color={colors.grey[100]} gutterBottom>
                                    🔑 Parole chiave:
                                </Typography>
                                <Grid container spacing={1}>
                                    {dataset.keywords.split(",").map((keyword, index) => (
                                        <Grid item key={index}>
                                            <Chip label={keyword.trim()} color="primary" />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        )}

                        {/* Link URL */}
                        {dataset?.url && (
                            <Grid item xs={12}>
                                <Button variant="outlined" color="info" href={dataset.url} target="_blank">
                                    🔗 Apri URL
                                </Button>
                            </Grid>
                        )}

                        {/* DOI */}
                        {dataset?.doi && (
                            <Grid item xs={12}>
                                <Button variant="outlined" color="info" href={`https://doi.org/${dataset.doi}`} target="_blank">
                                    📄 Apri DOI
                                </Button>
                            </Grid>
                        )}

                        {/* Pulsante di download */}
                        {dataset?.storage && (
                            <Grid item xs={12}>
                                <Button variant="contained" color="secondary" onClick={() => alert("Download in corso!")}>
                                    <DownloadIcon sx={{ mr: 1 }} />
                                    Scarica Dataset
                                </Button>
                            </Grid>
                        )}
                    </Grid>

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
                        {[
                            { nome: "Damiano David", punteggio: 85 },
                            { nome: "Harry Styles", punteggio: 78 },
                            { nome: "Olly", punteggio: 92 },
                            { nome: "The Kolors", punteggio: 65 },
                        ].map((row, index) => (
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







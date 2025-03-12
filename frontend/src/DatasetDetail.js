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
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from "react-router-dom";
import {object} from "yup";


const DatasetDetail = () => {
    const { id } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dataset, setDataset] = useState(null);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/datasets/getFile/${dataset.storage}`, {
                params: { page, limit: 20 }, // Limit di 20 per pagina, puoi regolarlo
            });

            if (response.data.length === 0) {
                setHasMore(false); // Se non ci sono più dati, non continuare il caricamento
            } else {
                setRows((prevRows) => [...prevRows, ...response.data]);

                console.log(response.data[0]);
                // Imposta dinamicamente le colonne usando i nomi della prima riga dei dati
                const dynamicColumns = Object.keys(response.data[0]).map(key => ({
                    id: key,
                    label: response.data[0][key] // Formatta il nome della colonna

                }));
                setColumns(dynamicColumns);


                setPage(page + 1);
            }
        } catch (error) {
            console.error('Errore nel caricamento dei dati della tabella:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                console.log("Fetching dataset with ID:", id);
                const response = await axios.get(`http://localhost:5000/datasets/get/${id}`);
                console.log("Response:", response.data);

                if (response.data.datasets) {
                    setDataset(response.data.datasets);
                    console.log(dataset);
                } else {
                    console.error("Nessun dataset trovato nella risposta!");
                }
            } catch (error) {
                console.error("Errore nel fetch del dataset:", error);
            }
        };

        fetchDataset();

        if (dataset){
            fetchData();
        }

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
                    image={dataset?.img || "default-image.jpg"}
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
                        {Object.entries(dataset || {})
                            .filter(([key, value]) =>
                                value &&
                                !["keywords", "storage", "category", "img", "rating", "id", "numRatings", "numUsers", "numItems", "density"].includes(key)
                            )
                            .map(([key, value]) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Typography variant="body1" color={colors.grey[100]}>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                                    </Typography>
                                </Grid>
                            ))}

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

                    <Box mt={2} display="flex" alignItems="center">
                        <Typography variant="body1" color={colors.grey[100]} mr={1}>
                            Valutazione:
                        </Typography>
                        {dataset?.rating!== undefined ? (
                            <Rating
                                value={dataset.rating} // Usa il valore del rating che è già stato impostato
                                readOnly // Disabilita la modifica
                                precision={0.5} // Imposta la precisione a 0.5 stelle
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: 'gold', // Colora le stelle piene di giallo
                                    },
                                    '& .MuiRating-iconEmpty': {
                                        color: colors.grey[500], // Colora le stelle vuote di grigio per visibilità
                                    },
                                }}
                            />
                        ) : (
                            <Typography variant="body1" color={colors.grey[100]}>
                                Nessuna valutazione disponibile
                            </Typography>
                        )}
                    </Box>



                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/discussion/${id}`)}
                        sx={{ mt: 2 }}
                    >
                        Vota e commenta dataset
                    </Button>
                </CardContent>
            </Card>

            {/* Tabella con infinite scroll */}
            <TableContainer component={Paper} sx={{ maxWidth: 800, backgroundColor: colors.primary[400] }}>
                <InfiniteScroll
                    dataLength={rows.length} // La lunghezza attuale dei dati
                    next={fetchData} // Funzione di caricamento dei dati
                    hasMore={hasMore} // Controlla se ci sono ancora dati da caricare
                    loader={<h4>Caricamento...</h4>}
                    endMessage={<p>Fine dei dati</p>}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                {/* Righe con le informazioni aggiuntive */}
                                <TableCell sx={{ color: colors.grey[100] }}><strong>N. ratings:</strong> {dataset?.numRatings || "Dati non disponibili"}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}><strong>N. utenti:</strong> {dataset?.numUsers || "Dati non disponibili"}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}><strong>N. item:</strong> {dataset?.numItems || "Dati non disponibili"}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}><strong>Density:</strong> {dataset?.density || "Dati non disponibili"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    {/* Genera dinamicamente le righe della tabella */}
                                    {columns.map((col) => (
                                        <TableCell key={col.id} sx={{ color: colors.grey[100] }}>
                                            {row[col.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </InfiniteScroll>
            </TableContainer>
        </Box>
    );
};

export default DatasetDetail;







import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box, Typography, Card, CardMedia, CardContent, Button, Rating,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Grid, useTheme, Modal, Backdrop, CircularProgress
} from "@mui/material";
import { tokens } from "../src/theme";
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const DatasetDetail = () => {
    const {id} = useParams();
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
    const [category, setCategory] = useState([]);
    const [statistiche, setStatistiche] = useState([]);
    const [download, setDownload] = useState(false)


    // Funzione per il download del file
    const downloadFile = () => {
        let id = dataset.storage;
        setDownload(true)
        fetch(`http://localhost:5000/datasets/download/${id}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Errore durante il download");
                }
                // Scarica il file come Blob
                return response.blob();
            })
            .then((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob); // Crea un URL temporaneo per il file
                setDownload(false)
                link.download = dataset.storage; // Imposta il nome del file
                link.click(); // Avvia il download
            })
            .catch((error) => {
                console.error('Errore durante il download:', error);
            });
    };



    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/datasets/getFile/${dataset.storage}`, {
                params: { page, limit: 20 },
            });

            if (response.data.data.length === 0) {
                setHasMore(false);
            } else {
                setRows((prevRows) => [...prevRows, ...response.data.data]);

                console.log(response.data.data[0]);

                const dynamicColumns = Object.keys(response.data.data[0]).map(key => ({
                    id: key,
                    label: response.data.data[0][key]
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

                console.log(response.data.dataset);

                if (response.data.dataset[0]) {
                    console.log("entro");
                    setDataset(response.data.dataset[0]);
                    console.log(dataset);
                    const categoryMap = Object.fromEntries(response.data.category.map(item => [item.titolocategoria, item.valorecategoria]));
                    setCategory(categoryMap);
                    const statisticheMap = Object.fromEntries(response.data.statistiche.map(item => [item.titolocategoria, item.valorecategoria]));
                    setStatistiche(statisticheMap);
                    console.log(categoryMap);
                } else {
                    console.error("Nessun dataset trovato nella risposta!");
                }
            } catch (error) {
                console.error("Errore nel fetch del dataset:", error);
            }
        };

        fetchDataset();

        if (dataset) {
            fetchData();
        }

    }, [id]);

    if (!dataset) {
        return <Typography variant="h4" color="error">Dataset non trovato</Typography>;
    }



    const histogramData = {
        labels: ['Very Cold', 'Cold', 'Warm', 'Hot'],
        datasets: [
            {
                label: `Number of user: ${statistiche.numUsers}`,
                data: [statistiche.veryColdUser, statistiche.coldUser, statistiche.warmUser, statistiche.hotUser],
                backgroundColor: colors.blueAccent[500],
                borderColor: colors.blueAccent[800],
                borderWidth: 1,
            },
        ],
    };





    const histogramData2 = {
        labels: ['Very Cold', 'Cold', 'Warm', 'Popular'], // Nuove etichette per il grafico
        datasets: [
            {
                label: `Number of items: ${statistiche.numItems}`,
                data: [statistiche.VeryColdItem, statistiche.ColdItem, statistiche.WarmItem, statistiche.PopularItem],
                backgroundColor: colors.blueAccent[500],
                borderColor: colors.blueAccent[800],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <Box p={3} sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            {<Modal open={download} aria-labelledby="loading-modal" aria-describedby="loading-data">
                <Backdrop open={download} sx={{ zIndex: 1200, color: colors.grey[400] }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: colors.primary[400],
                            borderRadius: 2,
                            p: 4,
                            boxShadow: 24,
                            minWidth: 320,
                        }}
                    >
                        <CircularProgress color="inherit" size={60} thickness={4.5} />
                        <Typography variant="h6" sx={{ mt: 2, color: colors.grey[400], fontWeight: "bold" }}>
                            Download in corso...
                        </Typography>
                    </Box>
                </Backdrop>
            </Modal>}
            {/* Contenitore superiore */}
            <Card sx={{ width: '100%', backgroundColor: colors.primary[400], boxShadow: 3, borderRadius: 2, mb: 3 }}>
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
                        {dataset?.descrizione}
                    </Typography>
                    <Typography variant="subtitle1" color={colors.greenAccent[500]}>
                        Categoria: {dataset?.category}
                    </Typography>


                    <Grid container spacing={2} mt={2} sx={{ maxWidth: '100%', width: '100%' }}>
                        {Object.entries(category || {})
                            .filter(([key, value]) =>
                                value &&
                                !["keywords", "storage", "category", "img", "rating", "id", "numRatings", "numUsers", "numItems", "density", "status", "title"].includes(key)
                            )
                            .map(([key, value]) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Typography variant="body1" color={colors.grey[100]}>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                                    </Typography>
                                </Grid>
                            ))}


                        {category?.url && (
                            <Grid item xs={12}>
                                <Button variant="outlined" color="info" href={category.url} target="_blank">
                                    🔗 Apri URL
                                </Button>
                            </Grid>
                        )}


                        {category?.doi && (
                            <Grid item xs={12}>
                                <Button variant="outlined" color="info" href={`https://doi.org/${category.doi}`} target="_blank">
                                    📄 Apri DOI
                                </Button>
                            </Grid>
                        )}


                        {dataset?.storage && (
                            <Grid item xs={12}>
                                <Button variant="contained" color="secondary" onClick={() => downloadFile()}>
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
                        {dataset?.rating !== undefined ? (
                            <Rating
                                value={dataset.rating}
                                readOnly
                                precision={0.5}
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: 'gold',
                                    },
                                    '& .MuiRating-iconEmpty': {
                                        color: colors.grey[500],
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
                        onClick={() => navigate(`/vote/${id}`)}
                        sx={{ mt: 2 }}
                    >
                        Vota e commenta dataset
                    </Button>

                </CardContent>
            </Card>

            {/* Contenitore inferiore (tabella) */}
            <TableContainer component={Paper} sx={{ width: '100%', backgroundColor: colors.primary[400] }}>
                <InfiniteScroll
                    dataLength={rows.length}
                    next={fetchData}
                    hasMore={hasMore}
                    loader={<h4>Caricamento...</h4>}
                    endMessage={<p>Fine dei dati</p>}
                >
                    <Table>
                        <TableHead>
                            <TableRow>

                                <TableCell sx={{ color: colors.grey[100], height: "100px", width: "100px" }}>
                                    <Bar data={histogramData} options={chartOptions} />
                                </TableCell>
                                <TableCell sx={{ color: colors.grey[100], height: "100px", width: "100px" }}>
                                    <Bar data={histogramData2} options={chartOptions} />
                                </TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}><strong>N. ratings:</strong> {statistiche?.numRatings || "Dati non disponibili"}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}><strong>Density:</strong> {statistiche?.density || "Dati non disponibili"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    {Object.entries(row).map(([key, value]) => (
                                        <TableCell key={key}>{value}</TableCell>
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










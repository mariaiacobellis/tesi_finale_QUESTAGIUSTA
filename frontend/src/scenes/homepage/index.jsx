import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [trendingDatasets, setTrendingDatasets] = useState([]);

    useEffect(() => {
        // Funzione per ottenere i trending datasets
        const fetchTrendingDatasets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/datasets/trending');
                if (response.data.datasets) {
                    setTrendingDatasets(response.data.datasets);
                }
            } catch (error) {
                console.error("Errore nel recupero dei trending datasets:", error);
            }
        };

        fetchTrendingDatasets();
    }, []);

    return (
        <>
            {/* Hero Section con immagine di sfondo */}
            <Card
                sx={{
                    minHeight: "50vh",
                    width: "95%",
                    maxWidth: "700px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: colors.primary[400],
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    textAlign: "center",
                    color: colors.grey[100],
                    p: 6,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h2" sx={{ fontWeight: "bold", fontSize: "3.5rem", mb: 2 }}>
                        Scopri e Condividi i Migliori Dataset
                    </Typography>
                    <Typography variant="h5" sx={{ fontSize: "1.5rem", mb: 4 }}>
                        Trova dati di qualità per i tuoi progetti di machine learning, ricerca e analisi.
                        Condividi i tuoi dataset con la community e valorizza il tuo lavoro!
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: colors.blueAccent[500],
                            color: colors.grey[100],
                            fontSize: "1.2rem",
                            padding: "12px 24px",
                            borderRadius: "30px",
                            transition: "all 0.3s ease",
                            "&:hover": { backgroundColor: colors.blueAccent[600] },
                        }}
                        size="large"
                        onClick={() => navigate("/datasets")}
                    >
                        Esplora Dataset
                    </Button>
                </CardContent>
            </Card>

            {/* Trending Dataset Section */}
            <Box sx={{ p: 6, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: colors.blueAccent[700] }}>
                    📈 Trending Dataset
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {trendingDatasets.length > 0 ? (
                        trendingDatasets.map((dataset, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ borderRadius: "15px", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", backgroundColor: colors.primary[400] }}>
                                    <CardContent>
                                        {/* Se il dataset ha un'immagine, mostralo */}
                                        {dataset.img && (
                                            <CardMedia
                                                component="img"
                                                alt={dataset.title}
                                                height="140"
                                                image={dataset.img}
                                                sx={{ marginBottom: 2 }}
                                            />
                                        )}
                                        <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
                                            {dataset.title} {/* Usa il titolo del dataset */}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                mt: 2,
                                                borderColor: colors.blueAccent[500],
                                                color: colors.blueAccent[500],
                                                "&:hover": { backgroundColor: colors.blueAccent[100] },
                                            }}
                                            onClick={() => navigate(`/datasets/${dataset.id}`)}
                                        >
                                            Scopri di più
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
                            Nessun dataset trending trovato.
                        </Typography>
                    )}
                </Grid>
            </Box>

            {/* Community Section */}
            <Box sx={{ p: 6, textAlign: "center", backgroundColor: colors.grey[50] }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: colors.blueAccent[700] }}>
                    🤝 Unisciti alla Community
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontSize: "1.2rem",
                        maxWidth: "800px",
                        margin: "0 auto",
                        mb: 4,
                        color: colors.grey[100],
                    }}
                >
                    Condividi il tuo sapere, partecipa a competizioni di analisi dati e migliora le tue competenze
                    grazie alla collaborazione con esperti del settore.
                </Typography>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: colors.blueAccent[500],
                        "&:hover": { backgroundColor: colors.blueAccent[600] },
                        color: colors.grey[100],
                        fontSize: "1.2rem",
                        padding: "12px 24px",
                        borderRadius: "30px",
                        transition: "all 0.3s ease",
                    }}
                    size="large"
                    onClick={() => navigate("/register")}
                >
                    Partecipa Ora
                </Button>
            </Box>
        </>
    );
};

export default Homepage;



























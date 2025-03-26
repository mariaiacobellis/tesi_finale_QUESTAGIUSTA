import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import DataList from '../../components/DatasetList';
import Header from '../../components/Header';
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { tokens } from '../../theme';

const Datasets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [allDatasets, setAllDatasets] = useState([]);
    const [trendingDatasets, setTrendingDatasets] = useState([]);

    const groupByCategory = (data) => {
        return data.reduce((acc, dataset) => {
            if (!acc[dataset.category]) {
                acc[dataset.category] = [];
            }
            acc[dataset.category].push(dataset);
            return acc;
        }, {});
    };

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                console.log("Fetching all datasets...");
                const response = await axios.get('http://localhost:5000/datasets/all');
                console.log("Response:", response.data);
                if (response.data.datasets) {
                    setAllDatasets(response.data.datasets);
                } else {
                    console.error("Nessun dataset trovato nella risposta!");
                }
            } catch (error) {
                console.error("Errore nel fetch dei dataset:", error);
            }
        };

        const fetchTrendingDatasets = async () => {
            try {
                console.log("Fetching trending datasets...");
                const response = await axios.get('http://localhost:5000/datasets/trending');
                console.log("Trending Datasets Response:", response.data);
               
                if (response.data.datasets) {
                    setTrendingDatasets(response.data.datasets);
                } else {
                    console.error("Nessun dataset trending trovato nella risposta!");
                }
            } catch (error) {
                console.error("Errore nel fetch dei trending dataset:", error);
            }
        };

        fetchDatasets();
        fetchTrendingDatasets();
    }, []);

    const groupedDatasets = groupByCategory(allDatasets);

    return (
        <Box sx={{  minHeight: '100vh' }}>
            <Container sx={{ padding: 2 }}>
                <Header
                    title="Esplora i Dataset"
                    subtitle="Trova i migliori dataset per il tuo progetto di machine learning, computer vision e altro."
                />

                {/* Trending Datasets */}
                <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 2 }}>
                        Trending Datasets
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {trendingDatasets.length > 0 ? (
                            trendingDatasets.map((dataset) => (
                                <Grid item xs={12} sm={6} md={4} key={dataset.id || dataset.name}>
                                    <DataList datasets={[dataset]} showNavigation={false} /> {/* Passa showNavigation={false} */}
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
                                Nessun dataset trending trovato.
                            </Typography>
                        )}
                    </Grid>
                </Box>

                {/* Datasets by Category */}
                <Box sx={{ width: "90%", margin: "auto", marginTop: 4 }}>
                    {Object.entries(groupedDatasets).map(([category, items]) => (
                        <Box key={category} sx={{ marginBottom: 4 }}>
                            <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 4, fontWeight: "bold" }}>
                                {category}
                            </Typography>
                            <Grid container spacing={2} justifyContent="center">
                                <DataList datasets={items} />
                            </Grid>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default Datasets;





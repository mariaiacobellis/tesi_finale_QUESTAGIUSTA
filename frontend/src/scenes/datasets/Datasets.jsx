import React, {useEffect, useState} from 'react';
import {Container, Box, ThemeProvider, Typography, Grid} from '@mui/material';
import DataList from '../../components/DatasetList';
import Header from '../../components/Header';  // Importa il componente Header
import {tokens, useMode} from '../../theme';
import {useTheme} from "@mui/material/styles"; // Importa il tema da theme.js
import axios from "axios";


const Datasets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);



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
                    setData(response.data.datasets); // Aggiorna lo stato con i dataset ottenuti
                } else {
                    console.error("Nessun dataset trovato nella risposta!");
                }
            } catch (error) {
                console.error("Errore nel fetch dei dataset:", error);
            }
        };
        fetchDatasets(); // Chiamata all'API
    }, []); // Esegui solo al primo render


    const groupedDatasets = groupByCategory(data);




    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Container sx={{padding:2}}>
                    <Header
                        title="Esplora i Dataset"
                        subtitle="Trova i migliori dataset per il tuo progetto di machine learning, computer vision e altro."
                    />
                    <DataList datasets={data} />
                    <Box sx={{ width: "90%", margin: "auto", marginTop:4 }}>
                        {Object.entries(groupedDatasets).map(([category, items]) => (
                            <Box key={category} sx={{ marginBottom: 4 }}>
                                {/* Titolo della categoria con margine aggiuntivo */}
                                <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 4, fontWeight: "bold" }}>
                                    {category}
                                </Typography>

                                {/* Contenitore delle card */}
                                <Grid container spacing={2} justifyContent="center">
                                    <DataList datasets={items} />
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Datasets;


import React, {useState} from 'react';
import {Container, Box, ThemeProvider, Typography, Grid} from '@mui/material';
import DataList from '../../components/DatasetList';
import Header from '../../components/Header';  // Importa il componente Header
import {tokens, useMode} from '../../theme';
import {useTheme} from "@mui/material/styles"; // Importa il tema da theme.js
import data from "../../data";


const Datasets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const groupByCategory = (data) => {
        return data.reduce((acc, dataset) => {
            if (!acc[dataset.category]) {
                acc[dataset.category] = [];
            }
            acc[dataset.category].push(dataset);
            return acc;
        }, {});
    };

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


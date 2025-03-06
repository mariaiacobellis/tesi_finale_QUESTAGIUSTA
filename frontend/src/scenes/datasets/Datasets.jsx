import React from 'react';
import { Container, Box, ThemeProvider } from '@mui/material';
import DataList from '../../components/DatasetList';
import Header from '../../components/Header';  // Importa il componente Header
import { useMode } from '../../theme'; // Importa il tema da theme.js

const Datasets = () => {
    const [theme] = useMode(); // Usa il tuo tema personalizzato

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                padding: 4 // Aggiungi spazio intorno alla pagina
            }}>
                <Container>
                    <Header
                        title="Esplora i Dataset"
                        subtitle="Trova i migliori dataset per il tuo progetto di machine learning, computer vision e altro."
                    />
                    <DataList />
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Datasets;

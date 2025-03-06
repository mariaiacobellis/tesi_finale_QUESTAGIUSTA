import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const Add = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [dataset, setDataset] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataset({
            ...dataset,
            [name]: value
        });
    };

    const handleSubmit = () => {
        // Logica per aggiungere il dataset (potrebbe essere un POST a un server, o salvare i dati localmente)
        alert("Nuovo dataset aggiunto!");
        // Puoi anche aggiungere una logica per resettare il form
        setDataset({
            title: '',
            description: '',
            imageUrl: ''
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
            <Header title="Aggiungi Dataset" subtitle="Inserisci un nuovo dataset" />
            <Box display="flex" flexDirection="column" gap={2}>
                <Card
                    sx={{
                        backgroundColor: colors.primary[400],
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Dettagli del Dataset
                        </Typography>

                        {/* Titolo */}
                        <TextField
                            label="Titolo"
                            variant="outlined"
                            fullWidth
                            name="title"
                            value={dataset.title}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />

                        {/* Descrizione */}
                        <TextField
                            label="Descrizione"
                            variant="outlined"
                            fullWidth
                            name="description"
                            value={dataset.description}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                        />

                        {/* URL immagine */}
                        <TextField
                            label="URL Immagine"
                            variant="outlined"
                            fullWidth
                            name="imageUrl"
                            value={dataset.imageUrl}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />

                        {/* Pulsante per inviare */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ mt: 2 }}
                        >
                            Aggiungi Dataset
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Add;

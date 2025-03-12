import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import axios from "axios";

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

    const handleSubmit = async () => {
        const publicationData = {
            author: "F. Maxwell Harper and Joseph A. Konstan",
            editor: "",
            title: "The MovieLens Datasets: History and Context",
            booktitle: null,
            pages: "19:1--19:19",
            series: null,
            volume: "5",
            publisher: null,
            year: "2016",
            number: "4",
            location: null,
            address: null,
            keywords: null,
            url: "https://doi.org/10.1145/2827872",
            doi: "10.1145/2827872",
            timestamp: "Mon, 15 Jun 2020 16:49:42 +0200",
            biburl: "https://dblp.org/rec/journals/tiis/HarperK16.bib",
            bibsource: "dblp computer science bibliography, https://dblp.org",
            journal: "{ACM} Trans. Interact. Intell. Syst.",
            rating: 4.5, // La valutazione in stelle (float)
            storage: "movielens1m.tsv",
            category: "Film",
            img: 'https://www.data4impactproject.org/wp-content/uploads/2023/11/datasets_transparent.png',
            numRatings: 1000209, // Esempio di numero di valutazioni
            numUsers: 6040,    // Esempio di numero di utenti
            numItems: 3706,    // Esempio di numero di item
            density: 0.044683625622312845     // Esempio di densità
        };


        try {
            const response = await axios.post("http://localhost:5000/datasets/add", publicationData)

            console.log(response);
        } catch {

        }

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

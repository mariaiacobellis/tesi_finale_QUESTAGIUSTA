import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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
        imageUrl: '',
        imageFile: null,        // For storing the image file
        file: null,             // For storing the TSV file
        category: '',          // For storing the category
        imageType: 'url'       // For storing the image type (URL or File)
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataset({
            ...dataset,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setDataset({
            ...dataset,
            imageFile: e.target.files[0]
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', dataset.title);
        formData.append('description', dataset.description);
        formData.append('category', dataset.category);

        // Check if the image is URL or File
        if (dataset.imageType === 'url') {
            formData.append('imageUrl', dataset.imageUrl);
        } else {
            formData.append('imageFile', dataset.imageFile);
        }

        formData.append('file', dataset.file);

        try {
            const response = await axios.post("http://localhost:5000/datasets/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log(response);
        } catch (error) {
            console.error("There was an error uploading the dataset:", error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
            <Header title="Aggiungi Dataset" subtitle="Inserisci un nuovo dataset" />
            <Box display="flex" flexDirection="column" gap={2}>
                <Card sx={{ backgroundColor: colors.primary[400], boxShadow: 3, borderRadius: 2 }}>
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

                        {/* Categoria */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="category-label">Categoria</InputLabel>
                            <Select
                                labelId="category-label"
                                value={dataset.category}
                                label="Categoria"
                                name="category"
                                onChange={handleInputChange}
                            >
                                <MenuItem value="Film">Film</MenuItem>
                                <MenuItem value="Musica">Musica</MenuItem>
                                <MenuItem value="Sport">Sport</MenuItem>
                                <MenuItem value="Tecnologia">Tecnologia</MenuItem>
                                <MenuItem value="Salute">Salute</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Tipo immagine (URL o File) */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="image-type-label">Tipo Immagine</InputLabel>
                            <Select
                                labelId="image-type-label"
                                value={dataset.imageType}
                                label="Tipo Immagine"
                                name="imageType"
                                onChange={handleInputChange}
                            >
                                <MenuItem value="url">URL</MenuItem>
                                <MenuItem value="file">File</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Input per URL immagine */}
                        {dataset.imageType === 'url' && (
                            <TextField
                                label="URL Immagine"
                                variant="outlined"
                                fullWidth
                                name="imageUrl"
                                value={dataset.imageUrl}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />
                        )}

                        {/* Input per caricare file immagine */}
                        {dataset.imageType === 'file' && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    border: '1px solid',
                                    borderColor: colors.primary[200],
                                    borderRadius: 1,
                                    padding: '8px 12px',
                                    marginBottom: 2,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        borderColor: colors.primary[300],
                                    },
                                }}
                                onClick={() => document.getElementById('image-file-input').click()}
                            >
                                <Typography variant="body1" color={dataset.imageFile ? 'text.primary' : theme.palette.text.primary}>
                                    {dataset.imageFile ? dataset.imageFile.name : 'Seleziona il file immagine'}
                                </Typography>
                                <input
                                    id="image-file-input"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Box>
                        )}

                        {/* Input per il file TSV */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                border: '1px solid',
                                borderColor: colors.primary[200],
                                borderRadius: 1,
                                padding: '8px 12px',
                                marginBottom: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: colors.primary[300],
                                },
                            }}
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <Typography variant="body1" color={dataset.file ? 'text.primary' : theme.palette.text.primary}>
                                {dataset.file ? dataset.file.name : 'Seleziona il file TSV'}
                            </Typography>
                            <input
                                id="file-input"
                                type="file"
                                accept=".tsv"
                                hidden
                                onChange={(e) => setDataset({ ...dataset, file: e.target.files[0] })}
                            />
                        </Box>

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





import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';

const fields = [
    "author", "editor", "booktitle", "pages", "series", "volume", "publisher",
    "year", "number", "location", "address", "keywords", "url", "doi", "timestamp",
    "biburl", "bibsource", "journal", "numRatings", "numUsers", "numItems", "density"
];

const Add = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [dataset, setDataset] = useState({ title: '', category: '', file: null, imageType: 'url', imageUrl: '', imageFile: null });
    const [selectedField, setSelectedField] = useState("");
    const [fieldValue, setFieldValue] = useState("");
    const [addedFields, setAddedFields] = useState([]);

    const handleAddField = () => {
        if (!selectedField || !fieldValue) return;
        setAddedFields([...addedFields, { key: selectedField, value: fieldValue }]);
        setDataset({ ...dataset, [selectedField]: fieldValue });
        setSelectedField("");
        setFieldValue("");
    };

    const handleRemoveField = (index, key) => {
        const newFields = addedFields.filter((_, i) => i !== index);
        setAddedFields(newFields);
        const newDataset = { ...dataset };
        delete newDataset[key];
        setDataset(newDataset);
    };

    const handleSubmit = async () => {
        if (!dataset.title) {
            alert("Il titolo è obbligatorio.");
            return;
        }

        if (!dataset.category) {
            alert("La categoria è obbligatoria.");
            return;
        }

        const formData = new FormData();
        Object.entries(dataset).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response = await axios.post("http://localhost:5000/datasets/add", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(response);
        } catch (error) {
            console.error("Errore durante il caricamento del dataset:", error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
            <Header title="Aggiungi Dataset" subtitle="Inserisci un nuovo dataset" />
            <Box display="flex" flexDirection="column" gap={2}>
                <Card sx={{ backgroundColor: colors.primary[400], boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        {/* Titolo */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Titolo
                        </Typography>
                        <TextField
                            label="Titolo"
                            variant="outlined"
                            fullWidth
                            required
                            value={dataset.title}
                            onChange={(e) => setDataset({ ...dataset, title: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        {/* Categoria */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Categoria
                        </Typography>
                        <TextField
                            label="Categoria"
                            variant="outlined"
                            fullWidth
                            required
                            value={dataset.category}
                            onChange={(e) => setDataset({ ...dataset, category: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        {/* Selezione dell'immagine */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }} mt={2}>
                            Immagine
                        </Typography>
                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                            <RadioGroup row value={dataset.imageType} onChange={(e) => setDataset({ ...dataset, imageType: e.target.value })}>
                                <FormControlLabel value="url" control={<Radio />} label="URL" />
                                <FormControlLabel value="file" control={<Radio />} label="File" />
                            </RadioGroup>
                        </FormControl>
                        {dataset.imageType === 'url' ? (
                            <TextField label="URL Immagine" fullWidth value={dataset.imageUrl} onChange={(e) => setDataset({ ...dataset, imageUrl: e.target.value })} sx={{ mb: 2 }} />
                        ) : (
                            <input type="file" accept="image/*" onChange={(e) => setDataset({ ...dataset, imageFile: e.target.files[0] })} style={{ marginBottom: '16px' }} />
                        )}

                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }} mt={2}>
                            Aggiungi Campi al Dataset
                        </Typography>
                        <Box display="flex" gap={2}>
                            {/* Sezione per Selezionare il Campo e Aggiungere il Valore */}
                            <FormControl fullWidth sx={{ flex: 1 }}>
                                <InputLabel shrink={!!selectedField}>Seleziona Campo</InputLabel>
                                <Autocomplete
                                    value={selectedField}
                                    onChange={(event, newValue) => setSelectedField(newValue)}
                                    options={fields}
                                    getOptionLabel={(option) => option || ""}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={selectedField ? "" : "Seleziona Campo"}
                                            fullWidth
                                        />
                                    )}
                                    fullWidth
                                />
                            </FormControl>

                            {/* Input per il Valore */}
                            <TextField
                                label="Valore"
                                variant="outlined"
                                fullWidth
                                value={fieldValue}
                                onChange={(e) => setFieldValue(e.target.value)}
                                sx={{ flex: 1 }}
                            />

                            {/* Bottone per aggiungere il campo */}
                            <Button variant="contained" color="primary" onClick={handleAddField}>
                                Aggiungi
                            </Button>
                        </Box>

                        <Box mt={2}>
                            <Typography variant="h6">Campi Aggiunti:</Typography>
                            {addedFields.map((field, index) => (
                                <Box key={index} display="flex" alignItems="center" gap={2}>
                                    <Typography>{field.key}: {field.value}</Typography>
                                    <IconButton onClick={() => handleRemoveField(index, field.key)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        <Button variant="contained" color="secondary" onClick={handleSubmit} sx={{ mt: 2 }}>
                            Invia Dataset
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Add;














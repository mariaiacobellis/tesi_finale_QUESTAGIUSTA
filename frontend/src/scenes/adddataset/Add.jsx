import React, { useState } from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    InputLabel,
    Snackbar,
    Alert, Modal, Backdrop, CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate, useLocation } from 'react-router-dom';

const fields = [
    "author", "editor", "booktitle", "pages", "series", "volume", "publisher",
    "year", "number", "location", "address", "keywords", "url", "doi", "timestamp",
    "biburl", "bibsource", "journal", "numRatings", "numUsers", "numItems", "density", "veryColdUser", "coldUser", "warmUser", "hotUser", "VeryColdItem", "ColdItem", "WarmItem", "PopularItem"
];

const Add = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const location = useLocation();

    const [dataset, setDataset] = useState({ title: '', category: '', file: null, imageType: 'url', imageUrl: '', imageFile: null });
    const [selectedField, setSelectedField] = useState("");
    const [fieldValue, setFieldValue] = useState("");
    const [addedFields, setAddedFields] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Stato per il messaggio di login
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false); // Stato per il messaggio di successo

    const [category, setCategory] = useState([]);
    const [statistiche, setStatistiche] = useState([]);
    const [loading, setLoading] = useState(false)
    const handleAddField = () => {
        if (!selectedField || !fieldValue) return;
        setAddedFields([...addedFields, { key: selectedField, value: fieldValue }]);
        //setDataset({ ...dataset, [selectedField]: fieldValue });
        // Controlla se titolocategoria è uno dei campi numerici e aggiunge a statisticheData
        const numericFields = ['numRatings', 'numUsers', 'numItems', 'density', 'veryColdUser', 'coldUser', 'warmUser', 'hotUser', 'VeryColdItem', 'ColdItem', 'WarmItem', 'PopularItem'];

        if (numericFields.includes(selectedField)) {
            // Se titolocategoria è uno dei campi numerici, inserisci in statisticheData
            setStatistiche([...statistiche, { titolocategoria: selectedField, valorecategoria: parseFloat(fieldValue) }]);
        } else {
            // Altrimenti inserisci in categoryData
            setCategory([...category, { titolocategoria: selectedField, valorecategoria: fieldValue }]);
        }
        setSelectedField("");
        setFieldValue("");
    };

    const handleRemoveField = (index, key) => {
        const newFields = addedFields.filter((_, i) => i !== index);
        setAddedFields(newFields);
        // Verifica se l'elemento appartiene a statisticheData o categoryData
        const itemInStatistiche = statistiche[index];
        const itemInCategory = category[index];

        if (itemInStatistiche) {
            // Rimuove l'elemento da statisticheData
            const newStatistiche = statistiche.filter((_, i) => i !== index);
            setStatistiche(newStatistiche);
        } else if (itemInCategory) {
            // Rimuove l'elemento da categoryData
            const newCategory = category.filter((_, i) => i !== index);
            setCategory(newCategory);
        }
    };

    const handleSubmit = async () => {
        const isLoggedIn = localStorage.getItem('username'); // Verifica se l'utente è loggato
        if (!isLoggedIn) {
            // Se non loggato, salva la pagina corrente e redirige alla login
            localStorage.setItem('redirectAfterLogin', '/adddatasets');
            setOpenSnackbar(true); // Apre il banner
            setTimeout(() => {
                navigate('/login'); // Redirige alla pagina di login dopo che il banner è stato mostrato
            }, 3000); // Aspetta 3 secondi prima di fare il reindirizzamento
            return;
        }

        if (!dataset.title) {
            alert("Il titolo è obbligatorio.");
            return;
        }

        if (!dataset.category) {
            alert("La categoria è obbligatoria.");
            return;
        }

        setLoading(true)

        if (dataset.tsvFile) {
            const formData = new FormData();
            formData.append('file', dataset.tsvFile);
            const fileResponse = await axios.post("http://localhost:5000/upload/file", formData);
            const stringa = String(fileResponse.data.data);
            const fileName = String(stringa.split(/[/\\]/).pop());
            dataset.storage = fileName;
        } else {
            alert("Il file TSV è obbligatorio");
            return;
        }

        if (dataset.imageFile) {
            const formDataimage = new FormData();
            formDataimage.append('image', dataset.imageFile);
            const imageResponse = await axios.post("http://localhost:5000/image", formDataimage);
            dataset.img = "http://localhost:5000/image/" + imageResponse.data;
            console.log(imageResponse);
        } else {
            if (!dataset.imageUrl) {
                dataset.img = "https://www.data4impactproject.org/wp-content/uploads/2023/11/datasets_transparent.png";
            }
        }



        console.log(category);

        console.log(statistiche);



        try {
            const response = await axios.post("http://localhost:5000/datasets/add", {
                datasetData: {
                    title:dataset.title,
                    descrizione: dataset.descrizione,
                    rating: 0.0,
                    storage: dataset.storage,
                    category: dataset.category,
                    img: dataset.img,
                    status: "Pending",
                    username: isLoggedIn
                },
                categoryData: category,
                statisticheData: statistiche
            });
            console.log(response);
            setLoading(false)
            // Mostra il messaggio di successo
            setOpenSuccessSnackbar(true);
        } catch (error) {
            console.error("Errore durante il caricamento del dataset:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseSuccessSnackbar = () => {
        setOpenSuccessSnackbar(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
            {<Modal open={loading} aria-labelledby="loading-modal" aria-describedby="loading-data">
                <Backdrop open={loading} sx={{ zIndex: 1200, color: "#fff" }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0, 0, 0, 0.75)",
                            borderRadius: 2,
                            p: 4,
                            boxShadow: 24,
                            minWidth: 320,
                        }}
                    >
                        <CircularProgress color="inherit" size={60} thickness={4.5} />
                        <Typography variant="h6" sx={{ mt: 2, color: "#fff", fontWeight: "bold" }}>
                            Caricamento in corso...
                        </Typography>
                    </Box>
                </Backdrop>
            </Modal>}
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

                        {/* Descrizione */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Descrizione
                        </Typography>
                        <TextField
                            label="Descrizione"
                            variant="outlined"
                            fullWidth
                            required
                            value={dataset.descrizione}
                            onChange={(e) => setDataset({ ...dataset, descrizione: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        {/* Carica File TSV */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }} mt={2}>
                            Carica File TSV
                        </Typography>
                        <input type="file" accept=".tsv" onChange={(e) => setDataset({ ...dataset, tsvFile: e.target.files[0] })} style={{ marginBottom: '16px' }} />

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

                        {/* Aggiungi Campi al Dataset */}
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

            {/* Snackbar per il messaggio di login */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                }}
            >
                <Alert severity="warning">
                    Per aggiungere un dataset devi effettuare il login
                </Alert>
            </Snackbar>

            {/* Snackbar per il messaggio di successo */}
            <Snackbar
                open={openSuccessSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSuccessSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                }}
            >
                <Alert severity="success">
                    Il tuo Dataset è stato caricato correttamente, attendi l'approvazione.
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Add;




















import React, { useEffect, useState } from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const Admin = () => {
    const theme = useTheme(); // Usa il tema MUI
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        const fetchDatasets = async () => {
            try {

                const response = await axios.get('http://localhost:5000/datasets/all/pending');

                if (response.data.datasets) {
                    setDatasets(response.data.datasets); // Aggiorna lo stato con i dataset ottenuti
                } else {
                    console.error("Nessun dataset trovato nella risposta!");
                }
            } catch (error) {
                console.error("Errore nel fetch dei dataset:", error);
            }
        };
        fetchDatasets();
    }, []);

    const handleApprove = async (id) => {

        try {

            const response = await axios.put(`http://localhost:5000/datasets/status/${id}`);

            setDatasets(datasets.filter(ds => ds.id !== id))
        } catch (error) {
            console.error("Errore nel fetch dei dataset:", error);
        }
    };

    const handleDelete = async (id) => {
        try {

            const response = await axios.delete(`http://localhost:5000/datasets/${id}`);

            setDatasets(datasets.filter(ds => ds.id !== id))
        } catch (error) {
            console.error("Errore nel fetch dei dataset:", error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, color: theme.palette.text.primary }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Titolo</b></TableCell>
                            <TableCell><b>Categoria</b></TableCell>
                            <TableCell align="center"><b>Azioni</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datasets.map((dataset) => (
                            <TableRow key={dataset.id}>
                                <TableCell>{dataset.title}</TableCell>
                                <TableCell>{dataset.category}</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="primary" href={`/datasets/${dataset.id}`} sx={{ mr: 1 }}>
                                        Visualizza Dataset
                                    </Button>
                                    <Button variant="contained" color="success" onClick={() => handleApprove(dataset.id)} sx={{ mr: 1 }}>
                                        Approva
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(dataset.id)}>
                                        Elimina
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Admin;
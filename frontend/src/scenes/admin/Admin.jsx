import React, { useEffect, useState } from "react";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import {tokens} from "../../theme";

const Admin = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [pendingDatasets, setPendingDatasets] = useState([]);
    const [allDatasets, setAllDatasets] = useState([]);

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const pendingResponse = await axios.get('http://localhost:5000/datasets/all/pending');
                const allResponse = await axios.get('http://localhost:5000/datasets/all');

                if (pendingResponse.data.datasets) {
                    setPendingDatasets(pendingResponse.data.datasets);
                }
                if (allResponse.data.datasets) {
                    setAllDatasets(allResponse.data.datasets);
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

            if (response.status === 200) {

                const approvedDataset = pendingDatasets.find(ds => ds.id === id);


                setPendingDatasets(prev => prev.filter(ds => ds.id !== id));
                setAllDatasets(prev => [...prev, approvedDataset]);
            }
        } catch (error) {
            console.error("Errore nel fetch dei dataset:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/datasets/${id}`);
            setPendingDatasets(pendingDatasets.filter(ds => ds.id !== id));
            setAllDatasets(allDatasets.filter(ds => ds.id !== id));
        } catch (error) {
            console.error("Errore nell'eliminazione del dataset:", error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, color: theme.palette.text.primary }}>
            {/* Tabella per dataset in attesa di approvazione */}
            <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 2 }}>
                Tabella per dataset in attesa di approvazione
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4, backgroundColor: colors.primary[400]}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Titolo</b></TableCell>
                            <TableCell><b>Categoria</b></TableCell>
                            <TableCell align="center"><b>Azioni</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingDatasets.map((dataset) => (
                            <TableRow key={dataset.id}>
                                <TableCell>{dataset.title}</TableCell>
                                <TableCell>{dataset.category}</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="primary" href={`/datasets/${dataset.id}`} sx={{ mr: 1 }}>
                                        Visualizza
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

            {/* Tabella per tutti i dataset */}
            <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 2 }}>
                Tabella per la gestione di tutti i dataset
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4, backgroundColor: colors.primary[400]}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Titolo</b></TableCell>
                            <TableCell><b>Categoria</b></TableCell>
                            <TableCell align="center"><b>Azioni</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allDatasets.map((dataset) => (
                            <TableRow key={dataset.id}>
                                <TableCell>{dataset.title}</TableCell>
                                <TableCell>{dataset.category}</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="primary" href={`/datasets/${dataset.id}`} sx={{ mr: 1 }}>
                                        Visualizza
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

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Paper, TextField, useTheme, Rating, Snackbar, Alert } from "@mui/material";
import { tokens } from "../src/theme"; // Importa i tuoi colori definiti nel tema
import axios from "axios";

const DatasetVoteComment = () => {
    const { id } = useParams(); // Usa l'ID dal parametro URL
    const [dataset, setDataset] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [hasCommented, setHasCommented] = useState(false);
    const [rating, setRating] = useState(0); // Stato per gestire il voto con le stelline
    const theme = useTheme();
    const colors = tokens(theme.palette.mode); // Ottieni i colori dal tema
    const navigate = useNavigate();
    const location = useLocation(); // Per ottenere la posizione corrente

    const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per verificare se l'utente è loggato
    const [userId, setUserId] = useState(null); // ID dell'utente loggato

    // Stato per gestire la Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false); // Stato per mostrare la Snackbar

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false); // Chiudi la Snackbar
    };

    useEffect(() => {
        // Controlla se l'utente è loggato
        const checkLoginStatus = () => {
            const loggedInUser = localStorage.getItem("userId");
            if (loggedInUser) {
                setIsLoggedIn(true);
                setUserId(loggedInUser);
            }
        };

        checkLoginStatus();

        const fetchDataset = async () => {
            try {
                const datasetResponse = await axios.get(`http://localhost:5000/datasets/get/${id}`);
                setDataset(datasetResponse.data);

                const commentsResponse = await axios.get(`http://localhost:5000/comments/${id}`);
                setComments(commentsResponse.data);

                const userCommented = commentsResponse.data.some(comment => comment.userId === userId);
                setHasCommented(userCommented);
            } catch (error) {
                console.error("Errore nel caricamento del dataset o dei commenti:", error);
            }
        };

        fetchDataset();
    }, [id, userId]);

    const handleCommentSubmit = async () => {
        if (!isLoggedIn) {
            // Se l'utente non è loggato, mostra la Snackbar
            setOpenSnackbar(true);  // Abilita la Snackbar
            // Salva la pagina attuale per il reindirizzamento
            localStorage.setItem("redirectAfterLogin", location.pathname);
            navigate("/login"); // Vai alla pagina di login
            return;
        }

        if (newComment.trim()) {
            try {
                const response = await axios.post(`http://localhost:5000/comments/add`, {
                    datasetId: id,
                    comment: newComment,
                    userId: userId,
                    rating: rating,
                });
                setComments([response.data, ...comments]);
                setNewComment("");
                setRating(0);
            } catch (error) {
                console.error("Errore nell'aggiunta del commento:", error);
            }
        }
    };

    useEffect(() => {
        // Dopo il login, reindirizza l'utente alla pagina precedente (se disponibile)
        if (isLoggedIn) {
            const redirectTo = localStorage.getItem("redirectAfterLogin");
            if (redirectTo) {
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectTo);
            }
        }
    }, [isLoggedIn, navigate]);

    return (
        <Box p={3} sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <Paper sx={{ p: 2, backgroundColor: colors.primary[400] }}>
                <Typography variant="h4" color={colors.blueAccent[500]}>
                    {dataset ? dataset.title : "Caricamento..."}
                </Typography>
                <Typography variant="body1" color={colors.grey[100]}>
                    {dataset ? dataset.description : "Descrizione non disponibile"}
                </Typography>

                <Box>
                    <TextField
                        label="Aggiungi un commento"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={hasCommented} // Disabilita se l'utente ha già commentato
                        sx={{
                            mt: 2,
                            input: {
                                color: colors.grey[100],
                            },
                            label: {
                                color: colors.grey[100],
                            },
                        }}
                    />
                    <Box mt={2}>
                        <Typography variant="body1" color={colors.grey[100]}>
                            Vota il dataset:
                        </Typography>
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                            disabled={hasCommented} // Disabilita se l'utente ha già commentato
                        />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCommentSubmit}
                        sx={{ mt: 2 }}
                        disabled={hasCommented}
                    >
                        {hasCommented ? "Hai già commentato" : "Invia Commento"}
                    </Button>
                </Box>
            </Paper>

            <Box mt={3}>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <Box key={index} mb={2}>
                            <Typography variant="body2" color={colors.grey[100]}>
                                {comment.comment}
                            </Typography>
                            <Rating value={comment.rating} readOnly /> {/* Mostra il voto */}
                        </Box>
                    ))
                ) : (
                    <Typography variant="body1" color={colors.grey[100]}>
                        Nessun commento ancora.
                    </Typography>
                )}
            </Box>

            {/* Snackbar per avvisare l'utente che deve effettuare il login */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posizione al centro
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                }}
            >
                <Alert severity="warning">
                    Per aggiungere un commento devi effettuare il login
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DatasetVoteComment;












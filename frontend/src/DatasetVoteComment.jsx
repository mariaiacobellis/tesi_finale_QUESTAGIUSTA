import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Paper, TextField, useTheme, Rating, Snackbar, Alert, IconButton, Menu, MenuItem, Card, CardContent, CardActions } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { tokens } from "../src/theme";
import axios from "axios";

const DatasetVoteComment = () => {
    const { id } = useParams();
    const [dataset, setDataset] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [hasCommented, setHasCommented] = useState(false);
    const [rating, setRating] = useState(0);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    useEffect(() => {
        const checkLoginStatus = () => {
            const loggedInUser = localStorage.getItem("username");
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

                const commentsResponse = await axios.get(`http://localhost:5000/comments/ref/${id}`);
                setComments(commentsResponse.data);

                const userCommented = commentsResponse.data.some(comment => comment.username === userId);
                setHasCommented(userCommented);
            } catch (error) {
                console.error("Errore nel caricamento del dataset o dei commenti:", error);
            }
        };

        fetchDataset();
    }, [id, userId]);

    const handleCommentSubmit = async () => {
        if (!isLoggedIn) {
            setOpenSnackbar(true);
            setTimeout(() => {
                localStorage.setItem("redirectAfterLogin", location.pathname);
                navigate("/login");
            }, 2000);
            return;
        }

        if (newComment.trim()) {
            try {
                const response = await axios.post(`http://localhost:5000/comments`, {
                    riferimento_id: id,
                    riferimento_tipo: "dataset",
                    username: userId,
                    comment: newComment,
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
        if (isLoggedIn) {
            const redirectTo = localStorage.getItem("redirectAfterLogin");
            if (redirectTo) {
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectTo);
            }
        }
    }, [isLoggedIn, navigate]);

    const handleMenuOpen = (event, commentId) => {
        setAnchorEl(event.currentTarget);
        setSelectedCommentId(commentId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCommentId(null);
    };

    const handleDeleteComment = async () => {
        try {
            await axios.delete(`http://localhost:5000/comments/${selectedCommentId}`);
            setComments(comments.filter(comment => comment.id !== selectedCommentId));
            handleMenuClose();
        } catch (error) {
            console.error("Errore nell'eliminazione del commento:", error);
        }
    };

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
                        disabled={hasCommented}
                        sx={{
                            mt: 2,
                            input: { color: colors.grey[100] },
                            label: { color: colors.grey[100] },
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
                            disabled={hasCommented}
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
                    comments.map((comment) => (
                        <Card key={comment.id} sx={{ mb: 2, backgroundColor: colors.primary[400] }}>
                            <CardContent>
                                <Typography variant="h6" color={colors.blueAccent[500]}>
                                    {comment.username}
                                </Typography>
                                <Typography variant="body2" color={colors.grey[100]}>
                                    {comment.comment}
                                </Typography>
                                <Rating value={comment.rating} readOnly />
                            </CardContent>

                            {comment.username === userId && (
                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                    <IconButton onClick={(e) => handleMenuOpen(e, comment.id)} sx={{ color: colors.grey[100] }}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </CardActions>
                            )}
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" color={colors.grey[100]}>
                        Nessun commento ancora.
                    </Typography>
                )}
            </Box>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleDeleteComment}>Elimina commento</MenuItem>
            </Menu>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert severity="warning">
                    Per aggiungere un commento devi effettuare il login
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DatasetVoteComment;














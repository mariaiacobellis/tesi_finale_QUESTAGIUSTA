import React, { useEffect, useState } from 'react';
import { Container, Box, Card, CardContent, Typography, IconButton, Collapse, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { ExpandMore as ExpandMoreIcon, Comment as CommentIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const discussions = [
    {
        title: 'Caricamento più rapido dei dataset',
        description: 'Potreste ottimizzare il tempo di caricamento dei dataset, magari introducendo caricamenti asincroni, paginazione o caricamento "lazy" dei dati per migliorare l’esperienza utente.',
        comments: [
            { id: 1, text: 'Sì, anche io ho notato che a volte ci vuole un po\' di tempo per caricare i dataset. Penso che un sistema di caricamento asincrono potrebbe davvero aiutare!' },
            { id: 2, text: 'Concordo! Un caricamento più veloce sarebbe fantastico. Magari una funzione di paginazione o il caricamento lazy potrebbero essere utili per migliorare la velocità.' }
        ]
    },
    {
        title: 'Aggiunta delle notifiche',
        description: 'Ci vorrebbe un sistema di notifiche per quando un dataset viene approvato o quando ci sono aggiornamenti.',
        comments: [
            { id: 1, text: 'Anche io lo penso! Sarebbe fantastico ricevere notifiche quando un dataset che abbiamo caricato viene approvato o aggiornato.' },
            { id: 2, text: 'Assolutamente! Inoltre, un sistema di notifiche sarebbe utile anche per gli aggiornamenti sui dataset che seguiamo, così da rimanere sempre informati.' }
        ]
    }
];

const DiscussionPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [openIndex, setOpenIndex] = useState(null);
    const { id } = useParams();
    const [dataset, setDataset] = useState();
    const [discussionsState, setDiscussionsState] = useState(discussions);
    const [openDialog, setOpenDialog] = useState(false);
    const [newDiscussionText, setNewDiscussionText] = useState('');
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [selectedDiscussionIndex, setSelectedDiscussionIndex] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/datasets/get/${id}`);
                if (response.data.datasets) setDataset(response.data.datasets);
            } catch (error) {
                console.error('Errore nel fetch del dataset:', error);
            }
        };
        fetchDataset();
    }, [id]);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleAddDiscussion = () => {
        const isLoggedIn = localStorage.getItem('username');

        if (!isLoggedIn) {
            setSnackbarOpen(true); // Mostra il banner
            return;
        }

        if (newDiscussionText.trim()) {
            setDiscussionsState([{ title: 'Nuova Discussione', description: newDiscussionText, comments: [] }, ...discussionsState]);
            setOpenDialog(false);
            setNewDiscussionText('');
        }
    };

    const handleAddComment = () => {
        const isLoggedIn = localStorage.getItem('username');

        if (!isLoggedIn) {
            setSnackbarOpen(true); // Mostra il banner
            return;
        }

        if (newCommentText.trim()) {
            const updatedDiscussions = discussionsState.map((discussion, index) => {
                if (index === selectedDiscussionIndex) {
                    return { ...discussion, comments: [...discussion.comments, { id: discussion.comments.length + 1, text: newCommentText }] };
                }
                return discussion;
            });

            setDiscussionsState(updatedDiscussions);
            setOpenCommentDialog(false);
            setNewCommentText('');
        }
    };

    const handleCloseSnackbar = () => {
        // Salva la pagina corrente nel localStorage
        localStorage.setItem('redirectAfterLogin', location.pathname);
        setSnackbarOpen(false);
        navigate('/login'); // Reindirizza alla pagina di login
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
            <Header title="Discussioni" subtitle="Partecipa alle discussioni e lascia i tuoi commenti" />

            {dataset && (
                <Box mb={4} p={2} sx={{ backgroundColor: colors.primary[300], borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Commenti per: {dataset?.title}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[600]}>
                        Qui puoi votare e commentare il dataset "{dataset?.title}".
                    </Typography>
                </Box>
            )}

            <Box display="flex" flexDirection="column" gap={2}>
                {discussionsState.map((discussion, discussionIndex) => (
                    <Card key={discussionIndex} sx={{ backgroundColor: colors.primary[400], boxShadow: 3, borderRadius: 2, mb: discussionIndex === discussionsState.length - 1 ? 4 : 0 }}>
                        <CardContent>
                            <Box display="flex" flexDirection="column" mb={2} sx={{ cursor: 'pointer' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {discussion.title}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color={colors.grey[600]}>
                                {discussion.description}
                            </Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center" onClick={() => handleToggle(discussionIndex)}>
                                <Typography variant="body2" color={colors.blueAccent[500]}>
                                    {openIndex === discussionIndex ? 'Nascondi commenti' : 'Mostra commenti'}
                                </Typography>
                                <IconButton>
                                    <ExpandMoreIcon sx={{ transform: openIndex === discussionIndex ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                                </IconButton>
                            </Box>

                            <Collapse in={openIndex === discussionIndex}>
                                <Box mt={2} display="flex" flexDirection="column" gap={1}>
                                    {discussion.comments.map((comment) => (
                                        <Box key={comment.id} display="flex" alignItems="center" gap={1}>
                                            <CommentIcon sx={{ color: colors.greenAccent[500] }} />
                                            <Typography variant="body2" color={colors.grey[500]}>
                                                {comment.text}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>

                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                <Button variant="outlined" color="primary" onClick={() => {
                                    setSelectedDiscussionIndex(discussionIndex);
                                    handleAddComment(); // Controlla login prima di aprire il dialogo
                                }}>
                                    Aggiungi commento
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box position="fixed" bottom={16} right={16} sx={{ zIndex: 10 }}>
                <IconButton color="primary" onClick={() => setOpenDialog(true)} sx={{ backgroundColor: colors.blueAccent[500], "&:hover": { backgroundColor: colors.blueAccent[700] }, borderRadius: "50%", padding: 2 }}>
                    <AddIcon sx={{ color: "white" }} />
                </IconButton>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Aggiungi una nuova discussione</DialogTitle>
                <DialogContent>
                    <TextField label="Descrizione" multiline rows={4} fullWidth value={newDiscussionText} onChange={(e) => setNewDiscussionText(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Annulla</Button>
                    <Button onClick={handleAddDiscussion} color="primary">Aggiungi</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
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
                <Alert severity="warning">Per commentare bisogna essere loggati!</Alert>
            </Snackbar>
        </Container>
    );
};

export default DiscussionPage;





















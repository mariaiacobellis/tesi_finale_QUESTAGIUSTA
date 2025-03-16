import React, { useEffect, useState } from 'react';
import { Container, Box, Card, CardContent, Typography, IconButton, Collapse, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
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

    const navigate = useNavigate();
    const location = useLocation(); // Ottieni la pagina di origine per il reindirizzamento

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                console.log('Fetching dataset with ID:', id);
                const response = await axios.get(`http://localhost:5000/datasets/get/${id}`);
                console.log('Response:', response.data);

                if (response.data.datasets) {
                    setDataset(response.data.datasets);
                } else {
                    console.error('Nessun dataset trovato nella risposta!');
                }
            } catch (error) {
                console.error('Errore nel fetch del dataset:', error);
            }
        };

        fetchDataset();
    }, [id]);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleDeleteComment = (discussionIndex, commentId) => {
        const updatedDiscussions = discussionsState.map((discussion, index) => {
            if (index === discussionIndex) {
                const updatedComments = discussion.comments.filter(comment => comment.id !== commentId);
                return { ...discussion, comments: updatedComments };
            }
            return discussion;
        });
        setDiscussionsState(updatedDiscussions);
    };

    const handleDeleteDiscussion = (discussionIndex) => {
        const updatedDiscussions = discussionsState.filter((_, index) => index !== discussionIndex);
        setDiscussionsState(updatedDiscussions);
    };

    const handleAddDiscussion = () => {
        const isLoggedIn = localStorage.getItem('username'); // Verifica se l'utente è loggato

        if (!isLoggedIn) {
            // Se non loggato, reindirizza alla pagina di login passando il percorso della discussione
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (newDiscussionText.trim()) {
            const newDiscussion = {
                title: 'Nuova Discussione',
                description: newDiscussionText,
                comments: []
            };
            setDiscussionsState([newDiscussion, ...discussionsState]);
            setOpenDialog(false);
            setNewDiscussionText('');
        }
    };

    const handleAddComment = () => {
        const isLoggedIn = localStorage.getItem('username'); // Verifica se l'utente è loggato

        if (!isLoggedIn) {
            // Se non loggato, reindirizza alla pagina di login passando il percorso della discussione
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (newCommentText.trim()) {
            const updatedDiscussions = discussionsState.map((discussion, index) => {
                if (index === selectedDiscussionIndex) {
                    const newComment = {
                        id: discussion.comments.length + 1,
                        text: newCommentText
                    };
                    return { ...discussion, comments: [...discussion.comments, newComment] };
                }
                return discussion;
            });
            setDiscussionsState(updatedDiscussions);
            setOpenCommentDialog(false);
            setNewCommentText('');
        }
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
                    <Card
                        key={discussionIndex}
                        sx={{
                            backgroundColor: colors.primary[400],
                            boxShadow: 3,
                            borderRadius: 2,
                            mb: discussionIndex === discussionsState.length - 1 ? 4 : 0
                        }}
                    >
                        <CardContent>
                            <Box display="flex" flexDirection="column" mb={2} sx={{ cursor: 'pointer' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {discussion.title}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" sx={{ cursor: 'pointer', mt: 1 }}>
                                <Typography variant="body2" color={colors.grey[600]}>
                                    {discussion.description}
                                </Typography>
                            </Box>


                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => handleToggle(discussionIndex)}
                            >
                                <Typography variant="body2" color={colors.blueAccent[500]}>
                                    {openIndex === discussionIndex ? 'Nascondi commenti' : 'Mostra commenti'}
                                </Typography>
                                <IconButton>
                                    <ExpandMoreIcon
                                        sx={{
                                            transform: openIndex === discussionIndex ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
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
                                            <IconButton
                                                onClick={() => handleDeleteComment(discussionIndex, comment.id)}
                                                color="error"
                                                sx={{ ml: 1 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mt={2}
                            >
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        setSelectedDiscussionIndex(discussionIndex);
                                        setOpenCommentDialog(true);
                                    }}
                                >
                                    Aggiungi commento
                                </Button>

                                {/* Sostituito IconButton con Button */}
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteDiscussion(discussionIndex)}
                                >
                                    Elimina discussione
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Bottone per aggiungere una nuova discussione */}
            <Box
                position="fixed"
                bottom={16}
                right={16}
                sx={{ zIndex: 10 }}
            >
                <IconButton
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                    sx={{
                        backgroundColor: colors.blueAccent[500],
                        "&:hover": { backgroundColor: colors.blueAccent[700] },
                        borderRadius: "50%",
                        padding: 2
                    }}
                >
                    <AddIcon sx={{ color: "white" }} />
                </IconButton>
            </Box>

            {/* Dialog per aggiungere una nuova discussione */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Aggiungi una nuova discussione</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Descrizione"
                        multiline
                        rows={4}
                        fullWidth
                        value={newDiscussionText}
                        onChange={(e) => setNewDiscussionText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Annulla
                    </Button>
                    <Button onClick={handleAddDiscussion} color="primary">
                        Aggiungi
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog per aggiungere un commento */}
            <Dialog open={openCommentDialog} onClose={() => setOpenCommentDialog(false)}>
                <DialogTitle>Aggiungi un commento</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Commento"
                        multiline
                        rows={4}
                        fullWidth
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCommentDialog(false)} color="primary">
                        Annulla
                    </Button>
                    <Button onClick={handleAddComment} color="primary">
                        Aggiungi
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DiscussionPage;
















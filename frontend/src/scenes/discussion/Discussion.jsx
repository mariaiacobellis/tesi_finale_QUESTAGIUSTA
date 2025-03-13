import React, { useEffect, useState } from 'react';
import { Container, Box, Card, CardContent, Typography, IconButton, Collapse, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { ExpandMore as ExpandMoreIcon, Comment as CommentIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const discussions = [
    {
        title: 'Discussione 1',
        description: 'Questa è la descrizione della discussione 1. Clicca per vedere i commenti.',
        comments: [
            { id: 1, text: 'Questo è il primo commento sulla discussione 1.' },
            { id: 2, text: 'Altro commento interessante sulla discussione 1.' }
        ]
    },
    {
        title: 'Discussione 2',
        description: 'Questa è la descrizione della discussione 2. Clicca per vedere i commenti.',
        comments: [
            { id: 1, text: 'Commento sulla discussione 2.' },
            { id: 2, text: 'Un altro commento sulla discussione 2.' }
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

    const handleAddDiscussion = () => {
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

                            {/* Bottone per aggiungere commento */}
                            <Box
                                display="flex"
                                justifyContent="flex-end"
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













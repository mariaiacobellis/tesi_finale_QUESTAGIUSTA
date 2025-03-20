import React, { useEffect, useState } from 'react';
import {
    Container, Box, Card, CardContent, Typography, IconButton, Collapse, TextField, Dialog,
    DialogActions, DialogContent, DialogTitle, Button, Snackbar, Alert, Fab, Menu, MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { ExpandMore as ExpandMoreIcon, Comment as CommentIcon, Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const DiscussionPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [openIndex, setOpenIndex] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [comments, setComments] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
    const [newDiscussionText, setNewDiscussionText] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username');

    useEffect(() => {
        axios.get('http://localhost:5000/discussions')
            .then(response => setDiscussions(response.data))
            .catch(error => console.error("Errore nel recupero discussioni:", error));
    }, []);

    const fetchComments = (discussionId) => {
        axios.get(`http://localhost:5000/comments/ref/${discussionId}`)
            .then(response => setComments(prev => ({ ...prev, [discussionId]: response.data })))
            .catch(error => console.error("Errore nel recupero commenti:", error));
    };

    const handleToggle = (discussionId) => {
        if (openIndex === discussionId) {
            setOpenIndex(null);
        } else {
            setOpenIndex(discussionId);
            fetchComments(discussionId);
        }
    };

    const handleAddDiscussion = () => {
        if (!username) {
            setSnackbarOpen(true);
            return;
        }

        if (newDiscussionTitle.trim() && newDiscussionText.trim()) {
            axios.post('http://localhost:5000/discussions', {
                titolo: newDiscussionTitle,
                username,
                text_discussion: newDiscussionText
            }).then(response => {
                setDiscussions([response.data, ...discussions]);
                setOpenDialog(false);
                setNewDiscussionTitle('');
                setNewDiscussionText('');
            }).catch(error => console.error("Errore nell'aggiunta discussione:", error));
        }
    };

    const handleAddComment = () => {
        if (!username) {
            setSnackbarOpen(true);
            return;
        }

        if (newCommentText.trim()) {
            axios.post('http://localhost:5000/comments', {
                discussion_id: selectedDiscussionId,
                username,
                text: newCommentText
            }).then(response => {
                setComments(prev => ({
                    ...prev,
                    [selectedDiscussionId]: [...(prev[selectedDiscussionId] || []), response.data]
                }));
                setNewCommentText('');
            }).catch(error => console.error("Errore nell'aggiunta commento:", error));
        }
    };

    const handleCloseSnackbar = () => {
        localStorage.setItem('redirectAfterLogin', location.pathname);
        setSnackbarOpen(false);
        navigate('/login');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
            <Header title="Discussioni" subtitle="Partecipa alle discussioni e lascia i tuoi commenti" />

            <Box display="flex" flexDirection="column" gap={2}>
                {discussions.map((discussion) => (
                    <Card key={discussion.id} sx={{ backgroundColor: colors.primary[400], boxShadow: 3, borderRadius: 2, position: 'relative' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight="bold">{discussion.titolo}</Typography>
                                {discussion.username === username && (
                                    <IconButton
                                        onClick={(e) => {
                                            setMenuAnchor(e.currentTarget);
                                            setSelectedDiscussion(discussion);
                                        }}
                                        onMouseEnter={(e) => setMenuAnchor(e.currentTarget)}
                                        onMouseLeave={() => setMenuAnchor(null)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography variant="body2" color={colors.grey[600]}>{discussion.text_discussion}</Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center" onClick={() => handleToggle(discussion.id)}>
                                <Typography variant="body2" color={colors.blueAccent[500]}>
                                    {openIndex === discussion.id ? 'Nascondi commenti' : 'Mostra commenti'}
                                </Typography>
                                <ExpandMoreIcon sx={{ transform: openIndex === discussion.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                            </Box>

                            <Collapse in={openIndex === discussion.id}>
                                <Box mt={2}>
                                    {(comments[discussion.id] || []).map((comment) => (
                                        <Typography key={comment.id} variant="body2" color={colors.grey[500]}>
                                            <CommentIcon sx={{ color: colors.greenAccent[500], mr: 1 }} />
                                            {comment.comment}
                                        </Typography>
                                    ))}
                                </Box>
                                <Box mt={2}>
                                    <TextField
                                        label="Aggiungi un commento"
                                        fullWidth
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                    />
                                    <Button variant="contained" color="primary" onClick={() => { setSelectedDiscussionId(discussion.id); handleAddComment(); }} sx={{ mt: 1 }}>
                                        Invia
                                    </Button>
                                </Box>
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default DiscussionPage;


























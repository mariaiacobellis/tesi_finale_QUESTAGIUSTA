import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Collapse,
    TextField,
    Button,
    Snackbar,
    Alert,
    Fab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem, Menu
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { ExpandMore as ExpandMoreIcon, Comment as CommentIcon, MoreVert as MoreVertIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const DiscussionPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [openIndex, setOpenIndex] = useState(null);
    const [openIndexDelete, setOpenIndexDelete] = useState(false);
    const [discussions, setDiscussions] = useState([]);
    const [comments, setComments] = useState({});
    const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
    const [newDiscussionText, setNewDiscussionText] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)

    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username');

    useEffect(() => {
        axios.get('http://localhost:5000/discussions')
            .then(response => setDiscussions(response.data))
            .catch(error => console.error("Errore nel recupero discussioni:", error));
    }, []);

    const fetchComments = (discussionId) => {
        axios.get(`http://localhost:5000/comments/ref/Discussion/${discussionId}`)
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

    const handleToggleDelete = (event) => {
        setAnchorEl(event.currentTarget)
        setOpenIndexDelete(true)

    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleElimina = (id) => {
        axios.delete(`http://localhost:5000/discussions/${id}`)
            .then(response => setDiscussions((prevDiscussions) => prevDiscussions.filter(discussion => discussion.id !== id)))
            .catch(error => console.error("Errore nel recupero commenti:", error));

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
                text_discussion: newDiscussionText,
            }).then(response => {

                setDiscussions([response.data, ...discussions]);
                setOpenDialog(false);
                setNewDiscussionTitle('');
                setNewDiscussionText('');
            }).catch(error => console.error("Errore nell'aggiunta discussione:", error));
        }
    };

    const handleAddComment = (id) => {
        if (!username) {
            setSnackbarOpen(true);
            return;
        }

        if (newCommentText.trim()) {

            axios.post('http://localhost:5000/comments', {
                riferimento_id: id,
                username,
                riferimento_tipo:"Discussion",
                rating : null,
                comment: newCommentText
            }).then(response => {
                console.log(response.data)
                setComments(prev => ({
                    ...prev,
                    [id]: [...(prev[id] || []), response.data]
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
                                        onClick={(event) => {
                                            handleToggleDelete(event);
                                        }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                )}
                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={ Boolean(anchorEl)}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem onClick={()=> handleElimina(discussion.id)}>Elimina Discussione</MenuItem>

                                </Menu>
                            </Box>
                            <Typography variant="body2" color={colors.grey[400]}>{discussion.text_discussion}</Typography>

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
                                    <Button variant="contained" color="primary" onClick={()=>handleAddComment(discussion.id)} sx={{ mt: 1 }}>
                                        Invia
                                    </Button>
                                </Box>
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Bottone per aggiungere una nuova discussione */}
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    backgroundColor: colors.greenAccent[500],
                    '&:hover': {
                        backgroundColor: colors.greenAccent[700],
                    },
                }}
                aria-label="add"
                onClick={() => setOpenDialog(true)}
            >
                <AddIcon />
            </Fab>

            {/* Dialogo per aggiungere una nuova discussione */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
                    Aggiungi una nuova discussione
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: colors.primary[400] }}>
                    <TextField
                        label="Titolo"
                        fullWidth
                        value={newDiscussionTitle}
                        onChange={(e) => setNewDiscussionTitle(e.target.value)}
                        sx={{
                            mb: 2,
                            backgroundColor: colors.primary[400],
                            color: colors.grey[100],
                            '& .MuiInputLabel-root': {
                                color: colors.grey[100],
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: colors.grey[100],
                                },
                                '&:hover fieldset': {
                                    borderColor: colors.grey[100],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: colors.grey[100],
                                },
                            },
                        }}
                    />
                    <TextField
                        label="Descrizione"
                        fullWidth
                        multiline
                        rows={4}
                        value={newDiscussionText}
                        onChange={(e) => setNewDiscussionText(e.target.value)}
                        sx={{
                            mb: 2,
                            backgroundColor: colors.primary[400],
                            color: colors.grey[100],
                            '& .MuiInputLabel-root': {
                                color: colors.grey[100],
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: colors.grey[100],
                                },
                                '&:hover fieldset': {
                                    borderColor: colors.grey[100],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: colors.grey[100],
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: colors.primary[400] }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: colors.grey[100] }}>
                        Annulla
                    </Button>
                    <Button onClick={handleAddDiscussion} sx={{ color: colors.grey[100] }}>
                        Aggiungi
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="warning">
                    Devi effettuare il login per aggiungere una discussione o un commento!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default DiscussionPage;





















































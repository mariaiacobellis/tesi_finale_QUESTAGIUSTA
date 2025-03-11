import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, IconButton, Collapse } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { ExpandMore as ExpandMoreIcon, Comment as CommentIcon } from '@mui/icons-material';
import { useLocation } from "react-router-dom";

const discussions = [
    {
        title: "Discussione 1",
        description: "Questa è la descrizione della discussione 1. Clicca per vedere i commenti.",
        comments: [
            "Questo è il primo commento sulla discussione 1.",
            "Altro commento interessante sulla discussione 1."
        ]
    },
    {
        title: "Discussione 2",
        description: "Questa è la descrizione della discussione 2. Clicca per vedere i commenti.",
        comments: [
            "Commento sulla discussione 2.",
            "Un altro commento sulla discussione 2."
        ]
    }
];

const DiscussionPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [openIndex, setOpenIndex] = useState(null);

    // Recupera i parametri dall'URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const datasetTitle = queryParams.get("datasetTitle");  // Ottieni il nome del dataset

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
            <Header title="Discussioni" subtitle="Partecipa alle discussioni e lascia i tuoi commenti" />

            {/* Sezione dedicata ai commenti per un dataset specifico */}
            {datasetTitle && (
                <Box mb={4} p={2} sx={{ backgroundColor: colors.primary[300], borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Commenti per: {datasetTitle}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[600]}>
                        Qui puoi votare e commentare il dataset "{datasetTitle}".
                    </Typography>
                </Box>
            )}

            <Box display="flex" flexDirection="column" gap={2}>
                {discussions.map((discussion, index) => (
                    <Card
                        key={index}
                        sx={{
                            backgroundColor: colors.primary[400],
                            boxShadow: 3,
                            borderRadius: 2,
                            mb: index === discussions.length - 1 ? 4 : 0
                        }}
                    >
                        <CardContent>
                            {/* TITOLI E DESCRIZIONI DELLE DISCUSSIONI */}
                            <Box
                                display="flex"
                                flexDirection="column"
                                mb={2}
                                sx={{ cursor: "pointer" }}
                            >
                                <Typography variant="h6" fontWeight="bold">{discussion.title}</Typography>
                                <Typography variant="body2" color={colors.grey[600]}>
                                    {discussion.description}
                                </Typography>
                            </Box>

                            {/* ESPANSIONE COMMENTI */}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleToggle(index)}
                            >
                                <Typography variant="body2" color={colors.blueAccent[500]}>
                                    {openIndex === index ? "Nascondi commenti" : "Mostra commenti"}
                                </Typography>
                                <IconButton>
                                    <ExpandMoreIcon
                                        sx={{
                                            transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.3s ease"
                                        }}
                                    />
                                </IconButton>
                            </Box>

                            {/* COMMENTI ESPANDIBILI */}
                            <Collapse in={openIndex === index}>
                                <Box mt={2} display="flex" flexDirection="column" gap={1}>
                                    {discussion.comments.map((comment, commentIndex) => (
                                        <Box key={commentIndex} display="flex" alignItems="center" gap={1}>
                                            <CommentIcon sx={{ color: colors.greenAccent[500] }} />
                                            <Typography variant="body2" color={colors.grey[500]}>
                                                {comment}
                                            </Typography>
                                        </Box>
                                    ))}
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



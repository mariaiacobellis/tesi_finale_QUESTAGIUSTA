import React, { useState } from "react";
import { Container, Typography, Card, CardContent, Box, useTheme, Collapse, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
    {
        question: "Cos'è DataRec e cosa offre?",
        answer: "DataRec è un sito web che offre gratuitamente dataset. Gli utenti possono scaricare, votare e caricare nuovi dataset per condividerli con altri utenti."
    },
    {
        question: "Chi può utilizzare questo sito web?",
        answer: "Chiunque può utilizzare questo sito web."
    },
    {
        question: "I dataset possono essere scaricati gratuitamente?",
        answer: "Sì, tutti i dataset disponibili sul sito possono essere scaricati gratuitamente."
    },
    {
        question: "È necessaria la registrazione per utilizzare il sito?",
        answer: "La registrazione non è necessaria per scaricare i dataset, ma è richiesta per votarli, aggiungere commenti e caricare nuovi dataset."
    },
    {
        question: "Posso caricare i miei dataset sul sito?",
        answer: "Sì, ogni utente registrato può caricare i propri dataset sul sito e renderli accessibili ad altri utenti."
    },
    {
        question: "Come posso verificare l'affidabilità di un dataset?",
        answer: "Puoi controllare le valutazioni lasciate da altri utenti per determinare la qualità del dataset."
    },
    {
        question: "Esiste una community o forum per discutere sui dataset?",
        answer: "Sì, abbiamo una sezione della community dove gli utenti possono discutere e chiedere consigli "
    }
];

const FAQPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
            <Header title="FAQ" subtitle="Trova le risposte alle domande più comuni" />
            <Box display="flex" flexDirection="column" gap={2}>
                {faqs.map((faq, index) => (
                    <Card
                        key={index}
                        sx={{
                            backgroundColor: colors.primary[400],
                            boxShadow: 3,
                            borderRadius: 2,
                            mb: index === faqs.length - 1 ? 4 : 0
                        }}
                    >
                        <CardContent>
                            {/* DOMANDA */}
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                gap={1}
                                mb={1}
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleToggle(index)}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <HelpOutlineIcon sx={{ color: colors.blueAccent[500] }} />
                                    <Typography variant="h6" fontWeight="bold">{faq.question}</Typography>
                                </Box>
                                <IconButton>
                                    <ExpandMoreIcon
                                        sx={{
                                            transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.3s ease"
                                        }}
                                    />
                                </IconButton>
                            </Box>

                            {/* RISPOSTA A COMPARSA */}
                            <Collapse in={openIndex === index}>
                                <Box display="flex" alignItems="center" gap={1} mt={1}>
                                    <QuestionAnswerIcon sx={{ color: colors.greenAccent[500] }} />
                                    <Typography>{faq.answer}</Typography>
                                </Box>
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default FAQPage;



import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardMedia, CardContent, useTheme } from "@mui/material";
import { tokens } from "../src/theme";
import data from "../src/data"; // Assicurati che questo file contenga gli ID

const DatasetDetail = () => {
    const { id } = useParams(); // Ottiene l'ID dall'URL
    const theme = useTheme();
    const colors = tokens(theme.palette.mode); // Ottiene i colori dal tema attuale
    const dataset = data.find((d) => d.id === id); // Trova il dataset corrispondente

    if (!dataset) {
        return <Typography variant="h4" color="error">Dataset non trovato</Typography>;
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
            <Card sx={{ maxWidth: 800, backgroundColor: colors.primary[400], boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={dataset.image}
                    alt={dataset.title}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom color={colors.blueAccent[500]}>
                        {dataset.title}
                    </Typography>
                    <Typography variant="body1" color={colors.grey[100]}>
                        {dataset.description}
                    </Typography>
                    <Typography variant="subtitle1" color={colors.greenAccent[500]}>
                        Categoria: {dataset.category}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default DatasetDetail;


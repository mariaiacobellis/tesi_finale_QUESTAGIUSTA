import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, useTheme } from '@mui/material';
import { tokens } from '../theme';  // Importa i token del tema (assicurati che il percorso sia corretto)

const DatasetCard = ({ dataset }) => {
    const theme = useTheme();  // Ottieni il tema attuale
    const colors = tokens(theme.palette.mode);  // Ottieni i colori in base alla modalità (light/dark)

    return (
        <Card sx={{ maxWidth: 345, backgroundColor: colors.primary[500], boxShadow: 3 }}>
            <CardMedia
                component="img"
                alt={dataset.title}
                height="140"
                image={dataset.image}  // Immagine del dataset
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: colors.grey[100] }}>
                    {dataset.title}
                </Typography>
                <Button
                    size="small"
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        color: colors.grey[100],
                        '&:hover': {
                            backgroundColor: colors.greenAccent[600],
                        }
                    }}
                    onClick={() => alert(`Cliccato su: ${dataset.title}`)}  // Correzione dell'alert
                >
                    Vedi Dettagli
                </Button>
            </CardContent>
        </Card>
    );
};

export default DatasetCard;

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, useTheme } from '@mui/material';
import { tokens } from '../theme';  // Importa i token del tema
import { useNavigate } from 'react-router-dom';  // Importa useNavigate da React Router

const DatasetCard = ({ dataset }) => {
    const theme = useTheme();  // Ottieni il tema attuale
    const colors = tokens(theme.palette.mode);  // Ottieni i colori in base alla modalità (light/dark)
    const navigate = useNavigate();  // Hook per la navigazione

    const handleClick = () => {
        // Naviga alla pagina del singolo dataset usando l'ID
        navigate(`/dataset/${dataset.id}`);  // Cambia `dataset.id` con il campo che usi per identificare il dataset
    };

    return (
        <Card sx={{ maxWidth: 345, backgroundColor: colors.primary[400], boxShadow: 3 }}>
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
                    onClick={handleClick}  // Al click, naviga alla pagina del dataset
                >
                    Vedi Dettagli
                </Button>
            </CardContent>
        </Card>
    );
};

export default DatasetCard;




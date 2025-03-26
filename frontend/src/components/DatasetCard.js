import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, useTheme } from '@mui/material';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';

const DatasetCard = ({ dataset }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/dataset/${dataset.id}`);
    };

    return (
        <Card sx={{ maxWidth: 345, backgroundColor: colors.primary[400], boxShadow: 3 }}>
            <CardMedia
                component="img"
                alt={dataset.title}
                height="140"
                image={dataset.img}
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
                    onClick={handleClick}
                >
                    Vedi Dettagli
                </Button>
            </CardContent>
        </Card>
    );
};

export default DatasetCard;




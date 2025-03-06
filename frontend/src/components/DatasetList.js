import React from 'react';
import { Grid } from '@mui/material';
import DatasetCard from './DatasetCard';
import datasets from '../data'; // Importa i dati dei dataset

const DatasetList = () => {
    return (
        <Grid container spacing={3}>
            {datasets.map((dataset, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                    <DatasetCard dataset={dataset} />
                </Grid>
            ))}
        </Grid>
    );
};

export default DatasetList;

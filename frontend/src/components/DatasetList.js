import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Grid, useTheme, useMediaQuery } from "@mui/material";
import DatasetCard from "./DatasetCard";
import { Link } from "react-router-dom";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { tokens } from "../theme";

const DatasetList = ({ datasets, showNavigation = true }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const containerRef = useRef(null);
    const [maxVisibleCards, setMaxVisibleCards] = useState(1);
    const [startIndex, setStartIndex] = useState(0);


    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const updateVisibleCards = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const cardWidth = 218;
                const maxCards = Math.floor(containerWidth / cardWidth);
                setMaxVisibleCards(maxCards > 0 ? maxCards : 1);
            }
        };

        updateVisibleCards();
        window.addEventListener("resize", updateVisibleCards);
        return () => window.removeEventListener("resize", updateVisibleCards);
    }, []);

    useEffect(() => {
        // Forza a 1 solo card sui dispositivi mobili
        setMaxVisibleCards(isMobile ? 1 : Math.floor(containerRef.current.offsetWidth / 218));
    }, [isMobile]);

    const nextCards = () => {
        if (startIndex + maxVisibleCards < datasets.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevCards = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
            {showNavigation && (
                <>

                    <Button onClick={prevCards} disabled={startIndex === 0} sx={{ minWidth: "50px" }}>
                        <ArrowBack sx={{ color: startIndex === 0 ? "gray" : colors.blueAccent[500] }} />
                    </Button>
                </>
            )}


            <Box
                ref={containerRef}
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    width: { xs: "90%", sm: "80%", md: "70%" },
                    maxWidth: "100%",
                }}
            >
                <Grid container spacing={2} sx={{ flexWrap: "nowrap", justifyContent: "center" }}>
                    {datasets.slice(startIndex, startIndex + maxVisibleCards).map((data) => (
                        <Grid item key={data.id} sx={{ flex: "1 1 auto", maxWidth: "220px" }}>
                            <Link to={`/datasets/${data.id}`} style={{ textDecoration: "none" }}>
                                <DatasetCard dataset={data} />
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {showNavigation && (
                <>

                    <Button onClick={nextCards} disabled={startIndex + maxVisibleCards >= datasets.length} sx={{ minWidth: "50px" }}>
                        <ArrowForward sx={{ color: startIndex + maxVisibleCards >= datasets.length ? "gray" : colors.blueAccent[500] }} />
                    </Button>
                </>
            )}
        </Box>
    );
};

export default DatasetList;








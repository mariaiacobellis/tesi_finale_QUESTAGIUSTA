import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Header from "../../components/Header";


const Homepage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 3 }}>
                <Header title="Homepage" subtitle="Scopri chi siamo" />
            </Box>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h3" sx={{ mb: 2, color: colors.primary[100] }}>
                    Benvenuto {localStorage.getItem("username") || ""} su <strong>NOME SITO</strong>,
                </Typography>

                <Typography variant="h4" sx={{ color: colors.primary[100] }}>
                    La piattaforma ideale per <strong>SCOPRIRE</strong>, <strong>CONDIVIDERE</strong> e <strong>VALORIZZARE</strong> i tuoi dataset!<br />
                    Qui puoi <strong>scaricare i dataset</strong> di cui hai bisogno per il tuo lavoro, la tua ricerca o i tuoi progetti. Grazie alla nostra ampia selezione, individuare le informazioni giuste sarà semplice e veloce.<br />
                    Hai dei <strong>dataset da condividere?</strong> Caricali sulla piattaforma e rendili accessibili ad altri utenti. Ogni upload aiuta a costruire una comunità di dati sempre più ricca e utile per tutti.<br />
                    Inoltre, ogni utente ha la possibilità di <strong>votare i dataset</strong> che ha utilizzato, aiutando a evidenziare quelli più rilevanti e di qualità.<br />
                    Siamo sempre aperti ai suggerimenti per migliorare il sito. Se hai idee, faccelo sapere!<br />
                    Unisciti a noi: esplora, carica, vota e contribuisci a far crescere la nostra community di dati! :)
                </Typography>
            </Box>
        </>
    );
};

export default Homepage;






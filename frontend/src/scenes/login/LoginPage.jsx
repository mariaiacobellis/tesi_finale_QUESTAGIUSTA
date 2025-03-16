import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import {useNavigate, useLocation} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

const LoginPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const navigate = useNavigate();
    const location = useLocation();
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");

    const onLogin = async () => {
        try {
            setError(""); // Rimuove il messaggio di errore se il login è corretto
            const res = await axios.post("http://localhost:5000/auth/login", {
                username: username,
                password: password,
            });
            localStorage.setItem('username', username);

            // Se c'è una pagina precedente salvata, reindirizza lì. Altrimenti, vai alla home
            const redirectPath = location.state?.from || "/"; // Default alla home
            navigate(redirectPath);
        } catch (error) {
            setError("Email o password non validi");
        }
    };


    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <TextField
                onChange={(e) => setUsername(e.target.value)}
                label="Username"
                fullWidth
                margin="normal"
                error={!!error}
                sx={{
                    input: { color: theme.palette.text.primary }
                }}
            />
            <TextField
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!error}
                sx={{
                    input: { color: theme.palette.text.primary }
                }}
            />
            <Button onClick={()=> onLogin()}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ backgroundColor: colors.primary[500] }}
            >
                Accedi
            </Button>

            <Box display="flex" justifyContent="center" marginTop={2}>
                <Typography variant="body2" align="center">
                    Non hai un account?{' '}
                </Typography>

                <Box component="button" marginLeft={0.5}
                     onClick={() => navigate('/register')}
                     sx={{
                         textDecoration: "underline",
                         color: colors.blueAccent[500],
                         background: "none",
                         border: "none",
                         cursor: "pointer",
                         padding: 0,
                         fontSize: "inherit"
                     }}
                >
                    <Typography variant="body2">Registrati</Typography>
                </Box>


            </Box>
            {error && (
                <Box display="flex" justifyContent="center" marginTop={1}>
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
                </Box>
            )}
        </Container>
    );
};

export default LoginPage;









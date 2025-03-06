import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";


const RegisterPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");


    const onRegister = async () => {
        if (password !== "" && repeatPassword!=="" && user !==""){
            setError("")
        if (password === repeatPassword) {
            try {
                const res = await axios.post("http://localhost:5000/auth/register", {
                    username: user,
                    password: password
                });
                navigate('/login')
            } catch (e) {
                if (e.response.data.code===
                    "ER_DUP_ENTRY"){
                    setError("Utente già presente del database!")
                }
            }
        } else {
            setError("Le due password non sono uguali!!!")
        }}
        else{
            setError("Riempire tutti i campi!")
        }
    }


    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Registrazione
            </Typography>

            <TextField
                onChange={(e)=> setUser(e.target.value)}
                label="Username"
                error={!!error}
                fullWidth
                margin="normal"
                sx={{
                    input: { color: theme.palette.text.primary }
                }}
            />
            <TextField
                onChange={(e)=> setPassword(e.target.value)}
                label="Password"
                type="password"
                error={!!error}
                fullWidth
                margin="normal"
                sx={{
                    input: { color: theme.palette.text.primary }
                }}
            />
            <TextField
                onChange={(e)=> setRepeatPassword(e.target.value)}
                label="Conferma Password"
                type="password"
                error={!!error}
                fullWidth
                margin="normal"
                sx={{
                    input: { color: theme.palette.text.primary }
                }}
            />
            <Button
                variant="contained"
                onClick={()=>onRegister()}
                color="primary"
                fullWidth
                sx={{ backgroundColor: colors.primary[500] }}
            >
                Registrati
            </Button>
            <Box display="flex" justifyContent="center" marginTop={2}>
                <Typography variant="body2" align="center">
                    Hai già un account?{' '}
                </Typography>
                <Box component="button" marginLeft={0.5}
                     onClick={() => navigate('/login')}
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
                    <Typography variant="body2">Accedi</Typography>
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

export default RegisterPage;




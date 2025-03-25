import { useState, useEffect, useContext } from "react";
import {Box, IconButton, useTheme, InputBase, MenuItem, Menu, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";



const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate(); // Hook per navigare tra le pagine

    const [showTopbar, setShowTopbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const[open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [dataset, setDatasets] = useState([]);


    const handleSelect = (event, value) => {
        if (value) {
            navigate(`/datasets/${value.id}`);
        }
    };

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/datasets/all');
                console.log("Response:", response.data);
                if (response.data.datasets) {
                    setDatasets(response.data.datasets);
                } else {
                    console.error("Nessun dataset trovato nella risposta!");
                }
            } catch (error) {
                console.error("Errore nel fetch dei dataset:", error);
            }
        };


        fetchDatasets();

    }, []);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                setShowTopbar(false);
            } else {
                setShowTopbar(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const onProfile = () =>{
        if (localStorage.getItem("username")){
            setOpen(true)
        }else{
            navigate('/login')
        }
    }
    const onLogout = () => {
        localStorage.removeItem("username");
        setOpen(false);
        navigate("/login"); // Porta l'utente alla pagina di login
    };
    const onAdmin= () => {
        setOpen(false);
        navigate("/admin"); // Porta l'utente alla pagina di login
    };




    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "60px",
                    zIndex: 1000,
                    backgroundColor: "transparent",
                    backdropFilter: "blur(8px)",
                    color: colors.grey[100],
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    transition: "transform 0.3s ease-in-out",
                    transform: showTopbar ? "translateY(0)" : "translateY(-100%)",
                }}
            >
                <Box>{/* Logo o menu */}</Box>

                <Box display="flex" alignItems="center">
                    <Box
                        display="flex"
                        backgroundColor={colors.primary[400]}
                        borderRadius="3px"
                        p={1}
                        mr={2}
                        sx={{
                            width: { xs: "100px", sm: "150px", md: "200px" },
                            transition: "width 0.3s ease-in-out"
                        }}
                    >
                        <Autocomplete
                            options={dataset}
                            getOptionLabel={(option) => option.title}
                            onChange={handleSelect}
                            inputValue={inputValue}
                            sx = {{flex:1, ml:1}}
                            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Search" variant="outlined" fullWidth />
                            )}
                        />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchIcon />
                        </IconButton>
                    </Box>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? (
                            <LightModeOutlinedIcon />
                        ) : (
                            <DarkModeOutlinedIcon />
                        )}
                    </IconButton>
                    {/* Bottone per il login */}
                    <IconButton onClick={() => onProfile()}>
                        <PersonOutlinedIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ height: "60px" }} />
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                open={open}
                onClose={e=>setOpen(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={()=> onLogout()}>Logout</MenuItem>
                {localStorage.getItem("username") == "admin" &&<MenuItem onClick={()=> onAdmin()}>Admin</MenuItem>}
            </Menu>

        </>
    );
};

export default Topbar;










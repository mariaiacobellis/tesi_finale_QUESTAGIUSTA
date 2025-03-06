import { useState, useEffect, useContext } from "react";
import {Box, IconButton, useTheme, InputBase, MenuItem, Menu} from "@mui/material";
import {useNavigate} from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate(); // Hook per navigare tra le pagine

    const [showTopbar, setShowTopbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const[open, setOpen] = useState(false)


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
                        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" />
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
            </Menu>

        </>
    );
};

export default Topbar;










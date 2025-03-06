import { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DatasetIcon from '@mui/icons-material/Dataset';
import ChatIcon from '@mui/icons-material/Chat';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AddIcon from '@mui/icons-material/Add';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // True se lo schermo è piccolo
    const [selected, setSelected] = useState("Homepage");

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: isMobile ? 80 : 240, // Sidebar più stretta su mobile
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: isMobile ? 80 : 240,
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                    borderRight: "none",
                },
            }}
        >
            {/* HEADER */}
            <Box display="flex" alignItems="center" justifyContent="center" p={2}>
                {isMobile ? (
                    <MenuOutlinedIcon sx={{ color: colors.grey[100] }} /> // Icona menu al posto del nome
                ) : (
                    <Typography variant="h6" color={colors.grey[100]}>
                        NOME SITO
                    </Typography>
                )}
            </Box>

            {/* MENU */}
            <List>
                <SidebarItem title="HOMEPAGE" to="/" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} isMobile={isMobile} />
                <SidebarItem title="DATASETS" to="/datasets" icon={<DatasetIcon />} selected={selected} setSelected={setSelected} isMobile={isMobile} />
                <SidebarItem title="DISCUSSION" to="/discussion" icon={<ChatIcon />} selected={selected} setSelected={setSelected} isMobile={isMobile} />
                <SidebarItem title="FAQ" to="/faq" icon={<ContactSupportIcon />} selected={selected} setSelected={setSelected} isMobile={isMobile} />
                <SidebarItem title="ADD DATASET" to="/adddatasets" icon={<AddIcon />} selected={selected} setSelected={setSelected} isMobile={isMobile} />
            </List>
        </Drawer>
    );
};

const SidebarItem = ({ title, to, icon, selected, setSelected, isMobile }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <ListItem disablePadding sx={{ mb: 2 }}>
            <ListItemButton
                component={Link}
                to={to}
                selected={selected === title}
                onClick={() => setSelected(title)}
                sx={{
                    color: colors.grey[100],
                    justifyContent: isMobile ? "center" : "flex-start", // Centra l'icona su mobile
                    "&.Mui-selected": { backgroundColor: colors.blueAccent[700] },
                    "&:hover": { backgroundColor: colors.blueAccent[100] },
                }}
            >
                <ListItemIcon sx={{ color: colors.grey[100], minWidth: 0, mr: isMobile ? 0 : 2 }}>
                    {icon}
                </ListItemIcon>
                {!isMobile && (
                    <Typography variant="body1" color={colors.grey[100]}>
                        {title}
                    </Typography>
                )}
            </ListItemButton>
        </ListItem>
    );
};

export default Sidebar;

















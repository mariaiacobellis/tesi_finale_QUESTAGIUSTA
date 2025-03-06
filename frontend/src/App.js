import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Homepage from "./scenes/homepage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginPage from "./scenes/login/LoginPage";
import FAQPage from "./scenes/faq/FaqPage";
import RegisterPage from "./scenes/login/RegisterPage";
import Datasets from './scenes/datasets/Datasets';  // Verifica che il percorso sia corretto
import Discussion from './scenes/discussion/Discussion'; // Verifica anche questo
import Add from './scenes/adddataset/Add'; // Assicurati che il percorso sia giusto

function App() {
  const [theme, colorMode] = useMode();  // Ottieni il tema e la modalità di colore
  const [isSidebar, setIsSidebar] = useState(true);  // Stato per la visibilità della Sidebar

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />  {/* Sidebar che riceve la visibilità come prop */}
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />  {/* Topbar che aggiorna la visibilità della sidebar */}
              <Routes>
                <Route path="/" element={<Homepage />} />  {/* Pagina principale */}
                <Route path="/login" element={<LoginPage />} />  {/* Pagina di Login */}
                <Route path="/faq" element={<FAQPage />} />  {/* Pagina FAQ */}
                <Route path="/register" element={<RegisterPage />} />  {/* Pagina di Registrazione */}
                <Route path="/datasets" element={<Datasets />} />  {/* Pagina Datasets */}
                <Route path="/discussion" element={<Discussion />} />  {/* Pagina Discussione */}
                <Route path="/adddatasets" element={<Add />} />  {/* Pagina per aggiungere dataset */}
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;




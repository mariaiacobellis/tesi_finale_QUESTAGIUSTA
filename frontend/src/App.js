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
import Datasets from './scenes/datasets/Datasets';
import DatasetDetail from './DatasetDetail';
import Discussion from './scenes/discussion/Discussion';
import Add from './scenes/adddataset/Add';
import Admin from "./scenes/admin/Admin";
import DatasetVoteComment from "./DatasetVoteComment";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/datasets" element={<Datasets />} />
                <Route path="/datasets/:id" element={<DatasetDetail />} />
                <Route path="/discussion" element={<Discussion />} />
                <Route path="/discussion/:id" element={<Discussion />} />
                <Route path="/adddatasets" element={<Add />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/vote/:id" element={<DatasetVoteComment />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;





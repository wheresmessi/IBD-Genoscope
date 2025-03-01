import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; 
import SelectDataset from "./pages/SelectDataset";
import DatasetPage from "./pages/DatasetPage";
import ToolsPage from "./pages/ToolsPage";
import IBDGenoscope from "./pages/IBDGenoscope";
import Layout from "./components/Layout";
import About from "./pages/About";
function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Home/Login Page */}
        <Route path="/" element={<Home />} />

        {/* ✅ Layout Wrapper for Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/select-dataset" element={<SelectDataset />} />
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/ibd-genoscope" element={<IBDGenoscope />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
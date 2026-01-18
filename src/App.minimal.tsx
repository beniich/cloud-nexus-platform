import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SitesDashboard from "./features/site-builder/SitesDashboard";
import { SiteProvider } from "./features/site-builder/context/SiteContext";

// Version minimale pour tester le Site Builder uniquement
function App() {
    return (
        <BrowserRouter>
            <SiteProvider>
                <Routes>
                    <Route path="/" element={<SitesDashboard />} />
                    <Route path="/sites" element={<SitesDashboard />} />
                    <Route path="*" element={<SitesDashboard />} />
                </Routes>
            </SiteProvider>
        </BrowserRouter>
    );
}

export default App;

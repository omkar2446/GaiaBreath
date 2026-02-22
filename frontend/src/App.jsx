import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HealthAdvisor from "./pages/HealthAdvisor";
import HealthReport from "./pages/HealthReport";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import AqiMap from "./pages/AqiMap";
import IotReport from "./pages/IotReport";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/healthadvisor" element={<HealthAdvisor />} />
        <Route path="/healthreport" element={<HealthReport />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aqi-map" element={<AqiMap />} />
        <Route path="/iot-report" element={<IotReport />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

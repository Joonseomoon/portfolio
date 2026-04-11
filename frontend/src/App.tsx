import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";

export default function App() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#03030f" }}>
            <Navbar />

            {/* NECESSARY: display:flex so the routed page can stretch */}
            <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
        </div>
    );
}

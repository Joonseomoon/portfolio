import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";

export default function App() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Navbar />

            {/* NECESSARY: display:flex so the routed page can stretch */}
            <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
        </div>
    );
}


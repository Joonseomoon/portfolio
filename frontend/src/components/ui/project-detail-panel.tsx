"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, ExternalLink, X } from "lucide-react";
import type { IPortfolioItem } from "../../api";

const STRONG_EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface ProjectDetailPanelProps {
    item: IPortfolioItem;
    onClose: () => void;
}

// ── Shared expanded project view — opened from both the featured carousel and
// the "All Projects" grid, so it always shows the real title/description
// (never featured_text, which is a carousel-tile-only teaser). ──────────────
export function ProjectDetailPanel({ item, onClose }: ProjectDetailPanelProps) {
    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%;overflow:hidden`;
        document.body.dataset.scrollY = String(scrollY);
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => {
            const sy = parseInt(document.body.dataset.scrollY ?? "0", 10);
            document.body.style.cssText = "";
            window.scrollTo({ top: sy, behavior: "instant" as ScrollBehavior });
            window.removeEventListener("keydown", handler);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5vh 1.5rem 2rem" }}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0"
                style={{ background: "rgba(247,245,240,0.9)", backdropFilter: "blur(12px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Panel */}
            <motion.div
                className="relative z-10 w-full overflow-hidden"
                style={{
                    maxWidth: 760,
                    background: "#F7F5F0",
                    borderRadius: 20,
                    border: "1px solid rgba(28,25,23,0.12)",
                    boxShadow: "0 40px 100px rgba(28,25,23,0.18), 0 8px 24px rgba(28,25,23,0.1)",
                }}
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.38, ease: STRONG_EASE_OUT } }}
                exit={{ opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.22, ease: "easeIn" } }}
            >
                {/* Close */}
                <motion.button
                    className="absolute top-4 right-4 z-20 flex items-center justify-center cursor-pointer"
                    style={{
                        width: 34, height: 34,
                        background: "rgba(247,245,240,0.95)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(28,25,23,0.18)",
                        color: "#1C1917",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(28,25,23,0.14)",
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.18 } }}
                    whileHover={{ backgroundColor: "rgba(237,232,222,0.98)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={14} />
                </motion.button>

                <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
                    {/* Hero image */}
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", borderRadius: "20px 20px 0 0" }}>
                        <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover select-none"
                            draggable={false}
                        />
                    </div>

                    <div className="p-7 sm:p-9">
                        {item.featured && (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 18 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8C7355" }} />
                                <p style={{
                                    fontFamily: '"DM Sans", system-ui, sans-serif',
                                    fontSize: 10,
                                    letterSpacing: "0.24em",
                                    textTransform: "uppercase",
                                    color: "#8C7355",
                                }}>
                                    Featured Project
                                </p>
                            </div>
                        )}

                        <motion.h2
                            className="mb-4"
                            style={{
                                fontFamily: '"DM Serif Display", Georgia, serif',
                                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                                fontWeight: 400,
                                lineHeight: 1.1,
                                letterSpacing: "-0.02em",
                                color: "#1C1917",
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.36, ease: STRONG_EASE_OUT } }}
                        >
                            {item.title}
                        </motion.h2>

                        <motion.p
                            className="mb-6"
                            style={{
                                fontFamily: '"DM Sans", system-ui, sans-serif',
                                fontSize: "0.875rem",
                                lineHeight: 1.8,
                                color: "#57534E",
                                maxWidth: "58ch",
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.24, duration: 0.36, ease: STRONG_EASE_OUT } }}
                        >
                            {item.description}
                        </motion.p>

                        {(item.project_url || item.github_url) && (
                            <motion.div
                                className="mb-6"
                                style={{ display: "flex", alignItems: "center", gap: 8 }}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: 0.28, duration: 0.32, ease: STRONG_EASE_OUT } }}
                            >
                                {item.project_url && (
                                    <a
                                        href={item.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="exp-company-link"
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                            fontFamily: '"DM Sans", system-ui, sans-serif',
                                            fontSize: 11, letterSpacing: "0.04em",
                                            color: "#1C1917", textDecoration: "none",
                                            border: "1px solid rgba(28,25,23,0.18)",
                                            borderRadius: 8, padding: "6px 14px",
                                        }}
                                    >
                                        Live site
                                        <ExternalLink size={11} style={{ opacity: 0.6 }} />
                                    </a>
                                )}
                                {item.github_url && (
                                    <a
                                        href={item.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="exp-company-link"
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                            fontFamily: '"DM Sans", system-ui, sans-serif',
                                            fontSize: 11, letterSpacing: "0.04em",
                                            color: "#1C1917", textDecoration: "none",
                                            border: "1px solid rgba(28,25,23,0.18)",
                                            borderRadius: 8, padding: "6px 14px",
                                        }}
                                    >
                                        Source
                                        <Code2 size={11} style={{ opacity: 0.6 }} />
                                    </a>
                                )}
                            </motion.div>
                        )}

                        {item.icon_urls.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: 0.32, duration: 0.32, ease: STRONG_EASE_OUT } }}
                            >
                                <p style={{
                                    fontFamily: '"DM Sans", system-ui, sans-serif',
                                    fontSize: 9,
                                    letterSpacing: "0.24em",
                                    textTransform: "uppercase",
                                    color: "#A8A29E",
                                    marginBottom: 10,
                                }}>
                                    Stack
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                    {item.icon_urls.map((url, i) => (
                                        <img
                                            key={i} src={url} alt="" draggable={false}
                                            style={{ width: 24, height: 24, objectFit: "contain", opacity: 0.7 }}
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

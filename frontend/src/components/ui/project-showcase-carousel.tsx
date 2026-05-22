"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { IPortfolioItem } from "../../api";

// ── Outside-click hook ────────────────────────────────────────────────────────
function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, cb: () => void) {
    useEffect(() => {
        const handler = (e: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(e.target as Node)) return;
            cb();
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [ref, cb]);
}

// ── Card dimensions ───────────────────────────────────────────────────────────
const CARD_W_MAX = 500;
const CARD_W_MIN = 260;
function getCardW() {
    if (typeof window === "undefined") return CARD_W_MAX;
    return Math.max(CARD_W_MIN, Math.min(CARD_W_MAX, window.innerWidth * 0.78));
}

// ── Animation timing ─────────────────────────────────────────────────────────
const IMG_TRANSITION_S = 0.45;
const CARD_HOVER_DURATION_S = 0.36;

// ── Tilt angles for pinboard feel ────────────────────────────────────────────
const TILTS = [1.8, -1.4, 2.2, -1.9, 1.2, -2.4, 1.6, -1.1];

// ── Warm accent dots cycling per card ────────────────────────────────────────
const ACCENTS = ["#8C7355", "#7A6E63", "#9E8B78", "#6B6258"];

// ── Short teaser from description ─────────────────────────────────────────────
function teaser(desc: string, max = 88): string {
    if (desc.length <= max) return desc;
    const dot = desc.indexOf(".");
    if (dot > 0 && dot <= max) return desc.slice(0, dot + 1);
    const cut = desc.slice(0, max);
    return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

// ── Expanded panel ────────────────────────────────────────────────────────────
function ExpandedPanel({ item, onClose }: { item: IPortfolioItem; onClose: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick(ref, onClose);

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
            style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5vh 1rem 2rem" }}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0"
                style={{ background: "rgba(247,245,240,0.92)", backdropFilter: "blur(14px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Panel */}
            <motion.div
                ref={ref}
                className="relative z-10 w-full overflow-hidden"
                style={{
                    maxWidth: 760,
                    background: "#F7F5F0",
                    border: "1px solid rgba(28,25,23,0.12)",
                    boxShadow: "0 40px 100px rgba(28,25,23,0.18), 0 8px 24px rgba(28,25,23,0.1)",
                    borderRadius: 20,
                }}
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] } }}
                exit={{ opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.22, ease: "easeIn" } }}
            >
                {/* Close button */}
                <motion.button
                    className="absolute top-4 right-4 z-20 flex items-center justify-center cursor-pointer"
                    style={{
                        width: 34, height: 34,
                        background: "rgba(247,245,240,0.95)",
                        backdropFilter: "blur(8px)",
                        color: "#1C1917",
                        borderRadius: "50%",
                        border: "1px solid rgba(28,25,23,0.18)",
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

                {/* Scrollable content */}
                <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
                    {/* Hero screenshot */}
                    <div style={{ aspectRatio: "16/9", overflow: "hidden", borderRadius: "20px 20px 0 0" }}>
                        <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover select-none"
                            draggable={false}
                        />
                    </div>

                    {/* Content area */}
                    <div style={{ padding: "28px 36px 36px" }}>
                        {/* Featured badge */}
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

                        <h2
                            style={{
                                fontFamily: '"DM Serif Display", Georgia, serif',
                                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                                fontWeight: 400,
                                fontStyle: "italic",
                                lineHeight: 1.1,
                                letterSpacing: "-0.02em",
                                color: "#1C1917",
                                textTransform: "lowercase",
                                marginBottom: "1rem",
                            }}
                        >
                            {item.title}
                        </h2>

                        <motion.p
                            style={{
                                fontFamily: '"DM Sans", system-ui, sans-serif',
                                fontSize: "0.875rem",
                                lineHeight: 1.8,
                                color: "#57534E",
                                maxWidth: "58ch",
                                marginBottom: "1.5rem",
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.36 } }}
                        >
                            {item.description}
                        </motion.p>

                        {item.icon_urls.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: 0.32, duration: 0.32 } }}
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
                                            key={i} src={url} alt=""
                                            style={{ width: 24, height: 24, objectFit: "contain", opacity: 0.7 }}
                                            draggable={false}
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

// ── Individual parchment card ─────────────────────────────────────────────────
function ProjectCard({ item, index, cardW }: { item: IPortfolioItem; index: number; cardW: number }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const tilt = TILTS[index % TILTS.length];
    const accent = ACCENTS[index % ACCENTS.length];
    const handleClose = useCallback(() => setIsExpanded(false), []);
    const cardTeaser = teaser(item.description);

    return (
        <>
            {createPortal(
                <AnimatePresence>
                    {isExpanded && <ExpandedPanel item={item} onClose={handleClose} />}
                </AnimatePresence>,
                document.body
            )}

            <motion.button
                onClick={() => setIsExpanded(true)}
                className="cursor-pointer"
                style={{
                    rotate: tilt,
                    transformOrigin: "center bottom",
                    background: "none",
                    border: "none",
                    padding: 0,
                    display: "block",
                }}
                whileHover={{
                    rotate: 0,
                    scale: 1.04,
                    y: -10,
                    transition: { duration: CARD_HOVER_DURATION_S, ease: [0.23, 1, 0.32, 1] },
                }}
                whileTap={{ scale: 0.97 }}
            >
                {/* Parchment card body */}
                <div
                    style={{
                        width: cardW,
                        display: "flex",
                        flexDirection: "column",
                        background: "linear-gradient(148deg, #f6f2eb 0%, #ede8de 55%, #f1ece2 100%)",
                        borderRadius: 22,
                        border: "1px solid rgba(28,25,23,0.09)",
                        boxShadow: [
                            `${tilt > 0 ? 14 : -14}px 28px 72px rgba(28,25,23,0.2)`,
                            "inset 0 1px 0 rgba(255,255,255,0.65)",
                            "inset 0 -1px 0 rgba(28,25,23,0.04)",
                        ].join(", "),
                        overflow: "hidden",
                    }}
                >
                    {/* Screenshot with warm filter */}
                    <div style={{ position: "relative", overflow: "hidden", borderRadius: "20px 20px 0 0", flexShrink: 0 }}>
                        <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover select-none img-hover-transition"
                                draggable={false}
                                style={{
                                    filter: "saturate(0.65) sepia(0.18) brightness(0.96)",
                                }}
                                onMouseEnter={(e) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    img.style.filter = "saturate(0.88) sepia(0.06) brightness(1)";
                                    img.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    img.style.filter = "saturate(0.65) sepia(0.18) brightness(0.96)";
                                    img.style.transform = "scale(1)";
                                }}
                            />
                        </div>
                        {/* Gradient bleed into card body */}
                        <div style={{
                            position: "absolute", inset: 0, pointerEvents: "none",
                            background: "linear-gradient(to bottom, rgba(240,236,226,0) 45%, rgba(237,232,222,0.9) 100%)",
                        }} />
                    </div>

                    {/* Card content */}
                    <div style={{ padding: "22px 26px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                        {/* Accent dot + featured label */}
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                            <p style={{
                                fontFamily: '"DM Sans", system-ui, sans-serif',
                                fontSize: 9,
                                letterSpacing: "0.24em",
                                textTransform: "uppercase",
                                color: accent,
                            }}>
                                Featured
                            </p>
                            <div style={{ flex: 1, height: 1, background: `${accent}33` }} />
                        </div>

                        {/* Title */}
                        <h3 style={{
                            fontFamily: '"DM Serif Display", Georgia, serif',
                            fontSize: "1.35rem",
                            fontWeight: 400,
                            fontStyle: "italic",
                            lineHeight: 1.18,
                            letterSpacing: "-0.018em",
                            color: "#1C1917",
                            textTransform: "lowercase",
                            marginBottom: "0.8rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}>
                            {item.title}.
                        </h3>

                        {/* Teaser text */}
                        <p style={{
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                            fontSize: "12px",
                            lineHeight: 1.75,
                            color: "rgba(28,25,23,0.54)",
                            flex: "1 1 auto",
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            marginBottom: "1.1rem",
                        }}>
                            {cardTeaser}
                        </p>

                        {/* Footer: icons + cta */}
                        <div style={{ borderTop: "1px solid rgba(28,25,23,0.09)", paddingTop: "0.85rem" }}>
                            {item.icon_urls.length > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                                    {item.icon_urls.slice(0, 6).map((url, i) => (
                                        <img
                                            key={i} src={url} alt=""
                                            style={{ width: 15, height: 15, objectFit: "contain", opacity: 0.45 }}
                                            draggable={false}
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                        />
                                    ))}
                                </div>
                            )}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <p style={{
                                    fontFamily: '"DM Serif Display", Georgia, serif',
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                    color: "rgba(28,25,23,0.3)",
                                    letterSpacing: "0.04em",
                                    textDecoration: "underline",
                                    textUnderlineOffset: 4,
                                    textDecorationColor: "rgba(28,25,23,0.12)",
                                }}>
                                    view project.
                                </p>
                                {/* Corner arrow */}
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.22 }}>
                                    <path d="M3 11L11 3M11 3H5M11 3V9" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.button>
        </>
    );
}

// ── Carousel wrapper ──────────────────────────────────────────────────────────
export function ProjectShowcaseCarousel({ items }: { items: IPortfolioItem[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);
    const [cardW, setCardW] = useState(getCardW);

    useEffect(() => {
        const onResize = () => setCardW(getCardW());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 0);
        setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) checkScroll();
    }, [checkScroll]);

    const scrollBy = (delta: number) => {
        scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
    };

    if (items.length === 0) return null;

    return (
        <div style={{ position: "relative", width: "100%" }}>
            {/* Scrollable track — generous paddingBottom so card shadows aren't clipped */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="[scrollbar-width:none]"
                style={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 40,
                    paddingTop: 40,
                    paddingBottom: 52,
                    paddingLeft: "max(5vw, 32px)",
                    paddingRight: "max(5vw, 32px)",
                    maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
                }}
            >
                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        style={{ flexShrink: 0 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] } }}
                    >
                        <ProjectCard item={item} index={i} cardW={cardW} />
                    </motion.div>
                ))}
            </div>

            {/* Gradient fade — only covers the shadow area, not the card content */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 52,
                    background: "linear-gradient(to bottom, transparent 0%, #F7F5F0 100%)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* Arrows — float just above the gradient */}
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end", gap: 8, paddingRight: "max(5vw, 32px)", marginTop: -28 }}>
                <button
                    onClick={() => scrollBy(-(cardW + 36))}
                    disabled={!canLeft}
                    className="flex items-center justify-center cursor-pointer disabled:opacity-25 transition-opacity"
                    style={{
                        width: 38, height: 38,
                        background: "linear-gradient(148deg, #f6f2eb, #ede8de)",
                        color: "#57534E",
                        border: "1px solid rgba(28,25,23,0.12)",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(28,25,23,0.1)",
                    }}
                    aria-label="Scroll left"
                >
                    <ArrowLeft size={14} />
                </button>
                <button
                    onClick={() => scrollBy(cardW + 36)}
                    disabled={!canRight}
                    className="flex items-center justify-center cursor-pointer disabled:opacity-25 transition-opacity"
                    style={{
                        width: 38, height: 38,
                        background: "linear-gradient(148deg, #f6f2eb, #ede8de)",
                        color: "#57534E",
                        border: "1px solid rgba(28,25,23,0.12)",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(28,25,23,0.1)",
                    }}
                    aria-label="Scroll right"
                >
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Code2, ExternalLink } from "lucide-react";
import type { IPortfolioItem } from "../../api";
import { ProjectDetailPanel } from "./project-detail-panel";

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

// ── Short teaser from description ─────────────────────────────────────────────
function teaser(desc: string, max = 88): string {
    if (desc.length <= max) return desc;
    const dot = desc.indexOf(".");
    if (dot > 0 && dot <= max) return desc.slice(0, dot + 1);
    const cut = desc.slice(0, max);
    return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

// ── Split the leading action word off featured_text so it can be emphasized ────
function splitFirstWord(text: string): { firstWord: string; rest: string } {
    const trimmed = text.trim();
    const spaceIndex = trimmed.indexOf(" ");
    if (spaceIndex === -1) return { firstWord: trimmed, rest: "" };
    return { firstWord: trimmed.slice(0, spaceIndex), rest: trimmed.slice(spaceIndex) };
}

// ── Individual parchment card ─────────────────────────────────────────────────
function ProjectCard({ item, index, cardW }: { item: IPortfolioItem; index: number; cardW: number }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const tilt = TILTS[index % TILTS.length];
    const handleClose = useCallback(() => setIsExpanded(false), []);
    const cardTeaser = teaser(item.description);
    const featuredWords = item.featured_text ? splitFirstWord(item.featured_text) : null;

    return (
        <>
            {createPortal(
                <AnimatePresence>
                    {isExpanded && <ProjectDetailPanel item={item} onClose={handleClose} />}
                </AnimatePresence>,
                document.body
            )}

            <motion.div
                role="button"
                tabIndex={0}
                onClick={() => setIsExpanded(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsExpanded(true);
                    }
                }}
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
                        {item.featured_text ? (
                            /* Featured text takes over the title + description spot entirely */
                            <div style={{
                                flex: "1 1 auto",
                                marginBottom: "1.1rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                            }}>
                                <p style={{
                                    fontFamily: '"DM Sans", system-ui, sans-serif',
                                    fontSize: "1.85rem",
                                    fontWeight: 500,
                                    lineHeight: 1.22,
                                    letterSpacing: "-0.02em",
                                    color: "#1C1917",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}>
                                    <span style={{
                                        fontSize: "1.5em",
                                        fontWeight: 700,
                                        color: "#8C7355",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.01em",
                                    }}>
                                        {featuredWords!.firstWord}
                                    </span>
                                    {featuredWords!.rest}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Title */}
                                <h3 style={{
                                    fontFamily: '"DM Serif Display", Georgia, serif',
                                    fontSize: "1.35rem",
                                    fontWeight: 400,
                                    lineHeight: 1.18,
                                    letterSpacing: "-0.018em",
                                    color: "#1C1917",
                                    marginBottom: "0.8rem",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}>
                                    {item.title}
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
                            </>
                        )}

                        {/* Footer: icons + cta */}
                        <div style={{ borderTop: "1px solid rgba(28,25,23,0.09)", paddingTop: "0.85rem" }}>
                            {!item.featured_text && item.icon_urls.length > 0 && (
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
                            {!item.featured_text && (item.project_url || item.github_url) && (
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                                    {item.project_url && (
                                        <a
                                            href={item.project_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="project-link-icon-btn flex items-center justify-center"
                                            style={{
                                                width: 24, height: 24, borderRadius: "50%",
                                                background: "rgba(28,25,23,0.04)",
                                                border: "1px solid rgba(28,25,23,0.12)",
                                                color: "#57534E",
                                            }}
                                            aria-label="View live project"
                                            title="View live project"
                                        >
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                    {item.github_url && (
                                        <a
                                            href={item.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="project-link-icon-btn flex items-center justify-center"
                                            style={{
                                                width: 24, height: 24, borderRadius: "50%",
                                                background: "rgba(28,25,23,0.04)",
                                                border: "1px solid rgba(28,25,23,0.12)",
                                                color: "#57534E",
                                            }}
                                            aria-label="View source on GitHub"
                                            title="View source on GitHub"
                                        >
                                            <Code2 size={12} />
                                        </a>
                                    )}
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
            </motion.div>
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

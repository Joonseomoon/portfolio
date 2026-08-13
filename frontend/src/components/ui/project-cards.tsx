"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Code2 } from "lucide-react";
import type { IPortfolioItem } from "../../api";
import { ProjectDetailPanel } from "./project-detail-panel";

// ── Timing constants ──────────────────────────────────────────────────────────
const IMG_HOVER_DURATION_S = 0.45;
const CARD_SPRING = { type: 'spring' as const, stiffness: 400, damping: 28 };

// ── Warm monochrome tokens ────────────────────────────────────────────────────
const COLOR = {
    card:        'rgba(28,25,23,0.03)',
    cardHover:   'rgba(28,25,23,0.06)',
    border:      'rgba(28,25,23,0.09)',
    borderHover: 'rgba(28,25,23,0.2)',
    text:        '#1C1917',
    muted:       '#78716C',
};

interface ProjectCardsProps {
    items: IPortfolioItem[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};

const cardVariants = {
    hidden:  { opacity: 0, transform: 'translateY(24px) scale(0.97)', filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        transform: 'translateY(0px) scale(1)',
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 280, damping: 26, mass: 0.8 },
    },
};

export function ProjectCards({ items }: ProjectCardsProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IPortfolioItem | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const shouldAnimate = !shouldReduceMotion;

    useEffect(() => {
        const t = setTimeout(() => setIsLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    if (items.length === 0) return null;

    return (
        <>
            <motion.div
                className="grid grid-cols-1 gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
                initial={shouldAnimate ? 'hidden' : 'visible'}
                animate={isLoaded ? 'visible' : 'hidden'}
                variants={shouldAnimate ? containerVariants : {}}
            >
                {items.map((item) => {
                    return (
                        <motion.article
                            key={item.id}
                            className="flex flex-col overflow-hidden cursor-pointer"
                            style={{
                                background: COLOR.card,
                                border: `1px solid ${COLOR.border}`,
                            }}
                            variants={shouldAnimate ? cardVariants : {}}
                            whileHover={shouldAnimate ? {
                                y: -3,
                                backgroundColor: COLOR.cardHover,
                                borderColor: COLOR.borderHover,
                                transition: CARD_SPRING,
                            } : {}}
                            onClick={() => setSelectedItem(item)}
                        >
                            {/* Thumbnail */}
                            <div
                                className="relative overflow-hidden"
                                style={{ aspectRatio: '16/9' }}
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover select-none"
                                    draggable={false}
                                    style={{ transition: `transform ${IMG_HOVER_DURATION_S}s ease` }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                                />
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{ background: 'linear-gradient(to top, rgba(28,25,23,0.16) 0%, transparent 55%)' }}
                                />
                                {item.featured && (
                                    <div
                                        className="absolute top-2.5 left-2.5 text-[9px] tracking-[0.18em] uppercase px-2 py-0.5"
                                        style={{
                                            background: 'rgba(247,245,240,0.92)',
                                            color: '#57534E',
                                            backdropFilter: 'blur(6px)',
                                        }}
                                    >
                                        Featured
                                    </div>
                                )}

                                {(item.project_url || item.github_url) && (
                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                                        {item.project_url && (
                                            <a
                                                href={item.project_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="project-link-icon-btn flex items-center justify-center"
                                                style={{
                                                    width: 26, height: 26, borderRadius: '50%',
                                                    background: 'rgba(247,245,240,0.92)',
                                                    border: '1px solid rgba(28,25,23,0.14)',
                                                    color: '#57534E',
                                                    backdropFilter: 'blur(6px)',
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
                                                    width: 26, height: 26, borderRadius: '50%',
                                                    background: 'rgba(247,245,240,0.92)',
                                                    border: '1px solid rgba(28,25,23,0.14)',
                                                    color: '#57534E',
                                                    backdropFilter: 'blur(6px)',
                                                }}
                                                aria-label="View source on GitHub"
                                                title="View source on GitHub"
                                            >
                                                <Code2 size={12} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-4 flex flex-col flex-1">
                                <h3
                                    className="text-sm font-semibold leading-snug mb-1.5"
                                    style={{
                                        fontFamily: '"DM Serif Display", Georgia, serif',
                                        fontSize: '1rem',
                                        color: COLOR.text,
                                    }}
                                >
                                    {item.title}
                                </h3>

                                <p
                                    className="text-xs leading-relaxed flex-1"
                                    style={{
                                        color: COLOR.muted,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {item.description}
                                </p>

                                {item.icon_urls.length > 0 && (
                                    <div
                                        className="flex items-center gap-1.5 flex-wrap mt-3 pt-3"
                                        style={{ borderTop: `1px solid ${COLOR.border}` }}
                                    >
                                        {item.icon_urls.map((url, i) => (
                                            <img
                                                key={i} src={url} alt="" draggable={false}
                                                className="w-4 h-4 object-contain"
                                                style={{ opacity: 0.55 }}
                                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.article>
                    );
                })}
            </motion.div>

            {createPortal(
                <AnimatePresence>
                    {selectedItem && (
                        <ProjectDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

"use client";

import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { IPortfolioItem } from "../../api";

// ── Timing constants ──────────────────────────────────────────────────────────
const STRONG_EASE_OUT = [0.23, 1, 0.32, 1] as const;

// ── Warm monochrome tokens ────────────────────────────────────────────────────
const COLOR = {
    bg:          '#F7F5F0',
    card:        'rgba(28,25,23,0.03)',
    cardHover:   'rgba(28,25,23,0.06)',
    border:      'rgba(28,25,23,0.09)',
    borderHover: 'rgba(28,25,23,0.2)',
    text:        '#1C1917',
    muted:       '#78716C',
    label:       '#A8A29E',
    backdrop:    'rgba(247,245,240,0.88)',
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

    // Lock body scroll (same approach as featured carousel) + Escape to close
    useEffect(() => {
        if (!selectedItem) return;
        const scrollY = window.scrollY;
        document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%;overflow:hidden`;
        document.body.dataset.scrollY = String(scrollY);
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedItem(null); };
        window.addEventListener('keydown', handler);
        return () => {
            const sy = parseInt(document.body.dataset.scrollY ?? '0', 10);
            document.body.style.cssText = '';
            window.scrollTo({ top: sy, behavior: 'instant' as ScrollBehavior });
            window.removeEventListener('keydown', handler);
        };
    }, [selectedItem]);

    if (items.length === 0) return null;

    return (
        <LayoutGroup>
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
                                transition: { type: 'spring', stiffness: 400, damping: 28 },
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
                                    style={{ transition: 'transform 0.55s ease' }}
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

            {/* ── Expanded modal — portaled to body, matches featured carousel style ── */}
            {createPortal(
            <AnimatePresence>
                {selectedItem && (
                    <div
                        className="fixed inset-0 z-50 overflow-y-auto"
                        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 1.5rem 2rem' }}
                    >
                        {/* Backdrop — covers navbar */}
                        <motion.div
                            className="absolute inset-0"
                            style={{ background: COLOR.backdrop, backdropFilter: 'blur(12px)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                        />

                        {/* Content-sized panel */}
                        <motion.div
                            className="relative z-10 w-full overflow-hidden"
                            style={{
                                maxWidth: 760,
                                background: COLOR.bg,
                                borderRadius: 20,
                                border: '1px solid rgba(28,25,23,0.12)',
                                boxShadow: '0 40px 100px rgba(28,25,23,0.18), 0 8px 24px rgba(28,25,23,0.1)',
                            }}
                            initial={{ opacity: 0, scale: 0.92, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.38, ease: STRONG_EASE_OUT } }}
                            exit={{ opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.22, ease: 'easeIn' } }}
                        >
                            {/* Close */}
                            <motion.button
                                className="absolute top-4 right-4 z-20 flex items-center justify-center cursor-pointer"
                                style={{
                                    width: 34, height: 34,
                                    background: 'rgba(247,245,240,0.95)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(28,25,23,0.18)',
                                    color: COLOR.text,
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 8px rgba(28,25,23,0.14)',
                                }}
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1, transition: { delay: 0.18 } }}
                                whileHover={{ backgroundColor: 'rgba(237,232,222,0.98)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedItem(null)}
                                aria-label="Close"
                            >
                                <X size={14} />
                            </motion.button>

                            <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                                {/* Hero image */}
                                <div
                                    className="relative w-full overflow-hidden"
                                    style={{ aspectRatio: '16/9', borderRadius: '20px 20px 0 0' }}
                                >
                                    <img
                                        src={selectedItem.image_url}
                                        alt={selectedItem.title}
                                        className="w-full h-full object-cover select-none"
                                        draggable={false}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-7 sm:p-9">
                                    <motion.h2
                                        className="mb-4"
                                        style={{
                                            fontFamily: '"DM Serif Display", Georgia, serif',
                                            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                                            fontWeight: 400,
                                            fontStyle: 'italic',
                                            lineHeight: 1.1,
                                            letterSpacing: '-0.02em',
                                            color: COLOR.text,
                                            textTransform: 'lowercase',
                                        }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.36, ease: STRONG_EASE_OUT } }}
                                    >
                                        {selectedItem.title}.
                                    </motion.h2>

                                    <motion.p
                                        className="text-sm leading-[1.8] mb-6"
                                        style={{ color: COLOR.muted, maxWidth: '60ch', fontFamily: '"DM Sans", system-ui, sans-serif' }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.24, duration: 0.36, ease: STRONG_EASE_OUT } }}
                                    >
                                        {selectedItem.description}
                                    </motion.p>

                                    {selectedItem.icon_urls.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0, transition: { delay: 0.32, duration: 0.32, ease: STRONG_EASE_OUT } }}
                                        >
                                            <p style={{
                                                fontFamily: '"DM Sans", system-ui, sans-serif',
                                                fontSize: 9,
                                                letterSpacing: '0.24em',
                                                textTransform: 'uppercase',
                                                color: COLOR.label,
                                                marginBottom: 10,
                                            }}>
                                                Stack
                                            </p>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {selectedItem.icon_urls.map((url, i) => (
                                                    <img
                                                        key={i} src={url} alt="" draggable={false}
                                                        className="w-6 h-6 object-contain"
                                                        style={{ opacity: 0.7 }}
                                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>,
            document.body
            )}
        </LayoutGroup>
    );
}

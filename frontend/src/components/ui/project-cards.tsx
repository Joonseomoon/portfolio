"use client";

import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
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

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = selectedItem ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
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
                    if (selectedItem?.id === item.id) return null;
                    return (
                        <motion.article
                            key={item.id}
                            layoutId={`card-${item.id}`}
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
                            <motion.div
                                layoutId={`card-image-${item.id}`}
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
                            </motion.div>

                            {/* Body */}
                            <motion.div layoutId={`card-body-${item.id}`} className="p-4 flex flex-col flex-1">
                                <motion.h3
                                    layoutId={`card-title-${item.id}`}
                                    className="text-sm font-semibold leading-snug mb-1.5"
                                    style={{
                                        fontFamily: '"DM Serif Display", Georgia, serif',
                                        fontSize: '1rem',
                                        color: COLOR.text,
                                    }}
                                >
                                    {item.title}
                                </motion.h3>

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
                            </motion.div>
                        </motion.article>
                    );
                })}
            </motion.div>

            {/* ── Expanded modal ── */}
            <AnimatePresence>
                {selectedItem && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40"
                            style={{ background: COLOR.backdrop, backdropFilter: 'blur(6px)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                        />

                        {/* Expanded card */}
                        <motion.div
                            layoutId={`card-${selectedItem.id}`}
                            className="fixed z-50 overflow-hidden"
                            style={{
                                inset: '2rem',
                                maxWidth: '860px',
                                margin: 'auto',
                                background: COLOR.bg,
                                border: `1px solid rgba(28,25,23,0.14)`,
                                boxShadow: '0 24px 80px rgba(28,25,23,0.14)',
                            }}
                        >
                            {/* Close */}
                            <motion.button
                                className="absolute top-3 right-3 z-10 flex items-center justify-center cursor-pointer"
                                style={{
                                    width: 32, height: 32,
                                    background: 'rgba(247,245,240,0.9)',
                                    border: `1px solid rgba(28,25,23,0.12)`,
                                    color: COLOR.muted,
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { delay: 0.18 } }}
                                whileHover={{ backgroundColor: COLOR.card, color: COLOR.text }}
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setSelectedItem(null)}
                                aria-label="Close"
                            >
                                <X size={14} />
                            </motion.button>

                            <div className="h-full overflow-y-auto">
                                {/* Hero image */}
                                <motion.div
                                    layoutId={`card-image-${selectedItem.id}`}
                                    className="relative w-full overflow-hidden"
                                    style={{ aspectRatio: '16/9' }}
                                >
                                    <img
                                        src={selectedItem.image_url}
                                        alt={selectedItem.title}
                                        className="w-full h-full object-cover select-none"
                                        draggable={false}
                                    />
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ background: 'linear-gradient(to top, rgba(247,245,240,0.5) 0%, transparent 40%)' }}
                                    />
                                </motion.div>

                                {/* Content */}
                                <motion.div layoutId={`card-body-${selectedItem.id}`} className="p-6 sm:p-8">
                                    <motion.h2
                                        layoutId={`card-title-${selectedItem.id}`}
                                        className="mb-4"
                                        style={{
                                            fontFamily: '"DM Serif Display", Georgia, serif',
                                            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                                            fontWeight: 400,
                                            lineHeight: 1.1,
                                            letterSpacing: '-0.02em',
                                            color: COLOR.text,
                                        }}
                                    >
                                        {selectedItem.title}
                                    </motion.h2>

                                    <motion.p
                                        className="text-sm leading-[1.8] mb-6"
                                        style={{ color: COLOR.muted, maxWidth: '68ch' }}
                                        initial={{ opacity: 0, transform: 'translateY(12px)' }}
                                        animate={{ opacity: 1, transform: 'translateY(0px)', transition: { delay: 0.22, duration: 0.38, ease: STRONG_EASE_OUT } }}
                                    >
                                        {selectedItem.description}
                                    </motion.p>

                                    {selectedItem.icon_urls.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, transform: 'translateY(8px)' }}
                                            animate={{ opacity: 1, transform: 'translateY(0px)', transition: { delay: 0.3, duration: 0.36, ease: STRONG_EASE_OUT } }}
                                        >
                                            <p
                                                className="text-[10px] tracking-[0.22em] uppercase mb-3"
                                                style={{ color: COLOR.label }}
                                            >
                                                Tech Stack
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
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </LayoutGroup>
    );
}

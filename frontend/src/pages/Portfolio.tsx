import { useEffect, useState } from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { fetchPortfolioItems, type IPortfolioItem } from '../api';
import ElegantCarousel from '../components/ui/elegant-carousel';
import { ProjectCards } from '../components/ui/project-cards';

// ── Timing ───────────────────────────────────────────────────────────────────
const STRONG_EASE_OUT    = [0.23, 1, 0.32, 1] as const;
const ITEM_DURATION_S    = 0.42;
const STAGGER_CHILDREN_S = 0.06;

// ── Scroll-reveal ─────────────────────────────────────────────────────────────
const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER_CHILDREN_S, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
    hidden:  { opacity: 0, transform: 'translateY(16px)' },
    visible: { opacity: 1, transform: 'translateY(0px)', transition: { duration: ITEM_DURATION_S, ease: STRONG_EASE_OUT } },
};

function FadeUp({ children, delay = 0, className }: {
    children: React.ReactNode; delay?: number; className?: string;
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, transform: 'translateY(14px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)', transition: { duration: ITEM_DURATION_S, ease: STRONG_EASE_OUT, delay } }}
            viewport={{ once: true, margin: '-50px' }}
        >
            {children}
        </motion.div>
    );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase flex-shrink-0" style={{ color: '#A8A29E' }}>
                {label}
            </p>
            <div className="flex-1 h-px" style={{ background: 'rgba(28,25,23,0.1)' }} />
        </div>
    );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────
function SkeletonCarousel() {
    return (
        <div
            style={{
                height: '420px',
                background: 'rgba(28,25,23,0.03)',
                border: '1px solid rgba(28,25,23,0.08)',
                animation: 'pulse 1.5s ease-in-out infinite',
            }}
        />
    );
}

function SkeletonCard() {
    return (
        <div style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.07)' }}>
            <div style={{ aspectRatio: '16/9', background: 'rgba(28,25,23,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div className="p-4 space-y-2">
                <div className="h-3.5 w-2/3 rounded-sm" style={{ background: 'rgba(28,25,23,0.08)', animation: 'pulse 1.5s ease-in-out 0.1s infinite' }} />
                <div className="h-2.5 w-full rounded-sm" style={{ background: 'rgba(28,25,23,0.05)', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
                <div className="h-2.5 w-4/5 rounded-sm" style={{ background: 'rgba(28,25,23,0.05)', animation: 'pulse 1.5s ease-in-out 0.3s infinite' }} />
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
    const [items, setItems] = useState<IPortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPortfolioItems()
            .then(setItems)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const featured = items.filter((i) => i.featured);
    const all      = items;

    return (
        <MotionConfig reducedMotion="user">
            <div
                className="flex-1 overflow-y-auto relative"
                style={{ background: '#F7F5F0', fontFamily: '"DM Sans", system-ui, sans-serif' }}
            >
                {/* Grain overlay */}
                <div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '160px',
                        opacity: 0.025,
                        mixBlendMode: 'multiply',
                    }}
                />

                <div className="relative z-10 mx-auto max-w-5xl px-8 sm:px-14 py-14">

                    {/* ── Header ──────────────────────────────────────────── */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-12"
                    >
                        <motion.p
                            variants={itemVariants}
                            className="text-xs font-medium tracking-[0.4em] uppercase mb-4"
                            style={{ color: '#A8A29E' }}
                        >
                            My Work
                        </motion.p>
                        <motion.h1
                            variants={itemVariants}
                            style={{
                                fontFamily: '"DM Serif Display", Georgia, serif',
                                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                                fontWeight: 400,
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                color: '#1C1917',
                                marginBottom: '1rem',
                            }}
                        >
                            Portfolio
                        </motion.h1>
                        <motion.div variants={itemVariants} className="h-px w-10" style={{ background: 'rgba(28,25,23,0.2)' }} />
                    </motion.div>

                    {error && (
                        <p className="text-sm mb-8" style={{ color: '#A8A29E' }}>
                            Could not load projects — {error}
                        </p>
                    )}

                    {/* ── Featured carousel ────────────────────────────────── */}
                    {(loading || featured.length > 0) && (
                        <FadeUp className="mb-16">
                            <SectionLabel label="Featured" />
                            {loading ? <SkeletonCarousel /> : <ElegantCarousel items={featured} />}
                        </FadeUp>
                    )}

                    {/* ── All projects ─────────────────────────────────────── */}
                    <div>
                        <FadeUp>
                            <SectionLabel label="All Projects" />
                        </FadeUp>

                        {loading && (
                            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                                {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
                            </div>
                        )}

                        {!loading && !error && <ProjectCards items={all} />}

                        {!loading && !error && all.length === 0 && (
                            <p className="text-sm mt-6" style={{ color: '#A8A29E' }}>No projects yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </MotionConfig>
    );
}

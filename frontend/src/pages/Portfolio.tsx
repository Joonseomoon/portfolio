import { useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { fetchPortfolioItems, type IPortfolioItem } from '../api';
import { ProjectShowcaseCarousel } from '../components/ui/project-showcase-carousel';
import { ProjectCards } from '../components/ui/project-cards';

// ── Timing ───────────────────────────────────────────────────────────────────
const STRONG_EASE_OUT    = [0.23, 1, 0.32, 1] as const;
const ITEM_DURATION_S    = 0.45;
const STAGGER_CHILDREN_S = 0.07;

// ── Entrance variants ─────────────────────────────────────────────────────────
const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER_CHILDREN_S, delayChildren: 0.05 } },
};
const itemVariants: Variants = {
    hidden:  { opacity: 0, transform: 'translateY(18px)' },
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
            viewport={{ once: true, margin: '-40px' }}
        >
            {children}
        </motion.div>
    );
}

// ── Editorial section marker ──────────────────────────────────────────────────
function SectionMarker({
    index,
    label,
    hint,
}: {
    index: string;
    label: string;
    hint?: string;
}) {
    return (
        <div className="flex items-center gap-0 w-full">
            {/* Index tab */}
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '5px 14px 5px 0',
                    borderRight: '1px solid rgba(28,25,23,0.14)',
                    marginRight: 16,
                    flexShrink: 0,
                }}
            >
                <span style={{
                    fontFamily: '"DM Serif Display", Georgia, serif',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    color: '#A8A29E',
                    letterSpacing: '0.05em',
                }}>
                    {index}
                </span>
                <span style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#57534E',
                    fontWeight: 500,
                }}>
                    {label}
                </span>
            </div>

            {/* Dot-dash rule */}
            <div style={{ flex: 1, position: 'relative', height: 1 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,25,23,0.08)' }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(to right, rgba(28,25,23,0.18) 0px, rgba(28,25,23,0.18) 3px, transparent 3px, transparent 10px)',
                }} />
            </div>

            {hint && (
                <span style={{
                    marginLeft: 14,
                    fontFamily: '"DM Serif Display", Georgia, serif',
                    fontSize: '10px',
                    fontStyle: 'italic',
                    color: '#A8A29E',
                    letterSpacing: '0.06em',
                    flexShrink: 0,
                }}>
                    {hint}
                </span>
            )}
        </div>
    );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────
function SkeletonCarousel() {
    return (
        <div className="flex gap-8 overflow-hidden" style={{
            paddingLeft: 'max(5vw, 32px)', paddingRight: 'max(5vw, 32px)',
            paddingTop: 48, paddingBottom: 64,
        }}>
            {Array.from({ length: 4 }, (_, i) => (
                <div key={i} style={{
                    width: 380, flexShrink: 0, borderRadius: 22,
                    background: 'rgba(28,25,23,0.04)',
                    border: '1px solid rgba(28,25,23,0.08)',
                    animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
                    height: 510,
                }} />
            ))}
        </div>
    );
}

function SkeletonCard() {
    return (
        <div style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.07)' }}>
            <div style={{ aspectRatio: '16/9', background: 'rgba(28,25,23,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div className="p-4 space-y-2">
                <div className="h-3.5 w-2/3" style={{ background: 'rgba(28,25,23,0.08)', animation: 'pulse 1.5s ease-in-out 0.1s infinite' }} />
                <div className="h-2.5 w-full" style={{ background: 'rgba(28,25,23,0.05)', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
                <div className="h-2.5 w-4/5" style={{ background: 'rgba(28,25,23,0.05)', animation: 'pulse 1.5s ease-in-out 0.3s infinite' }} />
            </div>
        </div>
    );
}

// ── Scroll indicator ──────────────────────────────────────────────────────────
function ScrollHint() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const scroller = el.closest('[data-scroll-track]') as HTMLElement | null;
        if (!scroller) return;
        const handler = () => setVisible(scroller.scrollLeft < 20);
        scroller.addEventListener('scroll', handler, { passive: true });
        return () => scroller.removeEventListener('scroll', handler);
    }, []);

    return (
        <motion.div
            ref={ref}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <span style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: '#A8A29E',
                textTransform: 'uppercase',
            }}>
                scroll
            </span>
            <motion.div
                style={{ display: 'flex', gap: 2 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
                {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                        width: 3, height: 3, borderRadius: '50%',
                        background: '#A8A29E',
                        opacity: 1 - i * 0.3,
                    }} />
                ))}
            </motion.div>
        </motion.div>
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

                <div className="relative z-10">

                    {/* ── Editorial header ─────────────────────────────── */}
                    <div className="mx-auto px-8 sm:px-16 pt-12" style={{ maxWidth: 1280 }}>
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <motion.h1
                                variants={itemVariants}
                                style={{
                                    fontFamily: '"DM Serif Display", Georgia, serif',
                                    fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                                    fontWeight: 400,
                                    fontStyle: 'italic',
                                    lineHeight: 0.94,
                                    letterSpacing: '-0.03em',
                                    color: '#1C1917',
                                    marginBottom: '1.1rem',
                                }}
                            >
                                projects built with purpose.
                            </motion.h1>

                            {/* Full-width rule */}
                            <motion.div
                                variants={itemVariants}
                                style={{
                                    height: 1,
                                    background: 'linear-gradient(to right, rgba(28,25,23,0.22) 0%, rgba(28,25,23,0.08) 60%, transparent 100%)',
                                }}
                            />
                        </motion.div>
                    </div>

                    {error && (
                        <div className="mx-auto px-8 sm:px-16 mt-4" style={{ maxWidth: 1280 }}>
                            <p className="text-sm" style={{ color: '#A8A29E' }}>Could not load projects — {error}</p>
                        </div>
                    )}

                    {/* ── Featured — full width hero ────────────────────── */}
                    {(loading || featured.length > 0) && (
                        <FadeUp>
                            {/* Section marker */}
                            <div className="mx-auto px-8 sm:px-16 mt-10 mb-0" style={{ maxWidth: 1280 }}>
                                <SectionMarker
                                    index="01."
                                    label="Featured"
                                    hint={featured.length > 0 ? `${featured.length} projects` : undefined}
                                />
                            </div>

                            {loading
                                ? <SkeletonCarousel />
                                : <ProjectShowcaseCarousel items={featured} />
                            }
                        </FadeUp>
                    )}

                    {/* ── All projects ──────────────────────────────────── */}
                    <div className="mx-auto px-8 sm:px-16 pb-20 mt-2" style={{ maxWidth: 1280 }}>
                        <FadeUp>
                            <SectionMarker index="02." label="All Projects" />
                        </FadeUp>

                        <div className="mt-6">
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
            </div>
        </MotionConfig>
    );
}

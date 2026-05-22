import { useEffect, useState } from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { fetchExperiences, type IExperience } from '../api';

// ── Layout constants ─────────────────────────────────────────────────────────
const META_W         = 180;
const CONNECTOR_W    = 28;
const DOT_SIZE_PX    = 8;
const CARD_RADIUS_PX = 14;
const LINE_LEFT_PX   = META_W + CONNECTOR_W / 2;

// ── Animation constants ───────────────────────────────────────────────────────
const STRONG_EASE_OUT    = [0.23, 1, 0.32, 1] as const;
const ITEM_DURATION_S    = 0.45;
const STAGGER_CHILDREN_S = 0.07;
const HEADER_DELAY_S     = 0.05;
const REVEAL_Y_PX        = 20;
const ENTRY_STAGGER_S    = 0.04;
const LINK_TRANSITION_S  = 0.18;

// ── Warm monochrome tokens ────────────────────────────────────────────────────
const COLOR = {
    bg:       '#F7F5F0',
    text:     '#1C1917',
    secondary:'#57534E',
    muted:    '#78716C',
    label:    '#A8A29E',
    border:   'rgba(28,25,23,0.09)',
    cardBg:   'rgba(28,25,23,0.025)',
    dot:      'rgba(28,25,23,0.22)',
};

// ── Entrance variants ─────────────────────────────────────────────────────────
const containerVariants: Variants = {
    hidden:  {},
    visible: { transition: { staggerChildren: STAGGER_CHILDREN_S, delayChildren: HEADER_DELAY_S } },
};
const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: ITEM_DURATION_S, ease: STRONG_EASE_OUT } },
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonRow({ delay = 0 }: { delay?: number }) {
    return (
        <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
            <div className="hidden md:flex" style={{ width: META_W, flexShrink: 0, paddingTop: 20, flexDirection: 'column', gap: 8, alignItems: 'flex-end', paddingRight: 20 }}>
                <div style={{ height: 9, width: '55%', background: 'rgba(28,25,23,0.06)', borderRadius: 3, animation: `pulse 1.5s ease-in-out ${delay}s infinite` }} />
                <div style={{ height: 13, width: '80%', background: 'rgba(28,25,23,0.08)', borderRadius: 3, animation: `pulse 1.5s ease-in-out ${delay + 0.1}s infinite` }} />
            </div>
            <div className="hidden md:flex" style={{ flexShrink: 0, width: CONNECTOR_W, flexDirection: 'column', alignItems: 'center', paddingTop: 24 }}>
                <div style={{ width: DOT_SIZE_PX, height: DOT_SIZE_PX, borderRadius: '50%', background: 'rgba(28,25,23,0.1)', border: '1px solid rgba(28,25,23,0.12)' }} />
            </div>
            <div style={{ flex: 1, background: COLOR.cardBg, border: `1px solid ${COLOR.border}`, borderRadius: CARD_RADIUS_PX, padding: '18px 22px' }}>
                <div style={{ height: 14, width: '42%', background: 'rgba(28,25,23,0.07)', borderRadius: 3, marginBottom: 8, animation: `pulse 1.5s ease-in-out ${delay + 0.15}s infinite` }} />
                <div style={{ height: 10, width: '85%', background: 'rgba(28,25,23,0.05)', borderRadius: 3, marginBottom: 5, animation: `pulse 1.5s ease-in-out ${delay + 0.25}s infinite` }} />
                <div style={{ height: 10, width: '65%', background: 'rgba(28,25,23,0.05)', borderRadius: 3, animation: `pulse 1.5s ease-in-out ${delay + 0.35}s infinite` }} />
            </div>
        </div>
    );
}

// ── Individual experience entry ───────────────────────────────────────────────
function ExperienceEntry({ experience }: { experience: IExperience }) {
    return (
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
            {/* Left meta — sticky, right-aligned */}
            <div
                className="hidden md:block"
                style={{
                    width: META_W, flexShrink: 0, paddingTop: 20,
                    textAlign: 'right', paddingRight: 20,
                    position: 'sticky', top: '4rem', alignSelf: 'flex-start',
                }}
            >
                <p style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
                    color: COLOR.label, marginBottom: 5,
                }}>
                    {experience.timeframe}
                </p>
                {experience.company_url ? (
                    <a
                        href={experience.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontFamily: '"DM Serif Display", Georgia, serif',
                            fontSize: '0.9rem', fontStyle: 'italic',
                            color: COLOR.text, textDecoration: 'none',
                            display: 'inline-flex', alignItems: 'center',
                            justifyContent: 'flex-end', gap: 4,
                        }}
                    >
                        {experience.company_name}
                        <ExternalLink size={9} style={{ opacity: 0.45, flexShrink: 0 }} />
                    </a>
                ) : (
                    <p style={{
                        fontFamily: '"DM Serif Display", Georgia, serif',
                        fontSize: '0.9rem', fontStyle: 'italic', color: COLOR.text,
                    }}>
                        {experience.company_name}
                    </p>
                )}
            </div>

            {/* Connector dot */}
            <div className="hidden md:flex" style={{ flexShrink: 0, width: CONNECTOR_W, flexDirection: 'column', alignItems: 'center', paddingTop: 26 }}>
                <div style={{
                    width: DOT_SIZE_PX, height: DOT_SIZE_PX, borderRadius: '50%',
                    background: COLOR.dot,
                    border: '1.5px solid rgba(28,25,23,0.2)',
                }} />
            </div>

            {/* Content card */}
            <article style={{
                flex: 1, borderRadius: CARD_RADIUS_PX,
                border: `1px solid ${COLOR.border}`,
                background: COLOR.cardBg,
                padding: '20px 24px',
            }}>
                {/* Mobile meta */}
                <div className="flex items-center gap-1.5 mb-2 md:hidden">
                    <span style={{ fontFamily: '"DM Sans"', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLOR.label }}>
                        {experience.timeframe}
                    </span>
                    <span style={{ color: COLOR.label, fontSize: 9 }}>·</span>
                    <span style={{ fontFamily: '"DM Serif Display"', fontSize: '0.85rem', fontStyle: 'italic', color: COLOR.muted }}>
                        {experience.company_name}
                    </span>
                </div>

                {/* Role title */}
                <h2 style={{
                    fontFamily: '"DM Serif Display", Georgia, serif',
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 400,
                    fontStyle: 'italic', lineHeight: 1.2, letterSpacing: '-0.012em',
                    color: COLOR.text, marginBottom: 3,
                }}>
                    {experience.title}
                </h2>

                {/* Location */}
                {experience.location && (
                    <p style={{
                        fontFamily: '"DM Sans", system-ui, sans-serif',
                        fontSize: 10, letterSpacing: '0.12em', color: COLOR.label,
                        marginBottom: 14,
                    }}>
                        {experience.location}
                    </p>
                )}

                {/* All bullets */}
                {experience.description.length > 0 && (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {experience.description.map((line, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                <div style={{
                                    width: 4, height: 4, borderRadius: '50%', marginTop: 9, flexShrink: 0,
                                    background: 'rgba(28,25,23,0.2)',
                                }} />
                                <span style={{
                                    fontFamily: '"DM Sans", system-ui, sans-serif',
                                    fontSize: '0.8rem', lineHeight: 1.75, color: COLOR.muted,
                                }}>
                                    {line}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Company link */}
                {experience.company_url && (
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                        <a
                            href={experience.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="exp-company-link"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                fontFamily: '"DM Sans", system-ui, sans-serif',
                                fontSize: 11, letterSpacing: '0.04em',
                                color: COLOR.secondary, textDecoration: 'none',
                                border: '1px solid rgba(28,25,23,0.14)',
                                borderRadius: 8, padding: '5px 12px',
                            }}
                        >
                            Visit company
                            <ExternalLink size={10} style={{ opacity: 0.6 }} />
                        </a>
                    </div>
                )}
            </article>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Experience() {
    const [experiences, setExperiences] = useState<IExperience[]>([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState<string | null>(null);

    useEffect(() => {
        fetchExperiences()
            .then(setExperiences)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <div
                className="flex-1 overflow-y-auto relative"
                style={{ background: COLOR.bg, fontFamily: '"DM Sans", system-ui, sans-serif' }}
            >
                {/* Grain overlay */}
                <div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat', backgroundSize: '160px',
                        opacity: 0.025, mixBlendMode: 'multiply',
                    }}
                />

                <div className="relative z-10 mx-auto px-8 sm:px-16 pt-12 pb-28" style={{ maxWidth: 1020 }}>

                    {/* ── Editorial header ───────────────────────────── */}
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1
                            variants={itemVariants}
                            style={{
                                fontFamily: '"DM Serif Display", Georgia, serif',
                                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                                fontWeight: 400, fontStyle: 'italic',
                                lineHeight: 0.94, letterSpacing: '-0.03em',
                                color: COLOR.text, marginBottom: '1.1rem',
                            }}
                        >
                            Experience.
                        </motion.h1>
                        <motion.div
                            variants={itemVariants}
                            style={{
                                height: 1,
                                background: 'linear-gradient(to right, rgba(28,25,23,0.22) 0%, rgba(28,25,23,0.08) 60%, transparent 100%)',
                            }}
                        />
                    </motion.div>

                    {/* ── Timeline ───────────────────────────────────── */}
                    <div className="mt-12">
                        {loading && (
                            <div>{[0, 1, 2].map((i) => <SkeletonRow key={i} delay={i * 0.1} />)}</div>
                        )}

                        {error && (
                            <p style={{ color: COLOR.label, fontSize: '0.875rem' }}>
                                Could not load experiences — {error}
                            </p>
                        )}

                        {!loading && !error && experiences.length === 0 && (
                            <p style={{ color: COLOR.label, fontSize: '0.875rem' }}>No experiences found.</p>
                        )}

                        {!loading && !error && experiences.length > 0 && (
                            <div style={{ position: 'relative' }}>
                                {/* Vertical connector line */}
                                <div
                                    className="hidden md:block absolute pointer-events-none"
                                    style={{
                                        left: LINE_LEFT_PX,
                                        top: 26, bottom: 26, width: 1,
                                        background: 'linear-gradient(to bottom, transparent, rgba(28,25,23,0.1) 5%, rgba(28,25,23,0.1) 95%, transparent)',
                                    }}
                                />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                                    {experiences.map((exp, i) => (
                                        <motion.div
                                            key={exp.id}
                                            initial={{ opacity: 0, y: REVEAL_Y_PX }}
                                            whileInView={{ opacity: 1, y: 0, transition: { duration: ITEM_DURATION_S, ease: STRONG_EASE_OUT, delay: i * ENTRY_STAGGER_S } }}
                                            viewport={{ once: true, margin: '-60px' }}
                                        >
                                            <ExperienceEntry experience={exp} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MotionConfig>
    );
}

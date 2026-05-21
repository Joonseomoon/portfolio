import { useEffect, useState } from 'react';
import { motion, MotionConfig, type Variants, useAnimation } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchSkills, type ISkill } from '../api';

// ── Timing constants ──────────────────────────────────────────────────────────
const STRONG_EASE_OUT    = [0.23, 1, 0.32, 1] as const;
const WORD_STAGGER_S     = 0.055;
const REVEAL_DURATION_S  = 0.6;
const STAGGER_CHILDREN_S = 0.07;
const ITEM_DURATION_S    = 0.42;   // Emil: UI reveals ≤450ms
const SKILL_STAGGER_S    = 0.03;

// ── Hero entrance variants (mount-based, reliable for top-of-page) ────────────
const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER_CHILDREN_S, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
    hidden:  { opacity: 0, transform: 'translateY(16px)' },
    visible: { opacity: 1, transform: 'translateY(0px)', transition: { duration: ITEM_DURATION_S, ease: STRONG_EASE_OUT } },
};

// ── VerticalCutReveal (mount-based, not whileInView, for hero heading) ────────
interface VCRProps {
    children: string;
    italic?: boolean;
    delayBase?: number;
    controls: ReturnType<typeof useAnimation>;
}

function VerticalCutReveal({ children, italic = false, delayBase = 0, controls }: VCRProps) {
    const words = children.split(' ');
    return (
        <span style={{ fontStyle: italic ? 'italic' : 'normal', display: 'inline' }}>
            {words.map((word, i) => (
                // clip-path instead of overflow:hidden — lets side bearings breathe (no horizontal clipping)
                // while still hiding the word when it's at y:106% (below the bottom edge)
                <span key={i} style={{
                    display: 'inline-block',
                    clipPath: 'inset(-8px -6px 0px -6px)',
                    marginRight: '0.28em',
                    paddingBottom: '0.22em',
                    marginBottom: '-0.22em',
                }}>
                    <motion.span
                        style={{ display: 'inline-block' }}
                        custom={delayBase + i}
                        animate={controls}
                        initial="hidden"
                        variants={{
                            hidden: { transform: 'translateY(108%)' },
                            visible: (idx: number) => ({
                                transform: 'translateY(0px)',
                                transition: {
                                    duration: REVEAL_DURATION_S,
                                    ease: STRONG_EASE_OUT,
                                    delay: idx * WORD_STAGGER_S,
                                },
                            }),
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

// ── Scroll-reveal wrapper (for below-fold sections) ───────────────────────────
const fadeUpVariants: Variants = {
    hidden:  { opacity: 0, transform: 'translateY(18px)' },
    visible: (delay: number = 0) => ({
        opacity: 1,
        transform: 'translateY(0px)',
        transition: { duration: ITEM_DURATION_S, ease: STRONG_EASE_OUT, delay },
    }),
};

function FadeUp({ children, delay = 0, className, style }: {
    children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
    return (
        <motion.div
            className={className}
            style={style}
            variants={fadeUpVariants}
            custom={delay}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
        >
            {children}
        </motion.div>
    );
}

// ── Portrait + stats (right column) ──────────────────────────────────────────
const stats = [
    { value: '2+', label: 'Years building' },
    { value: '10+', label: 'Projects shipped' },
    { value: 'BU', label: 'Hack4Impact' },
];

function PortraitColumn() {
    return (
        <FadeUp delay={0.1} className="flex-shrink-0 flex flex-col gap-6">
            {/* Portrait frame */}
            <div
                style={{
                    width: '260px',
                    height: '340px',
                    border: '1px solid rgba(28,25,23,0.2)',
                    boxShadow: '6px 6px 0px rgba(28,25,23,0.07)',
                    background: 'rgba(28,25,23,0.045)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle crosshatch fill so it reads as a real frame */}
                <svg
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
                    aria-hidden="true"
                >
                    <defs>
                        <pattern id="hatch" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="12" stroke="#1C1917" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hatch)" />
                </svg>

                {/* Corner accents */}
                {[
                    { top: 10, left: 10 },
                    { top: 10, right: 10 },
                    { bottom: 10, left: 10 },
                    { bottom: 10, right: 10 },
                ].map((pos, i) => (
                    <span key={i} style={{
                        position: 'absolute', width: 16, height: 16,
                        borderTop:    'top'    in pos ? '1.5px solid rgba(28,25,23,0.35)' : undefined,
                        borderBottom: 'bottom' in pos ? '1.5px solid rgba(28,25,23,0.35)' : undefined,
                        borderLeft:   'left'   in pos ? '1.5px solid rgba(28,25,23,0.35)' : undefined,
                        borderRight:  'right'  in pos ? '1.5px solid rgba(28,25,23,0.35)' : undefined,
                        ...pos,
                    }} />
                ))}

                {/* Person silhouette — larger so it clearly reads as a photo placeholder */}
                <svg width="80" height="88" viewBox="0 0 80 88" fill="none" aria-hidden="true">
                    <circle cx="40" cy="28" r="18" stroke="rgba(28,25,23,0.25)" strokeWidth="1.5" fill="rgba(28,25,23,0.06)" />
                    <path d="M4 84c0-19.882 16.118-36 36-36s36 16.118 36 36" stroke="rgba(28,25,23,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>

                <div style={{ textAlign: 'center', position: 'relative' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(28,25,23,0.4)', lineHeight: 1.8 }}>
                        Your photo here
                    </p>
                    <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(28,25,23,0.25)', marginTop: 2 }}>
                        260 × 340 px
                    </p>
                </div>
            </div>

            {/* Stats below the image */}
            <div
                className="flex items-start gap-6 pt-5"
                style={{ borderTop: '1px solid rgba(28,25,23,0.1)' }}
            >
                {stats.map(({ value, label }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                        <span style={{
                            fontFamily: '"DM Serif Display", Georgia, serif',
                            fontSize: '1.6rem',
                            fontWeight: 400,
                            color: '#1C1917',
                            lineHeight: 1,
                        }}>
                            {value}
                        </span>
                        <span style={{ fontSize: '11px', letterSpacing: '0.04em', color: '#A8A29E' }}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </FadeUp>
    );
}

// ── Skill components ──────────────────────────────────────────────────────────
function SkillCard({ skill, index }: { skill: ISkill; index: number }) {
    return (
        <motion.div
            className="flex flex-col items-center gap-2 cursor-default"
            style={{
                background: 'rgba(28,25,23,0.03)',
                border: '1px solid rgba(28,25,23,0.08)',
                padding: '14px 8px',
                minHeight: '80px',
                justifyContent: 'center',
            }}
            initial={{ opacity: 0, transform: 'translateY(12px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.42, ease: STRONG_EASE_OUT, delay: index * SKILL_STAGGER_S } }}
            viewport={{ once: true, margin: '-30px' }}
            whileHover={{ backgroundColor: 'rgba(28,25,23,0.07)', transition: { duration: 0.1, ease: 'easeOut' } }}
            whileTap={{ backgroundColor: 'rgba(28,25,23,0.11)', transition: { duration: 0.07 } }}
        >
            <img
                src={skill.icon_url}
                alt={skill.title}
                className="w-7 h-7 object-contain select-none"
                draggable={false}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="text-xs font-medium text-center leading-tight" style={{ color: '#78716C' }}>
                {skill.title}
            </span>
        </motion.div>
    );
}

function SkeletonSkillCard() {
    return (
        <div
            style={{
                background: 'rgba(28,25,23,0.03)',
                border: '1px solid rgba(28,25,23,0.06)',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 8px',
            }}
        >
            <div className="w-7 h-7 rounded" style={{ background: 'rgba(28,25,23,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div className="w-10 h-2.5 rounded" style={{ background: 'rgba(28,25,23,0.06)', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
        </div>
    );
}

function SkillCategory({ label, skills, baseIndex }: { label: string; skills: ISkill[]; baseIndex: number }) {
    return (
        <div className="mb-10">
            <FadeUp className="flex items-center gap-4 mb-4">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase whitespace-nowrap" style={{ color: '#A8A29E' }}>
                    {label}
                </p>
                <div className="flex-1 h-px" style={{ background: 'rgba(28,25,23,0.1)' }} />
            </FadeUp>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))' }}>
                {skills.map((skill, i) => (
                    <SkillCard key={skill.id} skill={skill} index={baseIndex + i} />
                ))}
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const CATEGORY_ORDER = ['Languages', 'Frameworks', 'Developer Tools', 'Libraries'];

export default function About() {
    const navigate = useNavigate();
    const headingControls = useAnimation();

    const [skills, setSkills] = useState<ISkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Trigger heading reveal on mount
    useEffect(() => {
        headingControls.start('visible');
    }, [headingControls]);

    useEffect(() => {
        fetchSkills()
            .then(setSkills)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const grouped = skills.reduce<Record<string, ISkill[]>>((acc, skill) => {
        const cat = skill.category ?? 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    const orderedCategories = [
        ...CATEGORY_ORDER.filter((c) => grouped[c]),
        ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
    ];

    let skillIdx = 0;

    return (
        <MotionConfig reducedMotion="user">
            <div
                className="flex-1 overflow-y-auto relative"
                style={{ background: '#F7F5F0', fontFamily: '"DM Sans", system-ui, sans-serif' }}
            >
                {/* Subtle grain overlay matching Home */}
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

                    {/* ── Hero ──────────────────────────────────────────── */}
                    <section className="mx-auto max-w-5xl px-8 sm:px-14 pt-14 pb-10">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col sm:flex-row gap-10 sm:gap-16 sm:items-start"
                        >
                            {/* Left column: eyebrow + heading + divider + bio + CTA */}
                            <div className="flex-1 min-w-0">
                                <motion.p
                                    variants={itemVariants}
                                    className="text-xs font-medium tracking-[0.4em] uppercase mb-8"
                                    style={{ color: '#A8A29E' }}
                                >
                                    Who I am
                                </motion.p>

                                <motion.h1
                                    variants={itemVariants}
                                    style={{
                                        fontFamily: '"DM Serif Display", Georgia, serif',
                                        fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                                        fontWeight: 400,
                                        lineHeight: 1.08,
                                        letterSpacing: '-0.02em',
                                        color: '#1C1917',
                                        marginBottom: '1.75rem',
                                    }}
                                >
                                    <VerticalCutReveal controls={headingControls} delayBase={0}>
                                        Engineer aspiring
                                    </VerticalCutReveal>
                                    <br />
                                    <VerticalCutReveal controls={headingControls} italic delayBase={2}>
                                        to build impactful
                                    </VerticalCutReveal>
                                    <br />
                                    <VerticalCutReveal controls={headingControls} delayBase={5}>
                                        software.
                                    </VerticalCutReveal>
                                </motion.h1>

                                <motion.div
                                    variants={itemVariants}
                                    className="h-px mb-7"
                                    style={{ background: 'rgba(28,25,23,0.12)' }}
                                />

                                <motion.div variants={itemVariants}>
                                    <p className="text-sm leading-[1.75] mb-3" style={{ color: '#57534E' }}>
                                        Hi, I'm{' '}
                                        <span style={{ color: '#1C1917', fontWeight: 600 }}>Joonseo Moon</span>{' '}
                                        — a full-stack developer who cares about clean architecture and intuitive interfaces. I enjoy working across the entire stack, from designing UIs to building reliable backend systems.
                                    </p>
                                    <p className="text-sm leading-[1.75] mb-8" style={{ color: '#57534E' }}>
                                        Currently a Software Engineer at{' '}
                                        <span style={{ color: '#1C1917', fontWeight: 600 }}>Hack4Impact BU</span>
                                        , building web applications for nonprofits.
                                    </p>

                                    <motion.button
                                        onClick={() => navigate('/contact')}
                                        className="flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wide cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2"
                                        style={{
                                            background: '#1C1917',
                                            color: '#F7F5F0',
                                            minHeight: '44px',
                                            transition: 'background-color 150ms ease',
                                        }}
                                        whileHover={{ backgroundColor: '#3C3532' }}
                                        whileTap={{ scale: 0.97, transition: { duration: 0.14, ease: 'easeOut' } }}
                                    >
                                        Get in touch <ArrowRight size={15} />
                                    </motion.button>
                                </motion.div>
                            </div>

                            {/* Right column: portrait + stats */}
                            <PortraitColumn />
                        </motion.div>
                    </section>

                    {/* ── Divider ───────────────────────────────────────── */}
                    <div className="mx-auto max-w-5xl px-8 sm:px-14">
                        <div className="h-px" style={{ background: 'rgba(28,25,23,0.1)' }} />
                    </div>

                    {/* ── Skills ────────────────────────────────────────── */}
                    <section className="mx-auto max-w-5xl px-8 sm:px-14 py-14">
                        <FadeUp className="mb-10">
                            <p className="text-xs font-medium tracking-[0.4em] uppercase" style={{ color: '#A8A29E' }}>
                                Technical Skills
                            </p>
                        </FadeUp>

                        {error && (
                            <p className="text-sm" style={{ color: '#A8A29E' }}>Could not load skills — {error}</p>
                        )}

                        {loading && (
                            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))' }}>
                                {Array.from({ length: 16 }, (_, i) => <SkeletonSkillCard key={i} />)}
                            </div>
                        )}

                        {!loading && !error && orderedCategories.map((cat) => {
                            const catSkills = grouped[cat];
                            const base = skillIdx;
                            skillIdx += catSkills.length;
                            return <SkillCategory key={cat} label={cat} skills={catSkills} baseIndex={base} />;
                        })}
                    </section>
                </div>
            </div>
        </MotionConfig>
    );
}

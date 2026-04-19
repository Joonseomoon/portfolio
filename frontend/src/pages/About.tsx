import { useEffect, useRef, useState } from 'react';
import { fetchSkills, ISkill } from '../api';

function useInView(threshold = 0.05) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

// ---------------------------------------------------------------------------
// Skill chip
// ---------------------------------------------------------------------------
function SkillCard({ skill, delay }: { skill: ISkill; delay: number }) {
    const { ref, inView } = useInView();

    return (
        <div
            ref={ref}
            className="flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all duration-300"
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
                transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
                background: 'rgba(200,216,255,0.04)',
                border: '1px solid rgba(200,216,255,0.09)',
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(200,216,255,0.09)';
                el.style.borderColor = 'rgba(200,216,255,0.2)';
                el.style.boxShadow = '0 0 24px rgba(200,216,255,0.06)';
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(200,216,255,0.04)';
                el.style.borderColor = 'rgba(200,216,255,0.09)';
                el.style.boxShadow = 'none';
            }}
        >
            <img
                src={skill.icon_url}
                alt={skill.title}
                className="w-9 h-9 object-contain select-none"
                draggable={false}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span
                className="text-xs font-medium text-center leading-tight"
                style={{ color: '#8898b8' }}
            >
                {skill.title}
            </span>
        </div>
    );
}

function SkeletonSkillCard() {
    return (
        <div
            className="flex flex-col items-center gap-2.5 p-4 rounded-2xl"
            style={{ background: 'rgba(200,216,255,0.03)', border: '1px solid rgba(200,216,255,0.06)' }}
        >
            <div className="rounded-lg w-9 h-9" style={{ background: 'rgba(200,216,255,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div className="rounded w-12 h-3" style={{ background: 'rgba(200,216,255,0.06)', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Category section
// ---------------------------------------------------------------------------
function SkillCategory({ label, skills, startDelay }: { label: string; skills: ISkill[]; startDelay: number }) {
    return (
        <div className="mb-10">
            <div className="flex items-center gap-4 mb-5">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase whitespace-nowrap" style={{ color: '#6b7fa3' }}>
                    {label}
                </p>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(200,216,255,0.12), transparent)' }} />
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))' }}>
                {skills.map((skill, i) => (
                    <SkillCard key={skill.id} skill={skill} delay={startDelay + i * 40} />
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const CATEGORY_ORDER = ['Languages', 'Frameworks', 'Developer Tools', 'Libraries'];

export default function About() {
    const [skills, setSkills] = useState<ISkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    let delayCounter = 0;

    return (
        <div className="flex-1 overflow-y-auto" style={{ background: '#03030f' }}>

            {/* Deep-space gradient */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, #0b0b2e 0%, #03030f 65%)',
                    zIndex: 0,
                }}
            />

            <div className="relative z-10 mx-auto max-w-3xl px-6 py-16">

                {/* Page header */}
                <div className="mb-14 text-center">
                    <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: '#6b7fa3' }}>
                        Who I am
                    </p>
                    <h1
                        className="text-4xl sm:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(135deg, #e8eeff 0%, #c8d8ff 45%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 18px rgba(165,180,252,0.3))',
                        }}
                    >
                        About
                    </h1>
                    <div
                        className="mx-auto mt-5 h-px w-16"
                        style={{ background: 'linear-gradient(to right, transparent, rgba(200,216,255,0.4), transparent)' }}
                    />
                </div>

                {/* Bio */}
                <div
                    className="rounded-2xl p-8 mb-16"
                    style={{
                        background: 'rgba(200,216,255,0.03)',
                        border: '1px solid rgba(200,216,255,0.08)',
                    }}
                >
                    <p className="text-base leading-relaxed mb-4" style={{ color: '#8898b8' }}>
                        Hi, I'm <span style={{ color: '#c8d8ff' }}>Joonseo Moon</span> — a full-stack
                        developer with a passion for building clean, thoughtful software. I enjoy working
                        across the entire stack, from designing intuitive user interfaces to architecting
                        reliable backend systems.
                    </p>
                    <p className="text-base leading-relaxed" style={{ color: '#8898b8' }}>
                        I'm currently a Software Engineer at{' '}
                        <span style={{ color: '#c8d8ff' }}>Hack4Impact BU</span>, building web applications
                        for nonprofits. I'm always looking for new challenges and opportunities to grow as
                        an engineer.
                    </p>
                </div>

                {/* Skills */}
                <div>
                    <div className="flex items-center gap-4 mb-10">
                        <p className="text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: '#6b7fa3' }}>
                            Technical Skills
                        </p>
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(200,216,255,0.15), transparent)' }} />
                    </div>

                    {error && (
                        <p className="text-sm text-center" style={{ color: '#7a90b0' }}>
                            Could not load skills — {error}
                        </p>
                    )}

                    {loading && (
                        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))' }}>
                            {Array.from({ length: 16 }, (_, i) => <SkeletonSkillCard key={i} />)}
                        </div>
                    )}

                    {!loading && !error && skills.length === 0 && (
                        <p className="text-sm text-center mt-4" style={{ color: '#4f607a' }}>No skills found.</p>
                    )}

                    {!loading && !error && orderedCategories.map((cat) => {
                        const catSkills = grouped[cat];
                        const start = delayCounter;
                        delayCounter += catSkills.length * 40;
                        return (
                            <SkillCategory
                                key={cat}
                                label={cat}
                                skills={catSkills}
                                startDelay={start}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

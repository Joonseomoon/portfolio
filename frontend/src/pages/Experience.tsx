import { useEffect, useRef, useState } from 'react';
import { fetchExperiences, IExperience } from '../api';

// ---------------------------------------------------------------------------
// Scroll-reveal hook — fires once when the element enters the viewport
// ---------------------------------------------------------------------------
function useInView(threshold = 0.18) {
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
// Single timeline card (left or right)
// ---------------------------------------------------------------------------
interface CardProps {
    experience: IExperience;
    side: 'left' | 'right';
}

function TimelineCard({ experience, side }: CardProps) {
    const { ref, inView } = useInView();

    const translateFrom = side === 'left' ? '-40px' : '40px';

    const cardContent = (
        <div
            className="rounded-2xl p-5 transition-all duration-300"
            style={{
                background: 'rgba(200,216,255,0.04)',
                border: '1px solid rgba(200,216,255,0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
            }}
            onMouseEnter={experience.companyURL ? (e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(200,216,255,0.08)';
                el.style.borderColor = 'rgba(200,216,255,0.22)';
                el.style.boxShadow = '0 0 32px rgba(200,216,255,0.07)';
            } : undefined}
            onMouseLeave={experience.companyURL ? (e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(200,216,255,0.04)';
                el.style.borderColor = 'rgba(200,216,255,0.1)';
                el.style.boxShadow = 'none';
            } : undefined}
        >
                    {/* Timeframe */}
                    <p
                        className="text-xs font-semibold tracking-[0.25em] uppercase mb-2"
                        style={{ color: '#6b7fa3' }}
                    >
                        {experience.timeframe}
                    </p>

                    {/* Title */}
                    <h3
                        className="text-lg font-bold leading-snug mb-0.5 group-hover:text-[#e8eeff] transition-colors duration-200"
                        style={{ color: '#c8d8ff' }}
                    >
                        {experience.title}
                    </h3>

                    {/* Company + location */}
                    <p
                        className="text-sm font-medium mb-3"
                        style={{ color: '#8898b8' }}
                    >
                        {experience.companyName}
                        {experience.location && (
                            <span style={{ color: '#4f607a' }}> · {experience.location}</span>
                        )}
                    </p>

                    {/* Divider */}
                    <div
                        className="mb-3 h-px w-10"
                        style={{
                            background: 'linear-gradient(to right, rgba(200,216,255,0.25), transparent)',
                        }}
                    />

                    {/* Description bullets */}
                    {experience.description.length > 0 && (
                        <ul className="space-y-1.5">
                            {experience.description.map((line, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span
                                        className="mt-1.5 flex-shrink-0 rounded-full"
                                        style={{
                                            width: '4px',
                                            height: '4px',
                                            background: 'rgba(200,216,255,0.4)',
                                        }}
                                    />
                                    <span
                                        className="text-sm leading-relaxed"
                                        style={{ color: '#7a90b0' }}
                                    >
                                        {line}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
    );

    return (
        <div
            ref={ref}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : `translateX(${translateFrom})`,
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                gridColumn: side === 'left' ? '1' : '3',
            }}
        >
            {experience.companyURL ? (
                <a
                    href={experience.companyURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    style={{ textDecoration: 'none' }}
                >
                    {cardContent}
                </a>
            ) : (
                <div className="group">{cardContent}</div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Animated timeline node on the centre line
// ---------------------------------------------------------------------------
function TimelineNode({ inView }: { inView: boolean }) {
    return (
        <div
            className="col-start-2 flex flex-col items-center"
            style={{ paddingTop: '24px' }}
        >
            {/* Dot */}
            <div
                className="z-10 rounded-full flex-shrink-0 transition-all duration-500"
                style={{
                    width: '13px',
                    height: '13px',
                    background: inView ? '#c8d8ff' : 'rgba(200,216,255,0.2)',
                    boxShadow: inView
                        ? '0 0 12px 3px rgba(200,216,255,0.35), 0 0 24px 6px rgba(200,216,255,0.12)'
                        : 'none',
                    border: '2px solid rgba(200,216,255,0.35)',
                    transitionDelay: '0.1s',
                }}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Row wrapper — manages shared inView state for card + node
// ---------------------------------------------------------------------------
interface RowProps {
    experience: IExperience;
    index: number;
}

function TimelineRow({ experience, index }: RowProps) {
    const side = index % 2 === 0 ? 'left' : 'right';
    const { ref, inView } = useInView(0.15);

    return (
        <div
            ref={ref}
            className="grid items-start"
            style={{
                gridTemplateColumns: '1fr 40px 1fr',
                gap: '0 20px',
                marginBottom: '48px',
            }}
        >
            {/* Left slot */}
            {side === 'left' ? (
                <TimelineCard experience={experience} side="left" />
            ) : (
                <div />
            )}

            {/* Centre node */}
            <TimelineNode inView={inView} />

            {/* Right slot */}
            {side === 'right' ? (
                <TimelineCard experience={experience} side="right" />
            ) : (
                <div />
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Experience() {
    const [experiences, setExperiences] = useState<IExperience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExperiences()
            .then(setExperiences)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div
            className="flex-1 overflow-y-auto"
            style={{ background: '#03030f' }}
        >
            {/* Deep-space gradient */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 50% at 50% 0%, #0b0b2e 0%, #03030f 65%)',
                    zIndex: 0,
                }}
            />

            <div
                className="relative z-10 mx-auto max-w-4xl px-6 py-16"
            >
                {/* Page header */}
                <div className="mb-16 text-center">
                    <p
                        className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
                        style={{ color: '#6b7fa3' }}
                    >
                        Career
                    </p>
                    <h1
                        className="text-4xl sm:text-5xl font-bold"
                        style={{
                            background:
                                'linear-gradient(135deg, #e8eeff 0%, #c8d8ff 45%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 18px rgba(165,180,252,0.3))',
                        }}
                    >
                        Experience
                    </h1>
                    <div
                        className="mx-auto mt-5 h-px w-16"
                        style={{
                            background:
                                'linear-gradient(to right, transparent, rgba(200,216,255,0.4), transparent)',
                        }}
                    />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-24">
                        <div
                            className="w-8 h-8 rounded-full border-2 animate-spin"
                            style={{
                                borderColor: 'rgba(200,216,255,0.15)',
                                borderTopColor: '#c8d8ff',
                            }}
                        />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="text-center text-sm" style={{ color: '#7a90b0' }}>
                        Could not load experiences — {error}
                    </p>
                )}

                {/* Empty */}
                {!loading && !error && experiences.length === 0 && (
                    <p className="text-center text-sm" style={{ color: '#4f607a' }}>
                        No experiences found.
                    </p>
                )}

                {/* Timeline */}
                {experiences.length > 0 && (
                    <div className="relative">
                        {/* Vertical centre line */}
                        <div
                            className="absolute top-0 bottom-0 pointer-events-none"
                            style={{
                                left: 'calc(50% - 1px)',
                                width: '2px',
                                background:
                                    'linear-gradient(to bottom, transparent, rgba(200,216,255,0.18) 8%, rgba(200,216,255,0.18) 92%, transparent)',
                            }}
                        />

                        {experiences.map((exp, i) => (
                            <TimelineRow key={exp._id} experience={exp} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

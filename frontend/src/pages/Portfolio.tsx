import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { fetchPortfolioItems, IPortfolioItem } from '../api';

const SLIDE_RATIO = 0.78;
const GAP = 24;

// ---------------------------------------------------------------------------
// Peek carousel — adjacent slides visible and faded at edges via mask-image
// ---------------------------------------------------------------------------
function Carousel({ items }: { items: IPortfolioItem[] }) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const slideWidth = containerWidth * SLIDE_RATIO;
    const trackOffset = (containerWidth - slideWidth) / 2 - current * (slideWidth + GAP);

    const prev = useCallback(() =>
        setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);
    const next = useCallback(() =>
        setCurrent((c) => (c + 1) % items.length), [items.length]);

    useEffect(() => {
        if (paused || items.length <= 1) return;
        const id = setInterval(next, 5000);
        return () => clearInterval(id);
    }, [paused, next, items.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [prev, next]);

    if (items.length === 0) return null;

    return (
        <div
            style={{ paddingBottom: '44px' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Mask container — fades edges, does NOT clip overflow */}
            <div
                ref={containerRef}
                style={{
                    overflow: 'visible',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 11%, black 89%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 11%, black 89%, transparent 100%)',
                }}
            >
                {/* Sliding track */}
                <div
                    className="flex"
                    style={{
                        gap: `${GAP}px`,
                        transform: `translateX(${trackOffset}px)`,
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'transform',
                    }}
                >
                    {items.map((item, i) => {
                        const isActive = i === current;
                        return (
                            <div
                                key={item.id}
                                onClick={() => !isActive && setCurrent(i)}
                                style={{
                                    width: `${slideWidth}px`,
                                    flexShrink: 0,
                                    opacity: isActive ? 1 : 0.5,
                                    transform: isActive ? 'scale(1)' : 'scale(0.97)',
                                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                                    cursor: isActive ? 'default' : 'pointer',
                                }}
                            >
                                <div
                                    className="relative rounded-2xl overflow-hidden"
                                    style={{
                                        aspectRatio: '16/7',
                                        border: isActive
                                            ? '1px solid rgba(200,216,255,0.2)'
                                            : '1px solid rgba(200,216,255,0.07)',
                                        transition: 'border-color 0.5s ease',
                                    }}
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover select-none"
                                        draggable={false}
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: isActive
                                                ? 'linear-gradient(to top, rgba(3,3,15,0.95) 0%, rgba(3,3,15,0.4) 50%, transparent 100%)'
                                                : 'rgba(3,3,15,0.55)',
                                            transition: 'background 0.5s ease',
                                        }}
                                    />
                                    {/* Content — active slide only */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 p-7"
                                        style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.4s ease' }}
                                    >
                                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight" style={{ color: '#e8eeff' }}>
                                            {item.title}
                                        </h2>
                                        <p className="text-sm leading-relaxed mb-3 max-w-lg" style={{ color: '#8898b8' }}>
                                            {item.description}
                                        </p>
                                        {item.icon_urls.length > 0 && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {item.icon_urls.map((url, idx) => (
                                                    <img key={idx} src={url} alt="" className="w-5 h-5 object-contain opacity-70" draggable={false} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            {items.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-5">
                    <button
                        onClick={prev}
                        className="flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer text-lg"
                        style={{ width: '32px', height: '32px', background: 'rgba(3,3,15,0.6)', border: '1px solid rgba(200,216,255,0.15)', backdropFilter: 'blur(8px)', color: '#c8d8ff' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,216,255,0.4)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,216,255,0.15)'; }}
                    >‹</button>
                    <div className="flex items-center gap-1.5">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className="rounded-full transition-all duration-300 cursor-pointer"
                                style={{
                                    width: i === current ? '18px' : '6px',
                                    height: '6px',
                                    background: i === current ? '#c8d8ff' : 'rgba(200,216,255,0.3)',
                                }}
                            />
                        ))}
                    </div>
                    <button
                        onClick={next}
                        className="flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer text-lg"
                        style={{ width: '32px', height: '32px', background: 'rgba(3,3,15,0.6)', border: '1px solid rgba(200,216,255,0.15)', backdropFilter: 'blur(8px)', color: '#c8d8ff' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,216,255,0.4)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,216,255,0.15)'; }}
                    >›</button>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Project card
// ---------------------------------------------------------------------------
function ProjectCard({ item }: { item: IPortfolioItem }) {
    return (
        <div
            className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-default"
            style={{
                background: 'rgba(200,216,255,0.04)',
                border: '1px solid rgba(200,216,255,0.09)',
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(200,216,255,0.08)';
                el.style.borderColor = 'rgba(200,216,255,0.2)';
                el.style.boxShadow = '0 0 28px rgba(200,216,255,0.06)';
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(200,216,255,0.04)';
                el.style.borderColor = 'rgba(200,216,255,0.09)';
                el.style.boxShadow = 'none';
            }}
        >
            {/* Thumbnail */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover select-none transition-transform duration-500"
                    draggable={false}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(3,3,15,0.5) 0%, transparent 60%)' }}
                />
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                <h3
                    className="text-base font-bold mb-1.5 leading-snug"
                    style={{ color: '#c8d8ff' }}
                >
                    {item.title}
                </h3>
                <p
                    className="text-sm leading-relaxed flex-1"
                    style={{
                        color: '#6b7fa3',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {item.description}
                </p>

                {item.icon_urls.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3" style={{ borderTop: '1px solid rgba(200,216,255,0.07)' }}>
                        {item.icon_urls.map((url, i) => (
                            <img key={i} src={url} alt="" className="w-4 h-4 object-contain opacity-60" draggable={false} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Skeleton cards
// ---------------------------------------------------------------------------
function SkeletonCarousel() {
    return (
        <div
            className="rounded-2xl"
            style={{
                aspectRatio: '16/7',
                background: 'rgba(200,216,255,0.03)',
                border: '1px solid rgba(200,216,255,0.07)',
                animation: 'pulse 1.5s ease-in-out infinite',
            }}
        />
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(200,216,255,0.03)', border: '1px solid rgba(200,216,255,0.06)' }}>
            <div style={{ aspectRatio: '16/9', background: 'rgba(200,216,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div className="p-4 space-y-2">
                <div className="rounded h-4 w-2/3" style={{ background: 'rgba(200,216,255,0.08)', animation: 'pulse 1.5s ease-in-out 0.1s infinite' }} />
                <div className="rounded h-3 w-full" style={{ background: 'rgba(200,216,255,0.05)', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
                <div className="rounded h-3 w-4/5" style={{ background: 'rgba(200,216,255,0.05)', animation: 'pulse 1.5s ease-in-out 0.3s infinite' }} />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Section divider
// ---------------------------------------------------------------------------
function SectionLabel({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 mb-7">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase flex-shrink-0" style={{ color: '#6b7fa3' }}>
                {label}
            </p>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(200,216,255,0.15), transparent)' }} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
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
    const all = items;

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

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">

                {/* Header */}
                <div className="mb-14 text-center">
                    <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: '#6b7fa3' }}>
                        My Work
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
                        Portfolio
                    </h1>
                    <div
                        className="mx-auto mt-5 h-px w-16"
                        style={{ background: 'linear-gradient(to right, transparent, rgba(200,216,255,0.4), transparent)' }}
                    />
                </div>

                {error && (
                    <p className="text-center text-sm mb-8" style={{ color: '#7a90b0' }}>
                        Could not load projects — {error}
                    </p>
                )}

                {/* Featured carousel — breaks out of max-w-5xl for extra width */}
                {(loading || featured.length > 0) && (
                    <div className="mb-16">
                        <SectionLabel label="Featured" />
                        <div style={{ margin: '0 calc(-50vw + 50%)', padding: '0 2vw' }}>
                            {loading ? <SkeletonCarousel /> : <Carousel items={featured} />}
                        </div>
                    </div>
                )}

                {/* All projects grid */}
                <div>
                    <SectionLabel label="All Projects" />
                    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {loading
                            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
                            : all.map((item) => <ProjectCard key={item.id} item={item} />)
                        }
                    </div>

                    {!loading && !error && all.length === 0 && (
                        <p className="text-center text-sm mt-4" style={{ color: '#4f607a' }}>
                            No projects found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useMemo } from 'react';

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
}

function generateStars(count: number): Star[] {
    // Seeded via fixed pattern so SSR/hydration stays stable
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: ((i * 137.508) % 100),
        y: ((i * 97.3141) % 100),
        size: (i % 3) * 0.7 + 0.6,
        duration: ((i % 5) + 2.5),
        delay: ((i % 7) * 0.6),
        opacity: ((i % 5) * 0.12 + 0.18),
    }));
}

const Home = () => {
    const stars = useMemo(() => generateStars(150), []);

    return (
        <div className="relative flex-1 overflow-hidden" style={{ background: '#03030f' }}>

            {/* Deep-space radial gradient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 60% at 50% 0%, #0b0b2e 0%, #03030f 70%)',
                }}
            />

            {/* Ambient moonlight halo — upper-right */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '-10%',
                    right: '20%',
                    width: '500px',
                    height: '500px',
                    background:
                        'radial-gradient(circle, rgba(200,216,255,0.055) 0%, transparent 70%)',
                }}
            />

            {/* Starfield */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white pointer-events-none"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                    }}
                />
            ))}

            {/* Page content */}
            <div className="relative z-10 mx-auto h-full max-w-5xl flex items-center justify-center gap-20 px-6 py-8">

                {/* Moon */}
                <div className="relative flex-shrink-0">
                    {/* Soft glow ring behind the moon */}
                    <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            transform: 'scale(1.7)',
                            background:
                                'radial-gradient(circle, rgba(200,216,255,0.08) 0%, transparent 70%)',
                            filter: 'blur(18px)',
                        }}
                    />
                    <img
                        src="/moonv2.svg"
                        alt="Moon"
                        className="moon-float relative w-52 sm:w-64 select-none"
                        draggable={false}
                        style={{
                            filter:
                                'drop-shadow(0 0 28px rgba(200,216,255,0.28)) drop-shadow(0 0 64px rgba(200,216,255,0.10))',
                        }}
                    />
                </div>

                {/* Text */}
                <div className="flex flex-col items-start">

                    {/* Eyebrow */}
                    <p
                        className="animate-fade-slide-up text-xs font-semibold tracking-[0.35em] uppercase mb-3"
                        style={{ color: '#6b7fa3', animationDelay: '0.1s' }}
                    >
                        Portfolio
                    </p>

                    {/* Greeting */}
                    <h1
                        className="animate-fade-slide-up text-4xl sm:text-5xl font-bold tracking-tight leading-tight"
                        style={{ color: '#e8eeff', animationDelay: '0.25s' }}
                    >
                        Hi, I&apos;m
                    </h1>

                    {/* Name — gradient shimmer */}
                    <h1
                        className="animate-fade-slide-up text-4xl sm:text-5xl font-bold tracking-tight leading-tight mt-1"
                        style={{
                            background:
                                'linear-gradient(135deg, #e8eeff 0%, #c8d8ff 45%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 18px rgba(165,180,252,0.35))',
                            animationDelay: '0.35s',
                        }}
                    >
                        Joonseo Moon
                    </h1>

                    {/* Role */}
                    <h2
                        className="animate-fade-slide-up mt-4 text-lg font-medium tracking-wide"
                        style={{ color: '#6b7fa3', animationDelay: '0.45s' }}
                    >
                        Full Stack Developer
                    </h2>

                    {/* Thin lunar divider */}
                    <div
                        className="animate-fade-slide-up mt-6 h-px w-14"
                        style={{
                            background:
                                'linear-gradient(to right, rgba(200,216,255,0.35), transparent)',
                            animationDelay: '0.55s',
                        }}
                    />

                    {/* CTA buttons */}
                    <div
                        className="animate-fade-slide-up flex gap-3 mt-6"
                        style={{ animationDelay: '0.65s' }}
                    >
                        <button
                            className="px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                                color: '#e8eeff',
                                border: '1px solid rgba(200,216,255,0.18)',
                                background: 'rgba(200,216,255,0.05)',
                                backdropFilter: 'blur(8px)',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background =
                                    'rgba(200,216,255,0.12)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor =
                                    'rgba(200,216,255,0.38)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background =
                                    'rgba(200,216,255,0.05)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor =
                                    'rgba(200,216,255,0.18)';
                            }}
                        >
                            View Work
                        </button>

                        <button
                            className="px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                                color: '#03030f',
                                background: '#c8d8ff',
                                boxShadow: '0 0 22px rgba(200,216,255,0.22)',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = '#e8eeff';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    '0 0 32px rgba(200,216,255,0.38)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = '#c8d8ff';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    '0 0 22px rgba(200,216,255,0.22)';
                            }}
                        >
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

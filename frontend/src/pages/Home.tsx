import { useNavigate } from 'react-router-dom';
import { motion, MotionConfig, type Variants } from 'framer-motion';

// ── Timing constants ──────────────────────────────────────────────────────────
const STAGGER_S        = 0.06;   // Emil: 30–80ms between items
const ITEM_DURATION_S  = 0.55;   // Emil: hero entrance ≤ 600ms
const ITEM_DISTANCE_PX = 16;     // Emil: keep slide distances tight (8–20px)
const MOON_FLOAT_PX    = 12;
const MOON_FLOAT_S     = 7;
const TAP_SCALE        = 0.97;
const STRONG_EASE_OUT  = [0.23, 1, 0.32, 1] as const; // Emil's recommended curve

// ── Variants ──────────────────────────────────────────────────────────────────
const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: STAGGER_S,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    // Use transform string for GPU acceleration (Emil: FM x/y shorthand runs on main thread)
    hidden:  { opacity: 0, transform: `translateY(${ITEM_DISTANCE_PX}px)` },
    visible: {
        opacity: 1,
        transform: 'translateY(0px)',
        transition: { duration: ITEM_DURATION_S, ease: STRONG_EASE_OUT },
    },
};

const moonVariants: Variants = {
    initial: { opacity: 0, scale: 0.92 },
    animate: {
        opacity: 0.82,
        scale: 1,
        transition: { duration: 1.1, ease: STRONG_EASE_OUT },
    },
};

const Home = () => {
    const navigate = useNavigate();

    return (
        <MotionConfig reducedMotion="user">
            <div
                className="relative flex-1 overflow-hidden"
                style={{ background: '#F7F5F0', fontFamily: '"DM Sans", system-ui, sans-serif' }}
            >
                {/* Subtle warm grain overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '160px',
                        opacity: 0.025,
                        mixBlendMode: 'multiply',
                    }}
                />

                {/* Moon SVG — fade in then float */}
                <motion.img
                    src="/moonv2.svg"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="absolute pointer-events-none select-none"
                    style={{
                        top: '-8%',
                        right: '-8%',
                        width: '500px',
                        height: '500px',
                        filter: 'grayscale(1) sepia(0.25) brightness(1.08) contrast(0.88)',
                    }}
                    variants={moonVariants}
                    initial="initial"
                    animate={{
                        opacity: 0.82,
                        scale: 1,
                        y: [0, -MOON_FLOAT_PX, 0],
                        transition: {
                            opacity: { duration: 1.1, ease: STRONG_EASE_OUT },
                            scale:   { duration: 1.1, ease: STRONG_EASE_OUT },
                            y: {
                                duration: MOON_FLOAT_S,
                                ease: 'easeInOut',
                                repeat: Infinity,
                                repeatType: 'loop',
                                delay: 1.1, // start float after reveal completes
                            },
                        },
                    }}
                />

                {/* Page content */}
                <motion.div
                    className="relative z-10 mx-auto h-full max-w-6xl flex flex-col justify-center px-8 sm:px-14 py-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Eyebrow */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xs font-medium tracking-[0.4em] uppercase mb-10"
                        style={{ color: '#A8A29E' }}
                    >
                        Portfolio — 2025
                    </motion.p>

                    {/* Display name */}
                    <motion.h1
                        variants={itemVariants}
                        style={{
                            fontFamily: '"DM Serif Display", Georgia, serif',
                            fontSize: 'clamp(3.8rem, 9.5vw, 8.5rem)',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            lineHeight: 0.93,
                            letterSpacing: '-0.025em',
                            color: '#1C1917',
                        }}
                    >
                        Joonseo
                    </motion.h1>

                    <motion.h1
                        variants={itemVariants}
                        style={{
                            fontFamily: '"DM Serif Display", Georgia, serif',
                            fontSize: 'clamp(3.8rem, 9.5vw, 8.5rem)',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            lineHeight: 0.93,
                            letterSpacing: '-0.025em',
                            color: '#1C1917',
                        }}
                    >
                        Moon.
                    </motion.h1>

                    {/* Rule */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-9 h-px"
                        style={{
                            background: 'rgba(28,25,23,0.12)',
                            maxWidth: '500px',
                        }}
                    />

                    {/* Role + description */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row sm:items-start gap-5 mt-7"
                    >
                        <p
                            className="text-xs font-semibold tracking-[0.25em] uppercase leading-relaxed whitespace-nowrap"
                            style={{ color: '#1C1917', paddingTop: '3px' }}
                        >
                            Full Stack<br />Developer
                        </p>
                        <div
                            className="hidden sm:block w-px self-stretch flex-shrink-0"
                            style={{ background: 'rgba(28,25,23,0.12)' }}
                        />
                        <p
                            className="text-sm leading-relaxed max-w-[300px]"
                            style={{ color: '#78716C' }}
                        >
                            Building elegant digital experiences with clean code and thoughtful design.
                        </p>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 mt-10"
                    >
                        <motion.button
                            onClick={() => navigate('/portfolio')}
                            className="px-7 py-2.5 text-sm font-medium tracking-wide cursor-pointer"
                            style={{ background: '#1C1917', color: '#F7F5F0' }}
                            whileHover={{ backgroundColor: '#3C3532' }}
                            whileTap={{ scale: TAP_SCALE }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            View Work
                        </motion.button>

                        <motion.button
                            onClick={() => navigate('/contact')}
                            className="px-7 py-2.5 text-sm font-medium tracking-wide cursor-pointer"
                            style={{
                                color: '#1C1917',
                                border: '1px solid rgba(28,25,23,0.28)',
                                background: 'transparent',
                            }}
                            whileHover={{ borderColor: 'rgba(28,25,23,0.65)' }}
                            whileTap={{ scale: TAP_SCALE }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            Contact
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </MotionConfig>
    );
};

export default Home;

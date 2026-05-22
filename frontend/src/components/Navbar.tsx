import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// ── Timing ────────────────────────────────────────────────────────────────────
const MENU_DURATION_S = 0.28;
const STRONG_EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface NavLink { to: string; label: string; }

const leftLinks: NavLink[] = [
    { to: '/',           label: 'Joonseo'    },
    { to: '/about',      label: 'About'      },
    { to: '/portfolio',  label: 'Portfolio'  },
    { to: '/experience', label: 'Experience' },
];
const rightLinks: NavLink[] = [
    { to: '/contact', label: 'Contact' },
];
const RESUME_URL = 'https://afnodznejysfclenphzg.supabase.co/storage/v1/object/public/Resume/RESUME.pdf';

export default function Navbar() {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    // Close menu on navigation
    useEffect(() => { setOpen(false); }, [pathname]);

    const linkClass = (to: string) =>
        `text-sm tracking-wide transition-colors duration-200 pb-1 border-b ${
            pathname === to
                ? 'font-semibold border-[#1C1917] text-[#1C1917]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
        }`;

    const mobileLinkClass = (to: string) =>
        `block text-base transition-colors duration-200 py-0.5 ${
            pathname === to ? 'font-semibold text-[#1C1917]' : 'text-[#78716C]'
        }`;

    return (
        <>
            <nav
                className="relative z-50 px-6 py-4"
                style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    background: 'rgba(247,245,240,0.92)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    borderBottom: '1px solid rgba(28,25,23,0.08)',
                }}
            >
                <div className="flex items-center justify-between">
                    {/* Left links — desktop */}
                    <ul className="hidden sm:flex items-center space-x-6">
                        {leftLinks.map(({ to, label }) => (
                            <li key={to}>
                                <Link to={to} className={linkClass(to)}>{label}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* Logo only — mobile */}
                    <Link
                        to="/"
                        className="sm:hidden text-sm font-semibold tracking-wide text-[#1C1917]"
                        style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
                    >
                        Joonseo
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-5">
                        {/* Desktop right links */}
                        <ul className="hidden sm:flex items-center space-x-6">
                            <li>
                                <a
                                    href={RESUME_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm tracking-wide transition-colors duration-200 pb-1 border-b border-transparent text-[#78716C] hover:text-[#1C1917]"
                                >
                                    Resume
                                </a>
                            </li>
                            {rightLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} className={linkClass(to)}>{label}</Link>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile: Contact + hamburger */}
                        <Link
                            to="/contact"
                            className={`sm:hidden text-sm transition-colors duration-200 ${pathname === '/contact' ? 'font-semibold text-[#1C1917]' : 'text-[#78716C]'}`}
                        >
                            Contact
                        </Link>
                        <button
                            className="sm:hidden flex items-center justify-center cursor-pointer"
                            style={{ color: '#78716C', background: 'none', border: 'none', padding: 2 }}
                            onClick={() => setOpen((v) => !v)}
                            aria-label={open ? 'Close menu' : 'Open menu'}
                        >
                            {open ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: MENU_DURATION_S, ease: STRONG_EASE_OUT } }}
                        exit={{ opacity: 0, y: -6, transition: { duration: 0.18, ease: 'easeIn' } }}
                        className="sm:hidden fixed left-0 right-0 z-40"
                        style={{
                            top: 53, // navbar height
                            background: 'rgba(247,245,240,0.97)',
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                            borderBottom: '1px solid rgba(28,25,23,0.1)',
                            padding: '20px 24px 24px',
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}
                    >
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {[...leftLinks.slice(1), ...rightLinks].map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} className={mobileLinkClass(to)}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <a
                                    href={RESUME_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-base text-[#78716C] transition-colors duration-200 py-0.5"
                                    onClick={() => setOpen(false)}
                                >
                                    Resume
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

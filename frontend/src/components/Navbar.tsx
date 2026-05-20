import { Link, useLocation } from 'react-router-dom';

interface NavLink {
    to: string;
    label: string;
}

export default function Navbar() {
    const { pathname } = useLocation();

    const leftLinks: NavLink[] = [
        { to: '/', label: 'Joonseo' },
        { to: '/about', label: 'About' },
        { to: '/portfolio', label: 'Portfolio' },
        { to: '/experience', label: 'Experience' },
    ];
    const rightLinks: NavLink[] = [{ to: '/contact', label: 'Contact' }];

    // Links hidden on small screens to prevent overflow
    const mobileHidden = new Set(['/portfolio', '/experience']);

    const itemClass = (to: string) =>
        `text-sm tracking-wide transition-all duration-200 pb-1 border-b ${pathname === to
            ? 'font-semibold border-[#1C1917] text-[#1C1917]'
            : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
        }`;

    return (
        <nav
            className="relative z-50 px-6 py-4"
            style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                background: 'rgba(247,245,240,0.88)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(28,25,23,0.08)',
            }}
        >
            <div className="flex items-center justify-between">
                <ul className="flex items-center space-x-6">
                    {leftLinks.map(({ to, label }) => (
                        <li key={to} className={mobileHidden.has(to) ? 'hidden sm:block' : ''}>
                            <Link to={to} className={itemClass(to)}>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <ul className="flex items-center space-x-6">
                    <li className="hidden sm:block">
                        <a
                            href="https://afnodznejysfclenphzg.supabase.co/storage/v1/object/public/Resume/RESUME.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm tracking-wide transition-all duration-200 pb-1 border-b border-transparent text-[#78716C] hover:text-[#1C1917]"
                        >
                            Resume
                        </a>
                    </li>
                    {rightLinks.map(({ to, label }) => (
                        <li key={to}>
                            <Link to={to} className={itemClass(to)}>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

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
        { to: '/resume', label: 'Resume' },
    ];
    const rightLinks: NavLink[] = [{ to: '/contact', label: 'Contact' }];

    const itemClass = (to: string) =>
        `text-sm tracking-wide transition-all duration-200 pb-1 border-b ${
            pathname === to
                ? 'font-semibold border-[#c8d8ff] text-[#e8eeff]'
                : 'opacity-50 hover:opacity-90 border-transparent text-[#c8d8ff]'
        }`;

    return (
        <nav
            className="relative z-50 font-sans px-6 py-4"
            style={{
                background: 'rgba(3,3,15,0.75)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(200,216,255,0.08)',
            }}
        >
            <div className="flex items-center justify-between">
                <ul className="flex items-center space-x-6">
                    {leftLinks.map(({ to, label }) => (
                        <li key={to}>
                            <Link to={to} className={itemClass(to)}>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <ul className="flex items-center space-x-6">
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

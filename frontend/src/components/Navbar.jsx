import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const { pathname } = useLocation();
    const leftLinks = [
        { to: '/', label: 'Joonseo' },
        { to: '/about', label: 'About' },
        { to: '/portfolio', label: 'Portfolio' },
        { to: '/experience', label: 'Experience' },
        { to: '/resume', label: 'Resume' },
    ];
    const rightLinks = [{ to: '/contact', label: 'Contact' }];

    const itemClass = (to) =>
        `text-sm tracking-wide transition-all duration-200 pb-1 border-b-2 ${pathname === to
            ? 'opacity-100 font-semibold border-indigo-200 text-slate-100'
            : 'opacity-70 hover:opacity-100 border-transparent text-slate-300'
        }`;

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans px-6 py-4 shadow-md shadow-black/30">
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

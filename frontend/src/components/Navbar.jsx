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
        `text-lg transition-all duration-200 pb-1 border-b-2 ${
            pathname === to
                ? 'opacity-100 font-bold border-white'
                : 'opacity-75 hover:opacity-90 border-transparent'
        }`;

    return (
        <nav className="bg-gradient-to-r text-black font-sans p-4 shadow-md">
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

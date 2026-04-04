import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../../components/UserAvatar';
import { BrandMark } from '../../components/BrandMark';

const navItems = [
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'How it works', href: '#how-it-works', id: 'how-it-works' },
  { label: 'Security', href: '#security', id: 'security' },
];

const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.scrollY + Math.min(window.innerHeight * 0.5, 420);
      const activeSection = navItems.reduce((current, item) => {
        const section = document.getElementById(item.id);
        const sectionTop = section ? section.getBoundingClientRect().top + window.scrollY : Infinity;
        return sectionTop <= marker ? item.id : current;
      }, '');
      setActiveId(activeSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const goToSection = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const linkClass = (id: string) =>
    `text-sm font-semibold transition ${
      activeId === id ? 'text-[#ffdc45]' : 'text-[#aebed4] hover:text-white'
    }`;

  const renderAuthActions = (compact = false) => {
    if (isLoading) {
      return <div className="h-9 w-28 animate-pulse rounded-md bg-white/10" />;
    }

    if (isAuthenticated) {
      return (
        <Link
          to="/dashboard"
          onClick={() => setMenuOpen(false)}
          className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#ffdc45] text-[#102039] font-semibold leading-none hover:bg-[#ffe675] transition ${
            compact ? 'h-11 w-full text-sm' : 'h-9 px-3.5 text-xs'
          }`}
        >
          <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} size={compact ? 22 : 20} />
          <span>Dashboard</span>
          <FiArrowRight className="text-sm opacity-80" />
        </Link>
      );
    }

    return (
      <div className={`flex items-center ${compact ? 'flex-col gap-2 w-full' : 'gap-2'}`}>
        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
              className={`font-semibold text-[#d7e1ef] hover:text-white transition ${
            compact
                ? 'h-11 w-full rounded-md border border-white/20 flex items-center justify-center text-sm'
                : 'text-sm px-3'
          }`}
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={() => setMenuOpen(false)}
          className={`inline-flex items-center justify-center bg-[#ffdc45] hover:bg-[#ffe675] text-[#102039] font-semibold leading-none rounded-md transition ${
            compact ? 'h-11 w-full text-sm' : 'h-9 px-4 text-xs'
          }`}
        >
          Start a board
        </Link>
      </div>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-white/10 bg-[#06182c]/95 backdrop-blur-xl'
          : 'border-b border-white/10 bg-[#071a2f]'
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link
          to="/"
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 transition hover:opacity-80"
        >
          <BrandMark inverse />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                goToSection(item.id);
              }}
              className={linkClass(item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {renderAuthActions()}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-[#d7e1ef] transition hover:bg-white/10 hover:text-white md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#071a2f] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  goToSection(item.id);
                }}
                className={`rounded-xl px-3 py-3 ${linkClass(item.id)} ${
                  activeId === item.id ? 'bg-white/10' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
              {renderAuthActions(true)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

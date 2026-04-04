import { Link } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-[#061526] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <Link to="/" className="inline-flex transition hover:opacity-75">
            <BrandMark inverse />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold text-[#aebed4] sm:justify-start">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
            <a href="#security" className="transition hover:text-white">Security</a>
          </div>

          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="flex h-9 items-center justify-center rounded-md border border-[#58718a] px-5 text-xs font-bold text-white transition hover:border-white"
          >
            {isAuthenticated ? "Dashboard" : "Sign In"}
          </Link>
        </div>
        <div className="mt-7 border-t border-white/10 pt-5 text-center text-xs text-[#73869c] sm:text-left">
          <p>© 2026 BoardWave</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { FiArrowRight, FiDownload, FiLock, FiZap } from "react-icons/fi";
import { Reveal } from "../Reveal";
import HeroVisual from "./HeroVisual";

interface HeroProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

const Hero = ({ onCreateRoom, onJoinRoom }: HeroProps) => {
  return (
    <section className="relative overflow-hidden border-b border-[#14304d] bg-[#071a2f] px-4 py-8 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(42,112,179,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(42,112,179,.16)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(14,112,203,.15),transparent_68%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 sm:gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#51a9ff]">Real-time collaboration</p>
          <h1 className="font-display mt-4 text-[3.15rem] font-extrabold leading-[0.95] sm:text-6xl lg:text-[4.8rem]">
            Board<span className="text-[#ffdc45]">Wave</span>
          </h1>
          <h2 className="font-display mt-5 max-w-xl text-2xl font-bold leading-tight text-[#eef5ff] sm:text-3xl">
            See the idea. Hear the team. Move the work.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#aebed4]">
            BoardWave combines a live canvas and team conversation, so you can brainstorm, explain ideas, and make decisions, all in one place.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onCreateRoom}
              className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#ffdc45] px-6 text-sm font-bold text-[#102039] transition hover:bg-[#ffe675]"
            >
              Start a board
              <FiArrowRight />
            </button>
            <button
              type="button"
              onClick={onJoinRoom}
              className="flex h-12 items-center justify-center rounded-md border border-[#7890aa] bg-transparent px-6 text-sm font-bold text-white transition hover:border-white hover:bg-white/5"
            >
              Join with a room code
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#d5e0ee]">
            <span className="flex items-center gap-2"><FiZap className="text-[#ffdc45]" />Free to start</span>
            <span className="flex items-center gap-2"><FiDownload className="text-[#ffdc45]" />Nothing to install</span>
            <span className="flex items-center gap-2"><FiLock className="text-[#ffdc45]" />Private rooms</span>
          </div>
        </Reveal>

        <Reveal className="relative mx-auto w-full max-w-3xl" delay={0.12}>
          <div className="absolute -inset-3 rounded-xl border border-[#1b4f7f]/60" />
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;

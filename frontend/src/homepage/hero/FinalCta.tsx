import { FiArrowRight } from 'react-icons/fi';

interface FinalCtaProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

const FinalCta = ({ onCreateRoom, onJoinRoom }: FinalCtaProps) => (
  <section className="relative overflow-hidden border-y border-[#284965] px-4 py-10 text-white sm:px-6 lg:px-10">
    <div className="absolute inset-0 bg-[#071a2f]" />
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(81,169,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(81,169,255,.18)_1px,transparent_1px)] [background-size:42px_42px]" />
    <div className="absolute -right-24 top-1/2 h-64 w-64 -translate-y-1/2 rotate-12 border-[32px] border-[#0d6efd]/15" />
    <div className="relative mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
      <h2 className="font-display max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
        Turn the next conversation<br className="hidden sm:block" /> into something everyone can see.
      </h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onCreateRoom} className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#ffdc45] px-7 text-sm font-bold text-[#102039] hover:bg-[#ffe675]">
          Start a board <FiArrowRight />
        </button>
        <button type="button" onClick={onJoinRoom} className="h-12 rounded-md border border-[#91a6bc] px-7 text-sm font-bold text-white hover:border-white hover:bg-white/5">
          Join a room
        </button>
      </div>
    </div>
  </section>
);

export default FinalCta;
import { FiCircle, FiEdit3, FiMousePointer, FiSquare, FiType, FiVideo } from 'react-icons/fi';
import minaPortrait from '../../assets/call-mina.jpg';
import davidPortrait from '../../assets/call-david.jpg';
import alexPortrait from '../../assets/call-alex.jpg';

const participants = [
  { name: 'Mina', image: minaPortrait },
  { name: 'David', image: davidPortrait },
  { name: 'Alex', image: alexPortrait },
];

const HeroVisual = () => (
  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#315476] bg-[#eef4f8] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
    <div className="flex h-10 items-center justify-between bg-[#091a30] px-3 text-[9px] text-[#c9d6e5] sm:px-4 sm:text-[10px]">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#35d28b]" />
        <span className="font-bold text-white">Product roadmap</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline">4 people live</span>
        <div className="flex -space-x-1.5">
          {participants.map((participant) => (
            <img
              key={participant.name}
              src={participant.image}
              alt=""
              className="h-5 w-5 rounded-full border border-[#091a30] object-cover"
            />
          ))}
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 top-10 flex w-9 flex-col items-center gap-3 border-r border-[#d4dde7] bg-white py-3 text-[#58718a] sm:w-11">
      {[FiMousePointer, FiEdit3, FiSquare, FiCircle, FiType].map((Icon, index) => (
        <span key={index} className={`flex h-6 w-6 items-center justify-center rounded ${index === 1 ? 'bg-[#e4efff] text-[#0d6efd]' : ''}`}><Icon size={13} /></span>
      ))}
    </div>

    <div className="absolute bottom-0 left-9 right-20 top-10 overflow-hidden bg-[#f8fafc] sm:left-11 sm:right-28">
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(#b8c5d3_1px,transparent_1px)] [background-size:14px_14px]" />
      <p className="absolute left-[8%] top-[9%] rotate-[-2deg] font-display text-xs font-extrabold text-[#193552] sm:text-base">Project roadmap</p>
      <div className="absolute left-[9%] top-[29%] w-[24%] rotate-[-3deg] bg-[#ffdc45] p-2 text-[7px] font-bold text-[#443900] shadow-md sm:p-3 sm:text-[10px]">Research & insights</div>
      <div className="absolute left-[38%] top-[35%] w-[22%] rotate-2 bg-[#82d9b2] p-2 text-[7px] font-bold text-[#143d30] shadow-md sm:p-3 sm:text-[10px]">Design sprint</div>
      <div className="absolute left-[66%] top-[28%] w-[19%] rotate-[-2deg] bg-[#8ab8ff] p-2 text-[7px] font-bold text-[#163a70] shadow-md sm:p-3 sm:text-[10px]">Build MVP</div>
      <div className="absolute left-[27%] top-[62%] w-[21%] rotate-1 bg-[#ff9fb0] p-2 text-[7px] font-bold text-[#6b2030] shadow-md sm:p-3 sm:text-[10px]">User testing</div>
      <div className="absolute left-[61%] top-[66%] w-[23%] rotate-3 bg-[#c3a4ff] p-2 text-[7px] font-bold text-[#38206b] shadow-md sm:p-3 sm:text-[10px]">Launch</div>
      <span className="absolute left-[31%] top-[42%] h-px w-[9%] rotate-6 bg-[#7590ad]" />
      <span className="absolute left-[57%] top-[45%] h-px w-[10%] -rotate-6 bg-[#7590ad]" />
      <div className="absolute bottom-[13%] left-[11%] rounded-full bg-[#0d6efd] px-2 py-1 text-[6px] font-bold text-white sm:text-[8px]">Sarah</div>
      <FiMousePointer className="absolute bottom-[8%] left-[18%] text-[#0d6efd]" />
      <div className="absolute right-[8%] top-[10%] rounded-md border border-[#bdc9d7] bg-white p-2 text-[6px] text-[#41536a] shadow-sm sm:text-[8px]">
        <p className="mb-1 font-bold text-[#172033]">Next steps</p>
        <p>✓ Finalize scope</p><p>○ Assign owners</p><p>○ Review Friday</p>
      </div>
    </div>

    <div className="absolute bottom-0 right-0 top-10 flex w-20 flex-col gap-2 border-l border-[#294968] bg-[#0b2038] p-2 sm:w-28">
      {participants.map((participant) => (
        <div key={participant.name} className="relative flex-1 overflow-hidden rounded bg-[#10243c]">
          <img
            src={participant.image}
            alt={`${participant.name} with camera on`}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#0d6efd] text-white sm:h-4 sm:w-4">
            <FiVideo size={8} />
          </span>
          <span className="absolute bottom-1 left-1 rounded bg-black/65 px-1 text-[5px] font-bold text-white sm:text-[7px]">{participant.name}</span>
          <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-[#35d28b]" />
        </div>
      ))}
    </div>

    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#10243c] px-3 py-2 text-white shadow-lg">
      <FiVideo size={11} /><FiEdit3 size={11} /><FiSquare size={11} />
    </div>
  </div>
);

export default HeroVisual;

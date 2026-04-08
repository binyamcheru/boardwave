import { FiCheck, FiShield, FiUser, FiUsers } from 'react-icons/fi';

const Security = () => (
  <section id="security" className="scroll-mt-20 border-t border-white/10 bg-[#061526] px-4 py-12 text-white sm:px-6 lg:px-10">
    <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[0.9fr_1.1fr_0.8fr]">
      <div className="flex items-center justify-center gap-4 rounded-md border border-[#1b4b78] bg-[#071d34] p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#1f5b90] text-[#4da7ff]"><FiUser size={22} /></div>
        <span className="w-8 border-t border-dashed border-[#4da7ff]" />
        <span className="rounded-full border border-[#2a6598] px-3 py-1.5 text-xs font-bold">WebRTC</span>
        <span className="w-8 border-t border-dashed border-[#4da7ff]" />
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#1f5b90] text-[#4da7ff]"><FiUsers size={22} /></div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#51a9ff]">Privacy and technology</p>
        <h2 className="font-display mt-2 text-2xl font-extrabold">Direct, controlled, and secure.</h2>
        <p className="mt-3 max-w-xl text-xs leading-5 text-[#aebed4]">
          Media communication uses WebRTC for direct peer-to-peer connections, so your calls stay fast and reliable. Rooms have controlled access, so only invited people can join.
        </p>
      </div>

      <div className="grid grid-cols-[48px_1fr] items-center gap-5 lg:border-l lg:border-white/10 lg:pl-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b2c4c] text-[#4da7ff]"><FiShield size={24} /></div>
        <ul className="space-y-2 text-xs text-[#d2deeb]">
          {['Peer-to-peer video and audio', 'Controlled room access', 'You’re in control of who joins'].map((item) => (
            <li key={item} className="flex items-center gap-2"><FiCheck className="text-[#51a9ff]" />{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Security;
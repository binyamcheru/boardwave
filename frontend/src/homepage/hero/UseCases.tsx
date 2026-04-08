import { FiBookOpen, FiCode, FiMessageCircle, FiMonitor, FiTarget, FiUsers } from 'react-icons/fi';

const useCases = [
  { icon: FiTarget, title: 'Product planning', copy: 'Align on goals, map features, and make decisions together.' },
  { icon: FiCode, title: 'Architecture diagrams', copy: 'Visualize systems, discuss tradeoffs, and keep everyone aligned.' },
  { icon: FiMessageCircle, title: 'Design critiques', copy: 'Share designs, gather feedback, and iterate in real time.' },
  { icon: FiBookOpen, title: 'Remote teaching', copy: 'Make lessons interactive with live collaboration.' },
  { icon: FiUsers, title: 'Team retrospectives', copy: 'Reflect, discuss, and plan what comes next.' },
  { icon: FiMonitor, title: 'Client workshops', copy: 'Collaborate on ideas and build shared understanding.' },
];

const UseCases = () => (
  <section className="bg-[#071a2f] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-16">
    <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.62fr_1.38fr] lg:gap-14">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#51a9ff]">Real work. Real teams.</p>
        <h2 className="font-display mt-2 text-3xl font-extrabold">Use Cases</h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-[#aebed4]">
          From planning to teaching, BoardWave fits your workflow and your team’s needs.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="grid min-h-28 grid-cols-[38px_1fr] gap-3 rounded-md border border-[#163a5d] bg-[#0b2540] p-4 transition duration-200 hover:-translate-y-1 hover:border-[#2b6598] hover:bg-[#0d2b49]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d3155] text-[#4da7ff]">
              <Icon size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#f3f7fc]">{title}</h3>
              <p className="mt-2 text-[11px] leading-4 text-[#9eafc3]">{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default UseCases;
import { FiClock, FiEdit3, FiGrid, FiLock, FiUsers, FiVideo } from "react-icons/fi";

const features = [
  {
    icon: FiEdit3,
    title: "Real-time canvas synchronization",
    description: "Everyone sees changes instantly, no matter where they are.",
  },
  {
    icon: FiVideo,
    title: "Video and audio in context",
    description: "See and hear your team while working on the same canvas.",
  },
  {
    icon: FiUsers,
    title: "Live collaborator presence",
    description: "See who is in the room and where they are working.",
  },
  {
    icon: FiLock,
    title: "Private room access",
    description: "Keep your ideas and conversations in a controlled space.",
  },
  {
    icon: FiClock,
    title: "Saved snapshots and version history",
    description: "Capture key moments and go back to earlier versions.",
  },
  {
    icon: FiGrid,
    title: "Dashboard for managing boards",
    description: "Find, organize, and reopen your boards anytime.",
  },
];

const Features = () => {
  return (
    <section id="features" className="scroll-mt-20 bg-[#071a2f] px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-7 border-b border-white/15 pb-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#51a9ff]">Built for collaboration</p>
            <h2 className="font-display mt-2 max-w-md text-3xl font-extrabold leading-tight">
              Powerful features for<br />real teamwork.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#b2c1d3]">
            Everything you need to brainstorm, build, and make decisions without the hassle of multiple tools.
          </p>
        </div>

        <div className="mt-2 grid md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group grid grid-cols-[44px_1fr] gap-4 border-b border-white/15 py-7 transition md:px-6 md:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:px-7 lg:first:pl-0"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#24619a] bg-[#0c2b49] text-[#51a9ff] transition duration-200 group-hover:-translate-y-1 group-hover:border-[#51a9ff] group-hover:text-white">
                  <Icon size={19} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f3f7fc]">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#9eafc3]">{feature.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
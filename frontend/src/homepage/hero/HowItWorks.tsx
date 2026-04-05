import { FiArrowRight, FiEdit3, FiLink2, FiSave, FiUsers } from "react-icons/fi";

const steps = [
  {
    number: "01",
    icon: FiLink2,
    title: "Open a room",
    description: "Start with a blank canvas and a private room code.",
  },
  {
    number: "02",
    icon: FiUsers,
    title: "Bring the team",
    description: "Share one link. Everyone arrives on the same page.",
  },
  {
    number: "03",
    icon: FiEdit3,
    title: "Work it through",
    description: "Draw, talk, point, revise, and decide together in real time.",
  },
  {
    number: "04",
    icon: FiSave,
    title: "Keep the outcome",
    description: "Save the board and return to the thinking whenever you need it.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-[#f7f9fc] px-4 py-14 text-[#172033] sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087af5]">Get started in minutes</p>
          <h2 className="font-display mt-2 text-3xl font-extrabold">How It Works</h2>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="relative flex flex-col items-center text-center sm:items-start sm:text-left lg:pr-10">
                <div className="flex items-center justify-center gap-4 sm:justify-start">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d6efd] text-xs font-bold text-white">{index + 1}</span>
                  <Icon className="text-xl text-[#15314f]" />
                </div>
                {index < steps.length - 1 && <FiArrowRight className="absolute right-4 top-2 hidden text-[#9dc3ee] lg:block" />}
                <h3 className="mt-4 text-sm font-extrabold">{step.title}</h3>
                <p className="mt-2 max-w-[230px] text-xs leading-5 text-[#68768a]">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
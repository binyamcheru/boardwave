import { FiArrowDown, FiFileText, FiGitBranch, FiMessageSquare, FiVideo } from 'react-icons/fi';

const ProblemSolution = () => (
  <section className="bg-[#f7f9fc] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
    <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.8fr_1fr]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087af5]">The problem</p>
        <h2 className="font-display mt-2 max-w-sm text-3xl font-extrabold leading-tight text-[#11243c]">
          Too many tools,<br />not enough context.
        </h2>
        <p className="mt-5 max-w-md text-sm leading-6 text-[#617087]">
          Meetings, diagrams, notes, and decisions often live in separate tools. By the time you switch between them, valuable context is lost and ideas get diluted.
        </p>
      </div>

      <div className="hidden border-x border-[#d7e0eb] px-8 lg:block">
        <div className="flex items-center justify-center gap-2">
          {[FiVideo, FiFileText, FiMessageSquare, FiGitBranch].map((Icon, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#d3dfed] bg-white text-[#087af5]">
                <Icon size={19} />
              </div>
              {index < 3 && <span className="text-[#a5b3c4]">+</span>}
            </div>
          ))}
        </div>
        <FiArrowDown className="mx-auto my-3 text-xl text-[#7392b5]" />
        <div className="mx-auto w-fit -rotate-3 bg-[#ffdc45] px-4 py-2 font-display text-lg font-extrabold text-[#3b3200] shadow-sm">
          Lost context
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087af5]">The solution</p>
        <h2 className="font-display mt-2 text-3xl font-extrabold leading-tight text-[#11243c]">Everything together.</h2>
        <p className="mt-5 max-w-md text-sm leading-6 text-[#617087]">
          BoardWave keeps your discussion and visual work in the same space. Talk, draw, and decide without switching apps.
        </p>
      </div>
    </div>
  </section>
);

export default ProblemSolution;
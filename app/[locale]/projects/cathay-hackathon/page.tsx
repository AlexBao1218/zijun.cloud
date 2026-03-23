import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CathayHackathonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEN = locale === "en";

  return (
    <main className="pt-32 px-8 md:px-20 pb-24">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#3d2b1f]/30 hover:text-[#3d2b1f]/55 transition-colors mb-12"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {isEN ? "Back to Projects" : "返回项目列表"}
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 text-sm text-[#3d2b1f]/35 mb-6">
            <span>2025</span>
            <span className="text-[#3d2b1f]/15">·</span>
            <span className="text-[#b85c38]/50">Hackathon · Finalist</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#3d2b1f] mb-4">Cathay Cargo ULD Optimizer</h1>
          <p className="text-lg text-[#3d2b1f]/45 leading-relaxed max-w-lg">
            {isEN
              ? "A 2D drag-and-drop ULD load planning platform for air cargo. Built in 24 hours during the Cathay Cargo Hackathon final at Cathay City."
              : "民航货机 ULD 配载可视化平台。24小时黑客松决赛现场，在国泰城完成开发。"}
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">{isEN ? "The Challenge" : "挑战"}</h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "Cathay Cargo Terminal aspires to set the global benchmark for air cargo excellence through cutting-edge technology. The challenge: how might we harness AI, computer vision, and emerging technologies to enhance cargo handling with efficiency and sustainability?"
                : "国泰货运站希望以尖端技术确立全球货运卓越标杆。挑战：如何利用 AI、计算机视觉和新兴技术提升货运处理效率与可持续性？"}
            </p>
            <p>
              {isEN
                ? "Our team of HKU Industrial Engineering students pitched an idea we knew well from the IGC internship: the predictive maintenance model applied to cargo logistics. We extended this with IoT sensors on high-value cargo (pharmaceuticals, special declarations) to detect anomalies in real-time and trigger early warnings."
                : "我们团队由港大工业工程学生组成，在 IGC 实习中接触过预测性维护模型，我们把这个思路延伸到货运物流：对高价值货物（医药、特殊报备货物）加装 IoT 传感器，实时检测��常并提前预警。"}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">{isEN ? "The Product" : "产品"}</h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "A 2D ULD (Unit Load Device) intelligent load planning platform. The UI mimics a Tetris-like packing game: the left panel shows a top-down view of an empty cargo plane with ULD positions marked; the right panel shows weighed and packed cargo. Users drag items from right to left, and a data bar at the top displays the real-time Center of Gravity (CG) position."
                : "2D ULD（集装设备）智能配载平台。UI 类似装箱游戏：左侧是空货机俯视图，标注了 ULD 位置；右侧是称重打包后的货物。用户从右侧拖拽货物到左侧，顶部数据栏实时显示重心（CG）位置。"}
            </p>
            <p>
              {isEN
                ? "The backend runs a MILP (Mixed Integer Linear Programming) algorithm based on academic research — the system calculates the optimal arrangement that keeps the aircraft's CG in the ideal range. CG has a massive impact on fuel consumption, and Cathay's current load planning is surprisingly informal — a genuine pain point with real business value."
                : "后端运行基于学术论文的 MILP（混合整数线性规划）算法——系统计算最优排列方案，使飞机重心保持在理想范围。重心对燃油消耗影响巨大，而国泰目前的配载方案出人意料地随意——这是一个有真实商业价值的痛点。"}
            </p>
            <p>
              {isEN
                ? "The platform is human-in-the-loop: unexpected events and multi-leg journeys require human judgment. This is the key area for future optimization."
                : "平台采用人机协作模式：突发事件和多航段运输需要人工判断。这是未来优化的重点方向。"}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">{isEN ? "What We Learned" : "经验教训"}</h2>
          <div className="space-y-4 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "Going off-prompt on the final day was a risky decision driven by our confidence in our preliminary round work. It consumed hours of discussion time and left us without a dedicated cargo judge for feedback. Next time: time-box decisions and prepare parallel pitch decks."
                : "决赛日跳出题目做我们准备的方案是一个冒险的决定，消耗了大量讨论时间，也没有专门的货运评审给予反馈。下次：给决策设定时间限制，准备多套方案。"}
            </p>
            <p>
              {isEN
                ? "In a 24-hour hackathon, presentation prep should happen during the build phase — not after. We ran vibe coding right up to the wire, leaving too little time to polish our pitch. Even great work needs a great story."
                : "在24小时黑客松中，演示文稿应该在开发过程中同步准备，而不是等开发完成后。我们用 vibe coding 直冲到最后一刻，留给 pitch 打磨的时间太少了。再好的作品也需要讲好故事。"}
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 pt-10 border-t border-[#3d2b1f]/5">
          {["Vibe Coding", "MILP", "Operations Research", "2D Visualization", "Python", "AI", "Computer Vision"].map((tag) => (
            <span key={tag} className="text-sm text-[#3d2b1f]/30 border border-[#3d2b1f]/8 px-4 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

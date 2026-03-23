import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NeoChainPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEN = locale === "en";

  return (
    <main className="pt-24 md:pt-32 px-6 md:px-20 pb-16 md:pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#3d2b1f]/30 hover:text-[#3d2b1f]/55 transition-colors mb-8 md:mb-12"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {isEN ? "Back to Projects" : "返回项目列表"}
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-sm text-[#3d2b1f]/35 mb-6">
            <span>2025—Present</span>
            <span className="text-[#3d2b1f]/15">·</span>
            <span className="text-[#b85c38]/50">Co-founder</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#3d2b1f] mb-4">NeoChain WMS</h1>
          <p className="text-lg text-[#3d2b1f]/45 leading-relaxed max-w-lg">
            {isEN
              ? "An AI-powered Warehouse Management System designed for small and medium factories across China. Human-in-the-loop, error-proof UI running on PDA devices."
              : "为华南中小型工厂打造的 AI 驱动仓储管理系统。基于 PDA 设备的人机协作、防错机制 UI。"}
          </p>
        </div>

        {/* Project Link */}
        <a
          href="https://neochainhk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base text-[#b85c38]/60 hover:text-[#b85c38]/80 transition-colors mb-16"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          neochainhk.com
        </a>

        {/* Problem */}
        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">
            {isEN ? "The Problem" : "痛点"}
          </h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "Our team visited factories in Wenzhou and discovered a painful reality: warehouses were still running on paper checklists. Generic ERP systems from major Chinese brands (Yonyou, Kingdee) don't fit the actual workflows of these businesses. Paper forms lead to data gaps and operational blind spots — no data means no forecasting, no reorder optimization."
                : "我们团队实地走访了温州的工厂，发现了一个残酷的现实：仓库还在用纸质清单。国产大品牌的通用化 ERP 系统（用友、金蝶）并不能适配这些工厂的实际工作流程。纸质表单导致数据缺失和运营盲区——没有数据就无法预测，无法优化订货。"}
            </p>
          </div>
        </section>

        {/* Solution */}
        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">
            {isEN ? "The Solution" : "解决方案"}
          </h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "A PDA-based WMS with seven core modules: Receiving, Put-away, Pick-up, Line Inbound, Production Closing, Line Packaging, and Sales Outbound. Each workflow uses state machine logic (X-state) to ensure every step is confirmed before proceeding — creating a complete audit trail."
                : "基于 PDA 的 WMS 系统，包含七个核心模块：收货、上架、拣货、产线入库、生产结案、产线包装、销售出库。每个流程都采用状态机逻辑（X 状态），确保每一步都被确认后才能进入下一流程——形成完整的操作追溯链。"}
            </p>
            <p>
              {isEN
                ? "The system is built for the real world: workers using PDAs in noisy factory floors, with poor lighting and rushed handoffs. The UI is designed to be error-proof — you can't skip a step, you can't misconfirm a package. The data accumulated over time enables inventory optimization and predictive reorder algorithms."
                : "系统为真实场景而设计：工人在嘈杂的工厂车间里用 PDA 操作，光线差、交接急促。UI 采用防错设计——不能跳过步骤，不能错误确认。积累的数据为后续的库存优化和智能补货算法奠定基础。"}
            </p>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">
            {isEN ? "Tech Stack & AI Workflow" : "技术栈与 AI 工作流"}
          </h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "Built with Next.js + TypeScript on the frontend, Python backend for optimization algorithms. AI plays a central role in our development process itself:"
                : "前端使用 Next.js + TypeScript，后端使用 Python 优化算法。AI 在开发流程本身就扮演核心角色："}
            </p>
            <ul className="space-y-2 list-disc list-inside text-base text-[#3d2b1f]/55 pl-2">
              <li>Gemini as coding advisor for tech decisions</li>
              <li>Cursor + Plan mode for task decomposition</li>
              <li>Custom skills/SOPs for rapid module development</li>
              <li>AI memory system for tracking bug fixes and design decisions</li>
              <li>Socratic prompting for master prompt refinement</li>
            </ul>
            <p>
              {isEN
                ? "The most valuable lesson: after initially splitting work by UI/backend, we realized everyone needed end-to-end understanding. Now each person owns a complete module. This dramatically improved code consistency and reduced integration friction."
                : "最宝贵的教训：最初按前端/后端分工后发现，大家对彼此的部分都缺乏深入理解。现在每个人负责一个完整模块。这大幅提升了代码一致性，减少了集成摩擦。"}
            </p>
          </div>
        </section>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 pt-10 border-t border-[#3d2b1f]/5">
          {["Next.js", "TypeScript", "Python", "AI-Assisted Dev", "WMS", "PDA", "State Machine", "Vercel"].map((tag) => (
            <span key={tag} className="text-sm text-[#3d2b1f]/30 border border-[#3d2b1f]/8 px-4 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function IGCPage({ params }: Props) {
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
            <span className="text-[#b85c38]/50">Intern</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#3d2b1f] mb-4">IGC — Digital Twin & AI Integration</h1>
          <p className="text-lg text-[#3d2b1f]/45 leading-relaxed max-w-lg">
            {isEN
              ? "Summer internship at a prop-tech company building digital twin systems for buildings. Worked on AI knowledge bases, API design, ESG reporting, and user documentation."
              : "在一家房产科技公司暑期实习，为建筑数字孪生系统工作。负责 AI 知识库、API 设计、ESG 报告撰写和用户文档编写。"}
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">RAG Knowledge Bases</h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "Built 6 RAG (Retrieval-Augmented Generation) knowledge bases from 1,000+ building documents covering MVAC, Electrical, Plumbing, Fire Services, Lift systems, and more. The pain point: building maintenance requires specialized engineers for even minor issues, creating slow response times. The solution: an AI Agent that can answer questions by referencing the actual documentation."
                : "从1,000多份建筑文档中构建了6个 RAG（检索增强生成）知识库，覆盖暖通、电气、管道、消防、电梯等专业领域。痛点：建筑维护即使是小问题也需要专业工程师介入，响应速度慢。解决方案：一个能通过引用实际文档回答问题的 AI Agent。"}
            </p>
            <p>
              {isEN
                ? "My role was to organize and upload these documents into the AI system. I wrote Python scripts to scan the 1,000+ files, identify their category by filename, organize them into the correct folders, then batch-upload them to the agent. I tested the agent by crafting domain-specific questions to verify it could accurately locate the right documents and cite them correctly."
                : "我的职责是将这些文档整理并上传到 AI 系统。我写 Python 脚本扫描1,000多份文件，通过文件名识别类别，归档到对应文件夹，然后批量上传到 Agent。我通过设计专业问题来测试 Agent 是否能准确找到正确文档并正确引用。"}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">API Design & PRD Writing</h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "Contributed to API design for the Henderson Digital Twin project. For each feature update, I needed to understand the purpose, identify which API endpoints to use, determine polling frequency, decide how many data points to display, and specify the UI placement — essentially acting as a product manager."
                : "参与 The Henderson 数字孪生项目的 API 设计。每个功能更新都需要理解目的、选择 API 端点、确定调用频率、决定展示几条数据、指定 UI 位置——本质上是在做产品经理的工作。"}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">Building OS & Smart Housing</h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "Contributed to a smart transformation proposal for HK Housing Authority, researching technologies like NFC access control, fall detection sensors, overhead object detection, and parking space monitoring. The proposal centered on Building OS — a unified interface integrating all building management data, resident management, predictive maintenance, and energy optimization."
                : "为香港房屋委员会撰写智慧改造方案，研究了 NFC 门禁、跌倒检测传感器、高空抛物检测、车位监测等技术。方案核心是 Building OS——一个整合所有建筑管理数据、住户管理、预测性维护和节能优化的统一平台。"}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">ESG Energy-Saving Model</h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            <p>
              {isEN
                ? "When IGC needed compelling ESG data for an ICT Awards application but had no historical baseline (the system was just launched), I designed a 'horizontal benchmarking' approach: comparing theoretical energy consumption from EMSD benchmarks against actual electricity bills, adjusted for real occupancy rates (73%). This model was iteratively refined through consultation with senior PMs and successfully defended to both internal teams and clients."
                : '当 IGC 需要为 ICT Awards 申请提供有说服力的 ESG 数据，但系统刚上线没有历史基线时，我设计了一套「横向对标」方案：结合 EMSD 官方基准与实际入住率（73%），将理论能耗与实际电费单对比。这个模型经过与资深 PM 的多轮咨询迭代后，成功向内部团队和客户双方达成认可。'}
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 pt-10 border-t border-[#3d2b1f]/5">
          {["RAG", "AI Agent", "Python", "API Design", "Digital Twin", "ESG", "PRD Writing", "User Documentation"].map((tag) => (
            <span key={tag} className="text-sm text-[#3d2b1f]/30 border border-[#3d2b1f]/8 px-4 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

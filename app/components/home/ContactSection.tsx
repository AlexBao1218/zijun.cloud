import { loadContent } from "@/lib/content";
import OffsetBox from "@/app/components/OffsetBox";

type ContactContent = {
  mailLabel: string;
  email: string;
  githubLabel: string;
  githubUrl: string;
  cvLabel: string;
  cvUrl: string;
  footer: string;
};

export default async function ContactSection({ locale }: { locale: string }) {
  const c = await loadContent<ContactContent>("contact", locale);
  return (
    <footer className="border-t border-ink">
      <div className="px-5 md:px-10 py-12 md:py-16 max-w-6xl mx-auto flex flex-wrap items-center gap-x-8 gap-y-6">
        <OffsetBox blockClass="bg-ink" offset={8} className="inline-block">
          <a href={`mailto:${c.email}`} className="block bg-fill px-4 py-2.5 text-[13px] font-medium">
            {c.mailLabel} {c.email}
          </a>
        </OffsetBox>
        <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] underline decoration-1 underline-offset-4 hover:decoration-2">
          {c.githubLabel}
        </a>
        <a href={c.cvUrl} download className="text-[13px] underline decoration-1 underline-offset-4 hover:decoration-2">
          {c.cvLabel}
        </a>
      </div>
      <p className="px-5 md:px-10 pb-8 text-[11px] text-ink/60 max-w-6xl mx-auto">{c.footer}</p>
    </footer>
  );
}

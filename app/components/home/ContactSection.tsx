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
      <div className="px-6 md:px-20 py-20 md:py-28 max-w-[1400px] mx-auto flex flex-wrap items-center gap-x-10 gap-y-6">
        <OffsetBox blockClass="bg-ink" offset={8} className="inline-block">
          <a href={`mailto:${c.email}`} className="block bg-fill px-5 py-3 text-[14px] font-medium">
            {c.mailLabel} {c.email}
          </a>
        </OffsetBox>
        <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[14px] underline decoration-1 underline-offset-4 hover:decoration-2">
          {c.githubLabel}
        </a>
        <a href={c.cvUrl} download className="text-[14px] underline decoration-1 underline-offset-4 hover:decoration-2">
          {c.cvLabel}
        </a>
      </div>
      <p className="px-6 md:px-20 pb-10 text-[12px] text-ink/60 max-w-[1400px] mx-auto">{c.footer}</p>
    </footer>
  );
}

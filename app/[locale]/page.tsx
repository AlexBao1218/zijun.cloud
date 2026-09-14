import { setRequestLocale } from "next-intl/server";
import Hero from "@/app/components/home/Hero";
import WorkGrid from "@/app/components/home/WorkGrid";
import SkillsSection from "@/app/components/home/SkillsSection";
import AboutSection from "@/app/components/home/AboutSection";
import ContactSection from "@/app/components/home/ContactSection";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <main>
        <Hero locale={locale} />
        <WorkGrid locale={locale} />
        <SkillsSection locale={locale} />
        <AboutSection locale={locale} />
      </main>
      <ContactSection locale={locale} />
    </>
  );
}

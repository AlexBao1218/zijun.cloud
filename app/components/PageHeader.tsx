type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  subtitleClassName?: string;
};

export default function PageHeader({ eyebrow, title, subtitle, subtitleClassName }: Props) {
  return (
    <>
      <p className="text-[13px] tracking-[0.3em] uppercase text-[#b85c38]/60 mb-4">
        {eyebrow}
      </p>
      <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#3d2b1f] mb-3">
        {title}
      </h1>
      <p className={subtitleClassName ?? "text-sm md:text-base text-[#3d2b1f]/40 mb-12 md:mb-16"}>
        {subtitle}
      </p>
    </>
  );
}

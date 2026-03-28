type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionContainer({ children, className }: Props) {
  return (
    <main className={`pt-24 md:pt-32 px-6 md:px-20 pb-16 md:pb-24 ${className ?? ""}`}>
      <div className="max-w-2xl mx-auto">
        {children}
      </div>
    </main>
  );
}

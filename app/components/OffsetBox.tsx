type Props = {
  /** Tailwind background class for the block behind the face, e.g. "bg-towngas" or "bg-ink". */
  blockClass: string;
  children: React.ReactNode;
  className?: string;
  /** Offset in px; face slides to 0 on hover. */
  offset?: 8 | 12;
};

export default function OffsetBox({ blockClass, children, className = "", offset = 12 }: Props) {
  const off = offset === 8 ? "top-2 left-2 mr-2 mb-2" : "top-3 left-3 mr-3 mb-3";
  return (
    <div className={`${blockClass} ${className}`}>
      <div
        className={`relative ${off} border border-ink bg-paper transition-[top,left] duration-300 ease-in-out hover:top-0 hover:left-0 focus-within:top-0 focus-within:left-0`}
      >
        {children}
      </div>
    </div>
  );
}

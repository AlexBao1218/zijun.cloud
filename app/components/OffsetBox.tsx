type Props = {
  /** Tailwind background class for the block behind the face, e.g. "bg-towngas" or "bg-ink". */
  blockClass: string;
  children: React.ReactNode;
  className?: string;
  /** Offset in px; face slides to 0 on hover. Cards use 16 (the reference's 1em), buttons 8. */
  offset?: 8 | 12 | 16;
};

const OFFSETS = {
  8: "top-2 left-2 mr-2 mb-2",
  12: "top-3 left-3 mr-3 mb-3",
  16: "top-4 left-4 mr-4 mb-4",
} as const;

export default function OffsetBox({ blockClass, children, className = "", offset = 16 }: Props) {
  return (
    <div className={`${blockClass} ${className}`}>
      <div
        className={`relative ${OFFSETS[offset]} border border-ink bg-paper transition-[top,left] duration-300 ease-in-out hover:top-0 hover:left-0 focus-within:top-0 focus-within:left-0`}
      >
        {children}
      </div>
    </div>
  );
}

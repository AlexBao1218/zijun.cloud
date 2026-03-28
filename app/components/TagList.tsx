type Props = {
  tags: string[];
  size?: "sm" | "base";
};

export default function TagList({ tags, size = "sm" }: Props) {
  const sizeClasses = size === "sm"
    ? "text-xs px-3 py-1.5"
    : "text-sm px-4 py-1.5";

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`${sizeClasses} text-[#3d2b1f]/40 border border-[#3d2b1f]/8 rounded-full`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

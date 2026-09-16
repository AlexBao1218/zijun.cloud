/* Shared geometry for the handwritten margin notes (PhotoNotes, WorkHint): first-line measurement, line paths, arrowheads. */

/** Width of a note's first line in the handwriting face, measured with a throwaway span so the arrow can start right after it. */
export function firstLineWidth(host: HTMLElement, text: string) {
  const probe = document.createElement("span");
  probe.className = "font-hand text-[30px]";
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none";
  probe.textContent = text.split("\n")[0];
  host.appendChild(probe);
  const w = probe.getBoundingClientRect().width;
  probe.remove();
  return w;
}

/** A level line: leaves the text horizontally and arrives at the target horizontally, with only a slight sag between. */
export function levelPath(sx: number, sy: number, ex: number, ey: number) {
  const dir = ex >= sx ? 1 : -1; // +1 when the target is to the right of the text
  const reach = Math.abs(ex - sx);
  // both control points sit a little below the lower end, so the line sags like a U (open upward) and never arches
  const sag = Math.max(sy, ey) + Math.min(16, reach * 0.12);
  const c1x = sx + dir * reach * 0.35, c1y = sag;
  const c2x = ex - dir * reach * 0.35, c2y = sag;
  return `M${sx} ${sy} C${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`;
}

/** A line that leaves the text level, then bends up and arrives at the target vertically. */
export function upPath(sx: number, sy: number, ex: number, ey: number) {
  const rise = sy - ey;
  return `M${sx} ${sy} C${sx + (ex - sx) * 0.8} ${sy} ${ex} ${ey + rise * 0.6} ${ex} ${ey}`;
}

/** Arrowhead at (ex, ey) pointing the way the line arrives. */
export function head(ex: number, ey: number, dir: "right" | "left" | "up") {
  if (dir === "up") return `M${ex - 5} ${ey + 9} L${ex} ${ey} L${ex + 5} ${ey + 9}`;
  const hx = dir === "right" ? ex - 9 : ex + 9;
  return `M${hx} ${ey - 5} L${ex} ${ey} L${hx} ${ey + 5}`;
}

import { cache } from "react";
import fs from "fs/promises";
import path from "path";

export const loadContent = cache(
  async <T>(section: string, locale: string): Promise<T> => {
    const filePath = path.join(process.cwd(), "content", section, `${locale}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  }
);

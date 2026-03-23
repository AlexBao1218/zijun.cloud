"use client";

import { useState } from "react";

type Props = {
  locale: string;
};

export default function CopyEmailButton({ locale }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("zijun.bao@outlook.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = "zijun.bao@outlook.com";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group w-full text-left"
    >
      <div className="flex items-center justify-between py-5 border-b border-[#3d2b1f]/5 group-hover:border-[#b85c38]/20 transition-colors">
        <div>
          <p className="text-xs text-[#3d2b1f]/30 mb-1 tracking-wide">Email</p>
          <p className="text-lg text-[#3d2b1f]/70 group-hover:text-[#b85c38]/80 transition-colors font-light">
            zijun.bao@outlook.com
          </p>
        </div>
        <div className="w-10 h-10 rounded-full border border-[#3d2b1f]/5 flex items-center justify-center text-[#3d2b1f]/20 group-hover:border-[#b85c38]/30 group-hover:text-[#b85c38]/50 transition-all group-hover:scale-110 relative">
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
          {/* Tooltip */}
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-[#b85c38]/70 bg-[#faf9f7] px-2 py-1 rounded whitespace-nowrap">
              {locale === "en" ? "Copied!" : "已复制!"}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

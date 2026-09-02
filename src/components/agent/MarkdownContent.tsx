// ── TerraFlux Scientific Markdown & KaTeX Formula Parser ──────────────────

import React from 'react';
import katex from 'katex';

interface MarkdownProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownProps> = ({ content }) => {
  // Regex to detect and render KaTeX formulas: $$block$$ and $inline$
  const parseMathAndMarkdown = (text: string) => {
    // Split by block math $$...$$
    const blockParts = text.split(/(\$\$[\s\S]*?\$\$)/g);

    return blockParts.map((block, bIdx) => {
      if (block.startsWith('$$') && block.endsWith('$$')) {
        const math = block.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={`math-block-${bIdx}`}
              className="my-3 p-3 rounded-xl bg-white border border-[#DDE3DA] overflow-x-auto text-xs font-mono-data text-[#141E1A] shadow-xs"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <pre key={`math-block-${bIdx}`} className="text-xs text-[#00524B] font-mono font-semibold bg-white p-2 rounded-lg border border-[#DDE3DA]">
              {math}
            </pre>
          );
        }
      }

      // Process standard lines and inline math $...$
      const lines = block.split('\n');
      return (
        <div key={`text-block-${bIdx}`} className="space-y-2">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return null;

            // Headers
            if (line.startsWith('### ')) {
              return (
                <h3 key={lIdx} className="font-headline font-bold text-sm text-[#00524B] pt-1 tracking-tight">
                  {renderInlineMath(line.replace('### ', ''))}
                </h3>
              );
            }
            if (line.startsWith('#### ')) {
              return (
                <h4 key={lIdx} className="font-headline font-semibold text-xs text-[#176B63] pt-1">
                  {renderInlineMath(line.replace('#### ', ''))}
                </h4>
              );
            }

            // Bullet lists
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <li key={lIdx} className="ml-4 list-disc text-xs text-[#141E1A] leading-relaxed">
                  {renderInlineMath(line.slice(2))}
                </li>
              );
            }

            // Standard paragraph
            return (
              <p key={lIdx} className="text-xs text-[#141E1A] leading-relaxed">
                {renderInlineMath(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const renderInlineMath = (line: string) => {
    const inlineParts = line.split(/(\$[^\$]+?\$)/g);
    return inlineParts.map((part, pIdx) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={pIdx}
              className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-[#176B63]/10 text-[#00524B] border border-[#176B63]/25 text-[11px] font-mono font-semibold align-baseline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={pIdx} className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-[#176B63]/10 text-[#00524B] text-[11px] font-mono font-semibold">
              {part}
            </span>
          );
        }
      }

      // Format bold markdown (**text**)
      const boldParts = part.split(/(\*\*[^\*]+?\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return (
            <strong key={bIdx} className="font-bold text-[#141E1A]">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return <span key={bIdx}>{bPart}</span>;
      });
    });
  };

  return <div className="space-y-2 select-text text-[#141E1A]">{parseMathAndMarkdown(content)}</div>;
};

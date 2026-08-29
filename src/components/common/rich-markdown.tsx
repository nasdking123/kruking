'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface RichMarkdownProps {
  content?: string | null;
  className?: string;
}

export function RichMarkdown({ content, className = '' }: RichMarkdownProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content || !content.trim()) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        ยังไม่มีเนื้อหาเพิ่มเติม
      </div>
    );
  }

  // Split content into blocks by double newlines or table/heading boundaries
  const blocks = splitMarkdownBlocks(content);

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed font-normal ${className}`}>
      {blocks.map((block, idx) => {
        // 1. Horizontal Rule (---)
        if (block.type === 'hr') {
          return (
            <hr key={idx} className="my-8 border-t border-slate-200 dark:border-slate-800" />
          );
        }

        // 2. Heading 1 (# ...)
        if (block.type === 'h1') {
          return (
            <div key={idx} className="pt-6 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block shrink-0" />
                <span>{renderInlineFormatting(block.content)}</span>
              </h2>
            </div>
          );
        }

        // 3. Heading 2 (## ...)
        if (block.type === 'h2') {
          return (
            <div key={idx} className="pt-5 pb-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{renderInlineFormatting(block.content)}</span>
              </h3>
            </div>
          );
        }

        // 4. Heading 3 (### ...)
        if (block.type === 'h3') {
          return (
            <h4 key={idx} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-3 flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{renderInlineFormatting(block.content)}</span>
            </h4>
          );
        }

        // 5. Blockquote / Callout (> ...)
        if (block.type === 'quote') {
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30 border-l-4 border-blue-600 dark:border-blue-500 shadow-xs space-y-1.5"
            >
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>ข้อควรจำ / สาระสำคัญ</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                {block.lines.map((line, lIdx) => (
                  <p key={lIdx}>{renderInlineFormatting(line)}</p>
                ))}
              </div>
            </div>
          );
        }

        // 6. Markdown Table (| ... |)
        if (block.type === 'table') {
          return (
            <div key={idx} className="my-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  {block.headers && (
                    <thead className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold">
                      <tr>
                        {block.headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-4 py-3.5 whitespace-nowrap first:pl-5 last:pr-5">
                            {renderInlineFormatting(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors odd:bg-slate-50/40 dark:odd:bg-slate-900/40"
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 text-slate-700 dark:text-slate-300 first:pl-5 last:pr-5 leading-relaxed">
                            {renderInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // 7. Unordered List (- ...)
        if (block.type === 'ul') {
          return (
            <ul key={idx} className="space-y-2.5 pl-1 my-3">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1">{renderInlineFormatting(item)}</div>
                </li>
              ))}
            </ul>
          );
        }

        // 8. Ordered List (1. ...)
        if (block.type === 'ol') {
          return (
            <ol key={idx} className="space-y-2.5 pl-1 my-3">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {iIdx + 1}
                  </span>
                  <div className="flex-1">{renderInlineFormatting(item)}</div>
                </li>
              ))}
            </ol>
          );
        }

        // 9. Code Block (``` ...)
        if (block.type === 'code') {
          return (
            <div key={idx} className="my-4 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 text-xs font-mono shadow-md">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">{block.lang || 'code'}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(block.code, idx)}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>คัดลอก</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // 10. Normal Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {renderInlineFormatting(block.content)}
          </p>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------
// Helper Functions for Parsing Markdown Blocks & Inline
// ----------------------------------------------------

type MarkdownBlock =
  | { type: 'hr' }
  | { type: 'h1'; content: string }
  | { type: 'h2'; content: string }
  | { type: 'h3'; content: string }
  | { type: 'quote'; lines: string[] }
  | { type: 'table'; headers?: string[]; rows: string[][] }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; lang: string; code: string }
  | { type: 'p'; content: string };

function splitMarkdownBlocks(rawText: string): MarkdownBlock[] {
  const lines = rawText.split('\n');
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading 1 (# ...)
    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', content: trimmed.replace(/^#\s+/, '') });
      i++;
      continue;
    }

    // Heading 2 (## ...)
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', content: trimmed.replace(/^##\s+/, '') });
      i++;
      continue;
    }

    // Heading 3 (### ...)
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', content: trimmed.replace(/^###\s+/, '') });
      i++;
      continue;
    }

    // Code Block (``` ...)
    if (trimmed.startsWith('```')) {
      const lang = trimmed.replace(/^```/, '').trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') });
      continue;
    }

    // Blockquote (> ...)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      blocks.push({ type: 'quote', lines: quoteLines });
      continue;
    }

    // Table (| ... |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headers = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());

        // Line 1 is usually separator (|:---|:---|)
        const isSeparator = tableLines[1].includes('---') || tableLines[1].includes('--');
        const startRowIdx = isSeparator ? 2 : 1;

        const rows: string[][] = [];
        for (let r = startRowIdx; r < tableLines.length; r++) {
          const cells = tableLines[r]
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim());
          rows.push(cells);
        }

        blocks.push({ type: 'table', headers, rows });
        continue;
      }
    }

    // Unordered List (- ... or * ...)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered List (1. ... or 2. ...)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Default Paragraph: accumulate non-empty lines
    const pLines: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ') &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      lines[i].trim() !== '---'
    ) {
      pLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: 'p', content: pLines.join(' ') });
  }

  return blocks;
}

// Inline formatting: **bold**, *italic*, `code`, and [link](url)
function renderInlineFormatting(text: string): React.ReactNode {
  if (!text) return text;

  // Split by bold (**...**), code (`...`), and links ([...](...))
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline Code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // Link: [label](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Find the earliest match
    const matches = [
      boldMatch ? { type: 'bold', index: boldMatch.index!, match: boldMatch } : null,
      codeMatch ? { type: 'code', index: codeMatch.index!, match: codeMatch } : null,
      linkMatch ? { type: 'link', index: linkMatch.index!, match: linkMatch } : null,
    ].filter(Boolean) as Array<{ type: 'bold' | 'code' | 'link'; index: number; match: RegExpMatchArray }>;

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const first = matches[0];

    // Push text before match
    if (first.index > 0) {
      parts.push(remaining.substring(0, first.index));
    }

    if (first.type === 'bold') {
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-bold text-slate-900 dark:text-white">
          {first.match[1]}
        </strong>
      );
      remaining = remaining.substring(first.index + first.match[0].length);
    } else if (first.type === 'code') {
      parts.push(
        <code
          key={`c-${keyIdx++}`}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-[11px]"
        >
          {first.match[1]}
        </code>
      );
      remaining = remaining.substring(first.index + first.match[0].length);
    } else if (first.type === 'link') {
      parts.push(
        <a
          key={`l-${keyIdx++}`}
          href={first.match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-0.5"
        >
          <span>{first.match[1]}</span>
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
      remaining = remaining.substring(first.index + first.match[0].length);
    }
  }

  return parts;
}

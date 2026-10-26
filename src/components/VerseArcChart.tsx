import React, { useRef, useEffect } from 'react';
import { BibleVerse, CrossReference } from '../types/bible';
import { TOTAL_CHAPTERS, getGlobalChapterIndex, getBookByName } from '../data/canon';

interface VerseArcChartProps {
  verse: BibleVerse;
  references: CrossReference[];
  onSelectReference: (bookName: string, chapter: number, verseStart: number) => void;
}

export const VerseArcChart: React.FC<VerseArcChartProps> = ({
  verse,
  references,
  onSelectReference
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Minimalist clean dark background (no heavy gradients)
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, w, h);

    const marginX = 20;
    const baselineY = h - 35;
    const usableW = w - marginX * 2;

    const sourceGlobal = getGlobalChapterIndex(verse.book, verse.chapter);
    const sourceX = marginX + (sourceGlobal / (TOTAL_CHAPTERS - 1)) * usableW;

    // Draw baseline
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginX, baselineY);
    ctx.lineTo(w - marginX, baselineY);
    ctx.stroke();

    // Mark Testament separator between Malachi and Matthew (index 929)
    const otNtX = marginX + (929 / (TOTAL_CHAPTERS - 1)) * usableW;
    ctx.strokeStyle = '#71717a';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(otNtX, baselineY - 15);
    ctx.lineTo(otNtX, baselineY + 15);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw reference arcs
    references.forEach((ref, idx) => {
      const targetGlobal = getGlobalChapterIndex(ref.targetBook, ref.targetChapter);
      const targetX = marginX + (targetGlobal / (TOTAL_CHAPTERS - 1)) * usableW;

      const normDist = Math.abs(targetGlobal - sourceGlobal) / TOTAL_CHAPTERS;
      const arcHeight = Math.min(baselineY - 15, 25 + normDist * (baselineY - 30));
      const peakY = baselineY - arcHeight;
      const midX = (sourceX + targetX) / 2;

      // Colorful rainbow spectral hue
      const hue = (idx * 65 + Math.floor(normDist * 280)) % 360;

      // Arc
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsla(${hue}, 90%, 65%, 0.85)`;
      ctx.shadowColor = `hsla(${hue}, 95%, 60%, 0.6)`;
      ctx.shadowBlur = 6;
      ctx.moveTo(sourceX, baselineY);
      ctx.quadraticCurveTo(midX, peakY - arcHeight * 0.15, targetX, baselineY);
      ctx.stroke();

      // Target node marker on baseline
      ctx.shadowBlur = 0;
      ctx.fillStyle = `hsl(${hue}, 90%, 65%)`;
      ctx.beginPath();
      ctx.arc(targetX, baselineY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Target citation label
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillStyle = '#e4e4e7';
      ctx.textAlign = 'center';
      const labelY = idx % 2 === 0 ? baselineY + 16 : baselineY + 28;
      ctx.fillText(`${ref.targetBook.slice(0, 3)} ${ref.targetChapter}`, targetX, labelY);
    });

    // Draw Source Node (The verse being studied)
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fbbf24';
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(sourceX, baselineY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Source label above
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★ ${verse.book} ${verse.chapter}:${verse.verse}`, Math.max(50, Math.min(w - 50, sourceX)), baselineY - 12);

    ctx.restore();
  }, [verse, references]);

  return (
    <div className="w-full bg-zinc-900 rounded-xl p-3 border border-zinc-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Canonical Arc Map for {verse.book} {verse.chapter}:{verse.verse}
        </span>
        <span className="text-[11px] text-zinc-400">
          {references.length} Rainbow Connections
        </span>
      </div>

      <div className="w-full h-36 relative select-none">
        <canvas ref={canvasRef} className="w-full h-full block rounded-lg" />
      </div>

      {/* Target quick click buttons */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {references.map((ref, idx) => (
          <button
            key={idx}
            onClick={() => onSelectReference(ref.targetBook, ref.targetChapter, ref.targetVerseStart)}
            className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1"
            title="Read connected passage"
          >
            <span className="font-medium text-amber-400">{ref.targetBook} {ref.targetChapter}:{ref.targetVerseStart}</span>
            <span className="text-[10px] text-zinc-400">({ref.relationship.split(' ')[0]})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

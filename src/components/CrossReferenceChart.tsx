import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { BIBLE_BOOKS, TOTAL_CHAPTERS, TOTAL_CROSS_REFERENCES_COUNT, getBookAndChapterFromGlobal } from '../data/canon';
import { getCanonicalCrossReferenceArcs, ChartArc } from '../data/crossReferences';
import { BookOpen, Sparkles, Filter, Download, ZoomIn, ZoomOut, RotateCcw, ChevronRight } from 'lucide-react';

interface CrossReferenceChartProps {
  onSelectPassage: (bookName: string, chapter: number, verse?: number) => void;
  activeBookName?: string;
  activeChapter?: number;
}

export const CrossReferenceChart: React.FC<CrossReferenceChartProps> = ({
  onSelectPassage,
  activeBookName = 'Genesis',
  activeChapter = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredGlobalChapter, setHoveredGlobalChapter] = useState<number | null>(null);
  const [selectedGlobalChapter, setSelectedGlobalChapter] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ot-nt' | 'messianic' | 'creation-end' | 'active-book'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const allArcs = useMemo(() => getCanonicalCrossReferenceArcs(), []);

  // Filter arcs based on current filter state
  const visibleArcs = useMemo(() => {
    if (activeFilter === 'all') return allArcs;
    if (activeFilter === 'ot-nt') return allArcs.filter(a => a.category === 'ot-nt');
    if (activeFilter === 'messianic') return allArcs.filter(a => a.category === 'messianic');
    if (activeFilter === 'creation-end') return allArcs.filter(a => a.category === 'creation-end');
    if (activeFilter === 'active-book') {
      return allArcs.filter(a => a.sourceBookName === activeBookName || a.targetBookName === activeBookName);
    }
    return allArcs;
  }, [allArcs, activeFilter, activeBookName]);

  // Pre-calculate chapter baseline geometry
  const chapterLengths = useMemo(() => {
    const lengths: number[] = [];
    for (const book of BIBLE_BOOKS) {
      for (let ch = 0; ch < book.chaptersCount; ch++) {
        const vCount = book.approxChapterVerses[ch] || 25;
        lengths.push(vCount);
      }
    }
    return lengths;
  }, []);

  // Max verse count for scaling baseline ticks (Psalm 119 has 176)
  const maxVerseCount = 176;

  // Convert global chapter index to canvas X coordinate
  const chapterToX = useCallback((globalIndex: number, width: number, marginX: number) => {
    const usableWidth = (width - marginX * 2) * zoomLevel;
    const x = marginX + (globalIndex / (TOTAL_CHAPTERS - 1)) * usableWidth + panOffset;
    return x;
  }, [zoomLevel, panOffset]);

  // Canvas render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Dark gallery backdrop matching Christoph Harrison's visualization
    ctx.fillStyle = '#080A0E';
    ctx.fillRect(0, 0, width, height);

    const marginX = 24;
    const baselineY = height - 70;
    const maxArcHeight = baselineY - 40;

    // Draw background subtle constellation glow
    const gradGlow = ctx.createRadialGradient(width / 2, baselineY, 10, width / 2, baselineY, width * 0.6);
    gradGlow.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
    gradGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.03)');
    gradGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradGlow;
    ctx.fillRect(0, 0, width, baselineY);

    const targetGlobal = hoveredGlobalChapter !== null ? hoveredGlobalChapter : selectedGlobalChapter;

    // Draw Arcs
    ctx.lineWidth = 1;

    // Pass 1: Draw non-highlighted arcs
    for (let i = 0; i < visibleArcs.length; i++) {
      const arc = visibleArcs[i];
      const isConnected = targetGlobal !== null && 
        (arc.sourceChapterGlobal === targetGlobal || arc.targetChapterGlobal === targetGlobal);

      if (isConnected) continue; // Draw connected in pass 2 with high brightness

      const x1 = chapterToX(arc.sourceChapterGlobal, width, marginX);
      const x2 = chapterToX(arc.targetChapterGlobal, width, marginX);

      // Skip off-screen arcs when zoomed
      if (Math.max(x1, x2) < 0 || Math.min(x1, x2) > width) continue;

      const distance = Math.abs(x2 - x1);
      const midX = (x1 + x2) / 2;
      
      // Arc height proportional to distance across the Bible
      const normDist = Math.abs(arc.targetChapterGlobal - arc.sourceChapterGlobal) / TOTAL_CHAPTERS;
      const arcHeight = Math.min(maxArcHeight, 15 + normDist * (maxArcHeight - 20));
      const peakY = baselineY - arcHeight;

      // Spectral Rainbow hue based on normalized distance / canonical position
      // Close distance = red/orange, medium = yellow/green, cross-testament = cyan/blue/magenta
      const hue = Math.floor(normDist * 320); // 0 (red) to 300 (purple)
      const alpha = targetGlobal !== null ? 0.035 : 0.12;

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${alpha})`;
      ctx.moveTo(x1, baselineY);
      ctx.quadraticCurveTo(midX, peakY - arcHeight * 0.15, x2, baselineY);
      ctx.stroke();
    }

    // Pass 2: Draw Highlighted / Connected Arcs with brilliant glow
    if (targetGlobal !== null) {
      const connectedArcs = visibleArcs.filter(a => 
        a.sourceChapterGlobal === targetGlobal || a.targetChapterGlobal === targetGlobal
      );

      ctx.shadowBlur = 8;
      for (const arc of connectedArcs) {
        const x1 = chapterToX(arc.sourceChapterGlobal, width, marginX);
        const x2 = chapterToX(arc.targetChapterGlobal, width, marginX);
        const midX = (x1 + x2) / 2;
        const normDist = Math.abs(arc.targetChapterGlobal - arc.sourceChapterGlobal) / TOTAL_CHAPTERS;
        const arcHeight = Math.min(maxArcHeight, 15 + normDist * (maxArcHeight - 20));
        const peakY = baselineY - arcHeight;

        const hue = Math.floor(normDist * 320);
        ctx.beginPath();
        ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`;
        ctx.strokeStyle = `hsla(${hue}, 100%, 80%, 0.9)`;
        ctx.lineWidth = 1.8;
        ctx.moveTo(x1, baselineY);
        ctx.quadraticCurveTo(midX, peakY - arcHeight * 0.15, x2, baselineY);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;
    }

    // Pass 3: Draw Bottom Baseline Chapters (1,189 chapter ticks with verse length)
    for (let i = 0; i < TOTAL_CHAPTERS; i++) {
      const x = chapterToX(i, width, marginX);
      if (x < -10 || x > width + 10) continue;

      const vCount = chapterLengths[i] || 25;
      const barHeight = Math.max(3, (vCount / maxVerseCount) * 45);
      const isOT = i < 929;
      const isTarget = targetGlobal === i;

      ctx.beginPath();
      if (isTarget) {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.5;
        ctx.moveTo(x, baselineY - 4);
        ctx.lineTo(x, baselineY + barHeight + 6);
      } else {
        // Alternating white and slate chapter segments
        const bookInfo = getBookAndChapterFromGlobal(i);
        const isAlternateBook = bookInfo.book.order % 2 === 0;
        ctx.strokeStyle = isAlternateBook 
          ? (isOT ? 'rgba(255, 255, 255, 0.7)' : 'rgba(192, 132, 252, 0.75)') 
          : (isOT ? 'rgba(148, 163, 184, 0.45)' : 'rgba(147, 51, 234, 0.45)');
        ctx.lineWidth = Math.max(0.6, (width / TOTAL_CHAPTERS) * zoomLevel * 0.8);
        ctx.moveTo(x, baselineY);
        ctx.lineTo(x, baselineY + barHeight);
      }
      ctx.stroke();
    }

    // Pass 4: Draw Baseline Divider and Book Labels
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.moveTo(marginX, baselineY);
    ctx.lineTo(width - marginX, baselineY);
    ctx.stroke();

    // Mark Testament Divider line between Malachi (ch 928) and Matthew (ch 929)
    const otNtSplitX = chapterToX(929, width, marginX);
    ctx.beginPath();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(otNtSplitX, baselineY - 30);
    ctx.lineTo(otNtSplitX, baselineY + 50);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Book Labels along bottom if space permits
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';

    // Key milestone books to always label
    const milestoneBooks = ['GEN', 'EXO', 'PSA', 'PRO', 'ISA', 'MAT', 'JHN', 'ROM', 'HEB', 'REV'];
    for (const bId of milestoneBooks) {
      const book = BIBLE_BOOKS.find(b => b.id === bId);
      if (!book) continue;
      const x = chapterToX(book.startGlobalChapter, width, marginX);
      if (x > 10 && x < width - 10) {
        ctx.fillText(book.name, x, baselineY + 58);
      }
    }

    // Testament header labels
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('OLD TESTAMENT (39 Books · 929 Chapters)', marginX + 10, height - 12);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = '#C084FC';
    ctx.fillText('NEW TESTAMENT (27 Books · 260 Chapters)', width - marginX - 10, height - 12);

    ctx.restore();
  }, [visibleArcs, hoveredGlobalChapter, selectedGlobalChapter, chapterLengths, chapterToX, zoomLevel, panOffset]);

  // Handle Resize and Canvas initialization
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      renderCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  // Trigger render when visibleArcs or selection changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Mouse move and hover calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    const marginX = 24;
    const usableWidth = (rect.width - marginX * 2) * zoomLevel;
    const adjustedX = x - marginX - panOffset;

    if (adjustedX >= 0 && adjustedX <= usableWidth) {
      const norm = adjustedX / usableWidth;
      const globalCh = Math.max(0, Math.min(TOTAL_CHAPTERS - 1, Math.round(norm * (TOTAL_CHAPTERS - 1))));
      setHoveredGlobalChapter(globalCh);
    } else {
      setHoveredGlobalChapter(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredGlobalChapter(null);
    setMousePos(null);
  };

  const handleClick = () => {
    if (hoveredGlobalChapter !== null) {
      setSelectedGlobalChapter(hoveredGlobalChapter);
      const { book, chapter } = getBookAndChapterFromGlobal(hoveredGlobalChapter);
      onSelectPassage(book.name, chapter, 1);
    }
  };

  // Hovered chapter summary metadata
  const activeChapterInfo = useMemo(() => {
    const target = hoveredGlobalChapter !== null ? hoveredGlobalChapter : selectedGlobalChapter;
    if (target === null) return null;
    const { book, chapter } = getBookAndChapterFromGlobal(target);
    const connectedCount = allArcs.filter(a => a.sourceChapterGlobal === target || a.targetChapterGlobal === target).length;
    const verseCount = book.approxChapterVerses[chapter - 1] || 25;
    return {
      book,
      chapter,
      verseCount,
      connectedCount,
      isOT: target < 929
    };
  }, [hoveredGlobalChapter, selectedGlobalChapter, allArcs]);

  // Export high resolution PNG of chart
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Bible_63779_Cross_References_Map.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Top Header & Interactive Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              The 63,779 Bible Cross-References
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Christoph Römhild & Chris Harrison canonical scripture arc visualization · 1,189 Chapters · 66 Books
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'all' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            All 63,779 Arcs
          </button>
          <button
            onClick={() => setActiveFilter('ot-nt')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'ot-nt' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            OT ⇄ NT Connections
          </button>
          <button
            onClick={() => setActiveFilter('messianic')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'messianic' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Messianic Prophecies
          </button>
          <button
            onClick={() => setActiveFilter('creation-end')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'creation-end' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Genesis ⇄ Revelation
          </button>
          <button
            onClick={() => setActiveFilter('active-book')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'active-book' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            {activeBookName} Only
          </button>
        </div>

        {/* Quick Canvas Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.4, 3))}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset(0);
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
            title="Download PNG graphic"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export HD</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div 
        ref={containerRef}
        className="w-full h-[400px] sm:h-[480px] lg:h-[540px] relative cursor-crosshair select-none bg-slate-950"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="w-full h-full block"
        />

        {/* Live Hover Scrub Tooltip / Card */}
        {activeChapterInfo && (
          <div className="absolute top-4 left-4 p-3.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-2xl max-w-xs pointer-events-none transition-all">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {activeChapterInfo.isOT ? 'Old Testament' : 'New Testament'}
              </span>
              <span className="text-xs text-slate-400 tabular-nums">
                {activeChapterInfo.verseCount} verses
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {activeChapterInfo.book.name} {activeChapterInfo.chapter}
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              {activeChapterInfo.book.theme}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-300 font-medium">
              <span>{activeChapterInfo.connectedCount} cross-reference connections</span>
              <span className="text-amber-400">Click to Study →</span>
            </div>
          </div>
        )}

        {/* Instruction overlay at bottom center */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-700/50 text-[11px] text-slate-400">
          Scrub horizontally over the 1,189 chapters to illuminate cross-reference arcs · Click any point to open in Study Mode
        </div>
      </div>

      {/* Quick Jump Landmark Carousel */}
      <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 font-medium px-2 shrink-0">Popular Landmarks:</span>
        {[
          { label: 'Genesis 1 · Creation', book: 'Genesis', ch: 1 },
          { label: 'Psalm 23 · The Good Shepherd', book: 'Psalms', ch: 23 },
          { label: 'Isaiah 53 · Suffering Servant', book: 'Isaiah', ch: 53 },
          { label: 'Matthew 5 · Sermon on Mount', book: 'Matthew', ch: 5 },
          { label: 'John 1 · The Word Was God', book: 'John', ch: 1 },
          { label: 'Romans 8 · More Than Conquerors', book: 'Romans', ch: 8 },
          { label: 'Revelation 21 · New Heaven & Earth', book: 'Revelation', ch: 21 },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPassage(item.book, item.ch, 1)}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>{item.label}</span>
            <ChevronRight className="w-3 h-3 text-cyan-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

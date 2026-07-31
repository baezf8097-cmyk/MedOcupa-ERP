import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, X, ShieldCheck, Eraser } from 'lucide-react';

interface SignatureCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (signatureBase64: string) => void;
  title?: string;
  subtitle?: string;
  initialSignature?: string;
}

export const SignatureCanvasModal: React.FC<SignatureCanvasModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
  title = 'Captura de Firma y Sello Digital del Médico Ocupacional',
  subtitle = 'Efectúe su trazo manuscrito. Esta firma será estampada en los certificados oficiales CAMO (Anexo 03) y Notificaciones.',
  initialSignature
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#0f172a'); // Slate-900 / Dark blue ink

  useEffect(() => {
    if (isOpen) {
      // Allow modal DOM rendering before setting canvas context
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina / High DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = strokeColor;

    // Clear background to white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw baseline guideline
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(30, rect.height - 35);
    ctx.lineTo(rect.width - 30, rect.height - 35);
    ctx.stroke();

    // Reset line settings for user drawing
    ctx.setLineDash([]);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = strokeColor;

    setHasDrawn(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleClear = () => {
    initCanvas();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;

    // Generate PNG Data URL Base64
    const signatureBase64 = canvas.toDataURL('image/png');
    onSaveSignature(signatureBase64);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Lienzo de Firma Táctil / Digital (Ley N° 29783)
            </span>

            {/* Ink color switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Color de Tinta:</span>
              <button
                type="button"
                onClick={() => setStrokeColor('#0f172a')}
                className={`w-4 h-4 rounded-full bg-slate-900 border ${
                  strokeColor === '#0f172a' ? 'ring-2 ring-indigo-500' : 'border-slate-600'
                }`}
                title="Tinta Azul Oscuro / Slate"
              />
              <button
                type="button"
                onClick={() => setStrokeColor('#1e3a8a')}
                className={`w-4 h-4 rounded-full bg-blue-900 border ${
                  strokeColor === '#1e3a8a' ? 'ring-2 ring-indigo-500' : 'border-slate-600'
                }`}
                title="Tinta Azul Notarial"
              />
              <button
                type="button"
                onClick={() => setStrokeColor('#000000')}
                className={`w-4 h-4 rounded-full bg-black border ${
                  strokeColor === '#000000' ? 'ring-2 ring-indigo-500' : 'border-slate-600'
                }`}
                title="Tinta Negra"
              />
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-slate-700 bg-white shadow-inner">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-56 cursor-crosshair touch-none"
            />

            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs font-medium">
                Firme con el mouse, lápiz óptico o pantalla táctil sobre la línea punteada
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition-colors"
          >
            <Eraser className="w-4 h-4 text-amber-400" />
            <span>Limpiar Trazo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={!hasDrawn}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Guardar y Estampar Firma</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

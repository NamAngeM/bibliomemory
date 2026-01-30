'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecurePdfViewerProps {
    url: string;
    title: string;
    watermarkText?: string;
    onClose?: () => void;
}

export function SecurePdfViewer({ url, title, watermarkText, onClose }: SecurePdfViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Generate watermark text
    const getWatermark = () => {
        const now = new Date().toLocaleString('fr-FR');
        return watermarkText || `BiblioMemory - Consulté le ${now}`;
    };

    // Disable right-click
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block print (Ctrl+P)
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                return false;
            }
            // Block save (Ctrl+S)
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                return false;
            }
            // Block copy (Ctrl+C)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Handle fullscreen
    const toggleFullscreen = () => {
        if (!isFullscreen) {
            containerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
    };

    // Zoom controls
    const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

    // Page navigation
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    // Simulate loading PDF
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTotalPages(10); // Mock total pages
        }, 1500);
        return () => clearTimeout(timer);
    }, [url]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex flex-col bg-slate-900"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">B</span>
                    </div>
                    <h1 className="text-white font-medium truncate max-w-md">{title}</h1>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Zoom */}
                    <div className="flex items-center gap-1 rounded-lg bg-slate-700 p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={zoomOut}
                            className="h-8 w-8 text-white hover:bg-slate-600"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="px-2 text-sm text-white">{Math.round(scale * 100)}%</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={zoomIn}
                            className="h-8 w-8 text-white hover:bg-slate-600"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Page Navigation */}
                    <div className="flex items-center gap-1 rounded-lg bg-slate-700 p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToPrevPage}
                            disabled={currentPage <= 1}
                            className="h-8 w-8 text-white hover:bg-slate-600 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-sm text-white">
                            {currentPage} / {totalPages || '?'}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToNextPage}
                            disabled={currentPage >= totalPages}
                            className="h-8 w-8 text-white hover:bg-slate-600 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Fullscreen */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-10 w-10 text-white hover:bg-slate-700"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </Button>

                    {/* Close */}
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-10 w-10 text-white hover:bg-red-600"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </header>

            {/* PDF Content */}
            <div className="relative flex-1 overflow-auto bg-slate-950">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="relative mx-auto my-8 max-w-4xl">
                        {/* Mock PDF Page */}
                        <div
                            className="relative mx-auto bg-white shadow-2xl"
                            style={{
                                width: `${595 * scale}px`,
                                height: `${842 * scale}px`,
                                transform: `scale(${scale})`,
                                transformOrigin: 'top center',
                            }}
                        >
                            {/* Content protection overlay */}
                            <div className="absolute inset-0 z-10" />

                            {/* Mock PDF content */}
                            <div className="p-12 text-slate-800">
                                <h2 className="mb-6 text-2xl font-bold">{title}</h2>
                                <p className="mb-4 text-justify leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </p>
                                <p className="mb-4 text-justify leading-relaxed">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <div className="mt-8 rounded-lg bg-slate-100 p-4">
                                    <p className="text-sm text-slate-500">
                                        Page {currentPage} sur {totalPages}
                                    </p>
                                </div>
                            </div>

                            {/* Watermark */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div
                                    className="rotate-[-30deg] text-4xl font-bold text-slate-300/30"
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {getWatermark()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Watermark */}
            <footer className="border-t border-slate-700 bg-slate-800 px-4 py-2 text-center">
                <p className="text-xs text-slate-400">
                    📚 {getWatermark()} - Document protégé - Consultation en ligne uniquement
                </p>
            </footer>

            {/* Print Protection CSS */}
            <style jsx global>{`
        @media print {
          body * {
            display: none !important;
          }
          body::after {
            content: 'Impression non autorisée';
            display: block;
            font-size: 24px;
            text-align: center;
            padding: 100px;
          }
        }
      `}</style>
        </div>
    );
}

import { useEffect, useRef, useState } from 'react';

export default function FocalPointPicker({
    src,
    focalX = 50,
    focalY = 50,
    zoom = 1,
    onChange,
    aspectRatio = 'aspect-[4/3]',
    label = "Positionnement & Cadrage de l'image (Pan & Zoom)",
}) {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startFocalX: 50, startFocalY: 50 });

    const handleMouseDown = (e) => {
        // Ignorer le clic droit
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
        dragStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            startFocalX: focalX,
            startFocalY: focalY,
        };
    };

    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;

        setIsDragging(true);
        dragStartRef.current = {
            mouseX: e.touches[0].clientX,
            mouseY: e.touches[0].clientY,
            startFocalX: focalX,
            startFocalY: focalY,
        };
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleWindowMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            // Déplacement du pointeur par rapport au point de départ
            const dx = e.clientX - dragStartRef.current.mouseX;
            const dy = e.clientY - dragStartRef.current.mouseY;

            // Calcul du pourcentage de mouvement (sens naturel du pan : la souris déplace directement le point focal)
            const percentX = (dx / rect.width) * 100;
            const percentY = (dy / rect.height) * 100;

            const nextX = Math.max(0, Math.min(100, dragStartRef.current.startFocalX + percentX));
            const nextY = Math.max(0, Math.min(100, dragStartRef.current.startFocalY + percentY));

            onChange({
                focalX: Math.round(nextX * 10) / 10,
                focalY: Math.round(nextY * 10) / 10,
                zoom,
            });
        };

        const handleWindowTouchMove = (e) => {
            if (e.touches.length !== 1 || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const dx = e.touches[0].clientX - dragStartRef.current.mouseX;
            const dy = e.touches[0].clientY - dragStartRef.current.mouseY;

            const percentX = (dx / rect.width) * 100;
            const percentY = (dy / rect.height) * 100;

            const nextX = Math.max(0, Math.min(100, dragStartRef.current.startFocalX + percentX));
            const nextY = Math.max(0, Math.min(100, dragStartRef.current.startFocalY + percentY));

            onChange({
                focalX: Math.round(nextX * 10) / 10,
                focalY: Math.round(nextY * 10) / 10,
                zoom,
            });
        };

        const handleWindowMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
        window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
        window.addEventListener('touchend', handleWindowMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
            window.removeEventListener('touchmove', handleWindowTouchMove);
            window.removeEventListener('touchend', handleWindowMouseUp);
        };
    }, [isDragging, zoom, onChange]);

    const handleZoomChange = (e) => {
        const newZoom = parseFloat(e.target.value);
        onChange({
            focalX,
            focalY,
            zoom: newZoom,
        });
    };

    const handleReset = () => {
        onChange({
            focalX: 50,
            focalY: 50,
            zoom: 1,
        });
    };

    if (!src) return null;

    return (
        <div className="space-y-4 rounded-xl border border-gray-200 dark:border-soil-700 bg-gray-50 dark:bg-soil-800/40 p-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-sand-300">
                    {label}
                </span>
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-yolk-500 hover:underline font-medium"
                >
                    Réinitialiser (50% / 1x)
                </button>
            </div>

            {/* Zone de recadrage interactive / Pan avec la souris & touch */}
            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className={`relative overflow-hidden rounded-xl border-2 border-yolk-500/80 bg-black select-none touch-none ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                } ${aspectRatio}`}
                title="Cliquez et maintenez le bouton de la souris enfoncé pour faire glisser l'image"
            >
                <img
                    src={src}
                    alt="Cadrage interactif"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="h-full w-full object-cover pointer-events-none transition-all duration-75"
                    style={{
                        objectPosition: `${focalX}% ${focalY}%`,
                        transform: `scale(${zoom})`,
                    }}
                />

                {/* Grille de règle des tiers */}
                <div className="absolute inset-0 border border-white/20 pointer-events-none grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                    <div className="border-r border-white/10" />
                    <div className="border-r border-white/10" />
                    <div className="" />
                </div>

                {/* Cible visuelle du centre de cadrage */}
                <div
                    className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-yolk-500/80 shadow-2xl ring-4 ring-black/50 pointer-events-none flex items-center justify-center transition-transform duration-75"
                    style={{ left: `${focalX}%`, top: `${focalY}%` }}
                >
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                </div>

                {/* Bulle d'explication */}
                <div className="absolute bottom-2 left-2 rounded-md bg-black/75 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur flex items-center gap-2">
                    <span className="text-base">🖱️</span>
                    <span>Cliquez et glissez la souris pour déplacer l'image dans le cadre</span>
                </div>
            </div>

            {/* Curseurs de précision manuelle */}
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-sand-400 font-medium">
                        <span>Horiz. (X)</span>
                        <span className="font-mono text-yolk-500">{focalX}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={focalX}
                        onChange={(e) => onChange({ focalX: parseFloat(e.target.value), focalY, zoom })}
                        className="h-1.5 w-full cursor-pointer accent-yolk-500 rounded-lg bg-gray-200 dark:bg-soil-700"
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-sand-400 font-medium">
                        <span>Vert. (Y)</span>
                        <span className="font-mono text-yolk-500">{focalY}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={focalY}
                        onChange={(e) => onChange({ focalX, focalY: parseFloat(e.target.value), zoom })}
                        className="h-1.5 w-full cursor-pointer accent-yolk-500 rounded-lg bg-gray-200 dark:bg-soil-700"
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-sand-400 font-medium">
                        <span>🔍 Zoom</span>
                        <span className="font-mono text-yolk-500">{zoom.toFixed(1)}x</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={handleZoomChange}
                        className="h-1.5 w-full cursor-pointer accent-yolk-500 rounded-lg bg-gray-200 dark:bg-soil-700"
                    />
                </div>
            </div>
        </div>
    );
}

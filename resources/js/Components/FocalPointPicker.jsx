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
    const startPosRef = useRef({ x: 0, y: 0, initialFocalX: 50, initialFocalY: 50 });

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        startPosRef.current = {
            x: e.clientX,
            y: e.clientY,
            initialFocalX: focalX,
            initialFocalY: focalY,
        };
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calcule le déplacement relatif (inverse du mouvement pour faire glisser l'image sous le curseur)
        const deltaX = ((e.clientX - startPosRef.current.x) / rect.width) * 100;
        const deltaY = ((e.clientY - startPosRef.current.y) / rect.height) * 100;

        const newFocalX = Math.max(0, Math.min(100, startPosRef.current.initialFocalX - deltaX));
        const newFocalY = Math.max(0, Math.min(100, startPosRef.current.initialFocalY - deltaY));

        onChange({
            focalX: Math.round(newFocalX * 10) / 10,
            focalY: Math.round(newFocalY * 10) / 10,
            zoom,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            startPosRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                initialFocalX: focalX,
                initialFocalY: focalY,
            };
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1 || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        const deltaX = ((e.touches[0].clientX - startPosRef.current.x) / rect.width) * 100;
        const deltaY = ((e.touches[0].clientY - startPosRef.current.y) / rect.height) * 100;

        const newFocalX = Math.max(0, Math.min(100, startPosRef.current.initialFocalX - deltaX));
        const newFocalY = Math.max(0, Math.min(100, startPosRef.current.initialFocalY - deltaY));

        onChange({
            focalX: Math.round(newFocalX * 10) / 10,
            focalY: Math.round(newFocalY * 10) / 10,
            zoom,
        });
    };

    const handleClickCanvas = (e) => {
        // Clic direct pour placer immédiatement le centre
        if (isDragging) return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const clickY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

        onChange({
            focalX: Math.round(clickX * 10) / 10,
            focalY: Math.round(clickY * 10) / 10,
            zoom,
        });
    };

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

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

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
                    Réinitialiser (Centrer 50% / 1x)
                </button>
            </div>

            {/* Zone de recadrage interactive / Pan tactile */}
            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onClick={handleClickCanvas}
                className={`relative cursor-grab active:cursor-grabbing overflow-hidden rounded-xl border-2 border-yolk-500/60 bg-black select-none touch-none ${aspectRatio}`}
                title="Maintenez le clic et déplacez pour faire glisser l'image dans le cadre"
            >
                <img
                    src={src}
                    alt="Cadrage interactif"
                    className="h-full w-full object-cover pointer-events-none transition-all duration-75"
                    style={{
                        objectPosition: `${focalX}% ${focalY}%`,
                        transform: `scale(${zoom})`,
                    }}
                />

                {/* Cadre de guidage et collimateur central */}
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

                {/* Marqueur cible au centre de focus */}
                <div
                    className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-yolk-500/80 shadow-2xl ring-4 ring-black/50 pointer-events-none flex items-center justify-center transition-transform duration-75"
                    style={{ left: `${focalX}%`, top: `${focalY}%` }}
                >
                    <div className="h-2 w-2 rounded-full bg-white" />
                </div>

                {/* Badge d'aide visu
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function RichTextEditor({ value = '', onChange, label = 'Contenu' }) {
    const editorRef = useRef(null);
    const savedRangeRef = useRef(null);

    // Modales & Drag-and-drop
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    const [showMediaModal, setShowMediaModal] = useState(false);
    const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'upload', 'url'
    const [mediaType, setMediaType] = useState('image'); // 'image' ou 'video'
    const [mediaUrlInput, setMediaUrlInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [galleryItems, setGalleryItems] = useState([]);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [isDragOverEditor, setIsDragOverEditor] = useState(false);

    // États actifs de la barre d'outils
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        ul: false,
        ol: false,
        formatBlock: 'p',
    });

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRangeRef.current = sel.getRangeAt(0);
        }
        updateActiveStates();
    };

    const restoreSelection = () => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
        if (savedRangeRef.current) {
            const sel = window.getSelection();
            try {
                sel.removeAllRanges();
                sel.addRange(savedRangeRef.current);
            } catch (e) {
                // Ignore
            }
        }
    };

    const updateActiveStates = () => {
        try {
            const isBold = document.queryCommandState('bold');
            const isItalic = document.queryCommandState('italic');
            const isUnderline = document.queryCommandState('underline');
            const isStrike = document.queryCommandState('strikeThrough');
            const isUl = document.queryCommandState('insertUnorderedList');
            const isOl = document.queryCommandState('insertOrderedList');
            let block = document.queryCommandValue('formatBlock') || 'p';
            block = block.toLowerCase().replace(/[<>]/g, '');

            setActiveStates({
                bold: isBold,
                italic: isItalic,
                underline: isUnderline,
                strikeThrough: isStrike,
                ul: isUl,
                ol: isOl,
                formatBlock: block,
            });
        } catch (e) {
            // Ignore
        }
    };

    const execCommand = (command, val = null) => {
        restoreSelection();
        document.execCommand(command, false, val);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveStates();
    };

    const handleFormatBlock = (tag) => {
        restoreSelection();
        const tagFormatted = `<${tag}>`;
        try {
            document.execCommand('formatBlock', false, tagFormatted);
        } catch (e) {
            document.execCommand('formatBlock', false, tag);
        }
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveStates();
    };

    const handleInput = () => {
        saveSelection();
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // --- Lien Modal ---
    const openLinkModal = () => {
        saveSelection();
        const selection = window.getSelection();
        setLinkText(selection ? selection.toString() : '');
        setLinkUrl('');
        setShowLinkModal(true);
    };

    const confirmInsertLink = (e) => {
        e.preventDefault();
        if (!linkUrl) return;
        let url = linkUrl.trim();
        if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
            url = 'https://' + url;
        }

        restoreSelection();
        if (linkText) {
            const html = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-yolk-500 underline font-medium">${linkText}</a>`;
            insertRawHtml(html);
        } else {
            execCommand('createLink', url);
        }

        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
    };

    // --- Média Modal ---
    const openMediaModal = (type) => {
        saveSelection();
        setMediaType(type);
        setMediaUrlInput('');
        setActiveTab('gallery');
        setShowMediaModal(true);
        fetchGallery();
    };

    const fetchGallery = async () => {
        setLoadingGallery(true);
        try {
            const res = await axios.get(route('admin.api.medias'));
            setGalleryItems(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingGallery(false);
        }
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach((f) => {
            formData.append('files[]', f);
        });
        formData.append('collection', 'editor');

        try {
            const res = await axios.post(route('admin.media.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            });

            if (res.data?.url) {
                insertMediaHtml(res.data.url, mediaType);
            } else {
                Array.from(files).forEach((f) => {
                    const blobUrl = URL.createObjectURL(f);
                    const isVid = f.type.startsWith('video');
                    insertMediaHtml(blobUrl, isVid ? 'video' : 'image');
                });
            }
        } catch (err) {
            console.error('Upload fallback:', err);
            Array.from(files).forEach((f) => {
                const blobUrl = URL.createObjectURL(f);
                const isVid = f.type.startsWith('video');
                insertMediaHtml(blobUrl, isVid ? 'video' : 'image');
            });
        } finally {
            setUploading(false);
            setShowMediaModal(false);
        }
    };

    const insertRawHtml = (html) => {
        restoreSelection();
        let inserted = false;
        try {
            inserted = document.execCommand('insertHTML', false, html);
        } catch (e) {
            inserted = false;
        }

        if (!inserted && editorRef.current) {
            editorRef.current.innerHTML += html;
        }

        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveStates();
    };

    const insertMediaHtml = (src, type) => {
        if (!src) return;
        let mediaHtml = '';
        if (type === 'video') {
            mediaHtml = `<p><br></p><div class="my-4"><video src="${src}" controls class="w-full max-h-[400px] rounded-xl border border-gray-200 dark:border-soil-700 object-cover"></video></div><p><br></p>`;
        } else {
            mediaHtml = `<p><br></p><div class="my-4"><img src="${src}" alt="Illustration" class="w-full max-h-[500px] rounded-xl border border-gray-200 dark:border-soil-700 object-cover" /></div><p><br></p>`;
        }
        insertRawHtml(mediaHtml);
    };

    const confirmUrlMedia = (e) => {
        e.preventDefault();
        if (!mediaUrlInput) return;
        insertMediaHtml(mediaUrlInput.trim(), mediaType);
        setShowMediaModal(false);
        setMediaUrlInput('');
    };

    // --- Drag and Drop ---
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOverEditor(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOverEditor(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOverEditor(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    const getBtnStyle = (isActive) =>
        `rounded px-2 py-1 text-xs transition duration-150 ${
            isActive
                ? 'bg-yolk-500 text-soil-950 font-bold shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-soil-700 text-gray-700 dark:text-sand-200'
        }`;

    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-sand-300">
                    {label}
                </label>
            )}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative overflow-hidden rounded-xl border transition ${
                    isDragOverEditor
                        ? 'border-2 border-yolk-500 bg-yolk-500/5 ring-4 ring-yolk-500/20'
                        : 'border-gray-300 dark:border-soil-700 bg-white dark:bg-soil-900 shadow-sm focus-within:border-yolk-500 focus-within:ring-1 focus-within:ring-yolk-500'
                }`}
            >
                {/* Message Drag & Drop Overlay */}
                {isDragOverEditor && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-yolk-500/20 backdrop-blur-sm pointer-events-none border-2 border-dashed border-yolk-500">
                        <div className="rounded-xl bg-white dark:bg-soil-900 px-6 py-4 shadow-xl text-center">
                            <span className="text-3xl">📥</span>
                            <p className="mt-2 text-sm font-bold text-gray-900 dark:text-sand-100">
                                Déposez vos images ou vidéos ici !
                            </p>
                        </div>
                    </div>
                )}

                {/* Toolbar avec détection d'états actifs et preventDefault sur mousedown */}
                <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 dark:border-soil-800 bg-gray-50 dark:bg-soil-800/60 p-2 select-none">
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('bold')}
                        className={getBtnStyle(activeStates.bold)}
                        title="Gras (B)"
                    >
                        B
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('italic')}
                        className={getBtnStyle(activeStates.italic)}
                        title="Italique (I)"
                    >
                        <span className="italic font-serif">I</span>
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('underline')}
                        className={getBtnStyle(activeStates.underline)}
                        title="Souligné (U)"
                    >
                        <span className="underline">U</span>
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('strikeThrough')}
                        className={getBtnStyle(activeStates.strikeThrough)}
                        title="Barré (S)"
                    >
                        <span className="line-through">S</span>
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    {/* Titres H1 à H5 */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormatBlock('h1')}
                        className={getBtnStyle(activeStates.formatBlock === 'h1')}
                        title="Titre Principal H1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormatBlock('h2')}
                        className={getBtnStyle(activeStates.formatBlock === 'h2')}
                        title="Titre H2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormatBlock('h3')}
                        className={getBtnStyle(activeStates.formatBlock === 'h3')}
                        title="Titre H3"
                    >
                        H3
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormatBlock('h4')}
                        className={getBtnStyle(activeStates.formatBlock === 'h4')}
                        title="Titre H4"
                    >
                        H4
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormatBlock('h5')}
                        className={getBtnStyle(activeStates.formatBlock === 'h5')}
                        title="Titre H5"
                    >
                        H5
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormatBlock('p')}
                        className={getBtnStyle(activeStates.formatBlock === 'p')}
                        title="Texte Normal (P)"
                    >
                        ¶
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    {/* Listes */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('insertUnorderedList')}
                        className={getBtnStyle(activeStates.ul)}
                        title="Liste à puces"
                    >
                        • Liste
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('insertOrderedList')}
                        className={getBtnStyle(activeStates.ol)}
                        title="Liste numérotée"
                    >
                        1. Liste
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    {/* Alignement */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyLeft')}
                        className="rounded px-1.5 py-1 text-xs hover:bg-gray-200 dark:hover:bg-soil-700 text-gray-700 dark:text-sand-200"
                        title="Aligner à gauche"
                    >
                        ⇐
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyCenter')}
                        className="rounded px-1.5 py-1 text-xs hover:bg-gray-200 dark:hover:bg-soil-700 text-gray-700 dark:text-sand-200"
                        title="Centrer"
                    >
                        ⇔
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyRight')}
                        className="rounded px-1.5 py-1 text-xs hover:bg-gray-200 dark:hover:bg-soil-700 text-gray-700 dark:text-sand-200"
                        title="Aligner à droite"
                    >
                        ⇒
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    {/* Insérer Lien, Image, Vidéo */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={openLinkModal}
                        className="rounded px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-soil-700 flex items-center gap-1 font-medium text-yolk-600 dark:text-yolk-400"
                        title="Insérer un lien"
                    >
                        <span>🔗</span>
                        <span>Lien</span>
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => openMediaModal('image')}
                        className="rounded px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-soil-700 flex items-center gap-1 font-medium text-yolk-600 dark:text-yolk-400"
                        title="Choisir / Insérer une image"
                    >
                        <span>🖼️</span>
                        <span>Image</span>
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => openMediaModal('video')}
                        className="rounded px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-soil-700 flex items-center gap-1 font-medium text-yolk-600 dark:text-yolk-400"
                        title="Choisir / Insérer une vidéo"
                    >
                        <span>🎬</span>
                        <span>Vidéo</span>
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('removeFormat')}
                        className="rounded px-1.5 py-1 text-xs text-gray-400 hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Effacer le formatage"
                    >
                        🧹
                    </button>
                </div>

                {/* Zone éditable */}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    onClick={saveSelection}
                    onFocus={saveSelection}
                    className="min-h-[250px] max-h-[500px] overflow-y-auto p-4 text-sm text-gray-900 dark:text-sand-100 outline-none prose dark:prose-invert max-w-none"
                />
            </div>

            {/* --- Modale Lien --- */}
            {showLinkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900 p-6 shadow-2xl space-y-4">
                        <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                            🔗 Insérer un lien hypertexte
                        </h3>
                        <form onSubmit={confirmInsertLink} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-sand-400 mb-1">
                                    Texte à afficher
                                </label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Ex: Visiter notre ferme"
                                    className="w-full rounded-lg border border-gray-300 dark:border-soil-700 bg-gray-50 dark:bg-soil-800 p-2.5 text-sm text-gray-900 dark:text-sand-100 outline-none focus:border-yolk-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-sand-400 mb-1">
                                    URL du lien
                                </label>
                                <input
                                    type="url"
                                    required
                                    autoFocus
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-gray-300 dark:border-soil-700 bg-gray-50 dark:bg-soil-800 p-2.5 text-sm text-gray-900 dark:text-sand-100 outline-none focus:border-yolk-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowLinkModal(false)}
                                    className="rounded-lg px-4 py-2 text-xs font-medium text-gray-600 dark:text-sand-400 hover:bg-gray-100 dark:hover:bg-soil-800"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-yolk-500 px-4 py-2 text-xs font-semibold text-soil-950 hover:bg-yolk-400"
                                >
                                    Insérer le lien
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Modale Média avec Galerie --- */}
            {showMediaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900 p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                                {mediaType === 'video' ? '🎬 Sélectionner / Ajouter une vidéo' : '🖼️ Sélectionner / Ajouter une image'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowMediaModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-sand-200 text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Onglets */}
                        <div className="flex border-b border-gray-200 dark:border-soil-800 gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('gallery')}
                                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition ${
                                    activeTab === 'gallery'
                                        ? 'border-yolk-500 text-yolk-500'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-sand-400'
                                }`}
                            >
                                🖼️ Galerie existante ({galleryItems.filter(i => mediaType === 'video' ? i.type === 'video' : i.type !== 'video').length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('upload')}
                                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition ${
                                    activeTab === 'upload'
                                        ? 'border-yolk-500 text-yolk-500'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-sand-400'
                                }`}
                            >
                                📤 Téléverser depuis le PC
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('url')}
                                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition ${
                                    activeTab === 'url'
                                        ? 'border-yolk-500 text-yolk-500'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-sand-400'
                                }`}
                            >
                                🌐 Lien URL externe
                            </button>
                        </div>

                        {/* Contenu Galerie */}
                        {activeTab === 'gallery' && (
                            <div className="space-y-3">
                                {loadingGallery ? (
                                    <div className="py-10 text-center text-xs text-gray-400 dark:text-sand-500">
                                        Chargement de la galerie…
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1">
                                        {galleryItems
                                            .filter((item) => (mediaType === 'video' ? item.type === 'video' : item.type !== 'video'))
                                            .map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => {
                                                        insertMediaHtml(item.url, item.type);
                                                        setShowMediaModal(false);
                                                    }}
                                                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800 hover:border-yolk-500 transition text-left"
                                                >
                                                    {item.type === 'video' ? (
                                                        <video src={item.url} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <img src={item.url} alt={item.title || 'Média'} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white font-medium">
                                                        Insérer
                                                    </div>
                                                </button>
                                            ))}
                                        {galleryItems.filter((item) => (mediaType === 'video' ? item.type === 'video' : item.type !== 'video')).length === 0 && (
                                            <p className="col-span-full py-8 text-center text-xs text-gray-400 dark:text-sand-500">
                                                Aucun média correspondant dans la galerie.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contenu Upload */}
                        {activeTab === 'upload' && (
                            <div className="space-y-3">
                                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-yolk-500/50 bg-yolk-500/5 p-8 text-center transition hover:border-yolk-500 hover:bg-yolk-500/10">
                                    <div className="space-y-1">
                                        <span className="text-3xl">{mediaType === 'video' ? '🎬' : '🖼️'}</span>
                                        <p className="text-xs font-semibold text-gray-900 dark:text-sand-100">
                                            {uploading ? 'Téléversement en cours…' : `Choisir un ou plusieurs fichiers (${mediaType === 'video' ? 'vidéos' : 'images'})`}
                                        </p>
                                        <p className="text-[11px] text-gray-400 dark:text-sand-500">
                                            Téléverse le fichier et l'insère directement dans l'éditeur
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                                        disabled={uploading}
                                        onChange={(e) => handleFileUpload(e.target.files)}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        )}

                        {/* Contenu URL */}
                        {activeTab === 'url' && (
                            <form onSubmit={confirmUrlMedia} className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={mediaUrlInput}
                                        onChange={(e) => setMediaUrlInput(e.target.value)}
                                        placeholder={mediaType === 'video' ? 'https://exemple.com/video.mp4' : 'https://exemple.com/image.jpg'}
                                        className="flex-1 rounded-lg border border-gray-300 dark:border-soil-700 bg-gray-50 dark:bg-soil-800 p-2.5 text-sm text-gray-900 dark:text-sand-100 outline-none focus:border-yolk-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!mediaUrlInput}
                                        className="rounded-lg bg-yolk-500 px-4 py-2 text-xs font-semibold text-soil-950 hover:bg-yolk-400 disabled:opacity-50"
                                    >
                                        Insérer
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

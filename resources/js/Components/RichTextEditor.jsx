import { useEffect, useRef } from 'react';

export default function RichTextEditor({ value = '', onChange, label = 'Contenu' }) {
    const editorRef = useRef(null);

    // Initialiser le contenu lors du chargement ou du changement externe
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const addLink = () => {
        const url = prompt('Entrez l\'URL du lien (ex: https://...) :');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const addImage = () => {
        const url = prompt('Entrez l\'URL de l\'image (ex: https://...) :');
        if (url) {
            execCommand('insertImage', url);
        }
    };

    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-sand-300">
                    {label}
                </label>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-soil-700 bg-white dark:bg-soil-900 shadow-sm focus-within:border-yolk-500 focus-within:ring-1 focus-within:ring-yolk-500">
                {/* Barre d'outils (Toolbar) */}
                <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 dark:border-soil-800 bg-gray-50 dark:bg-soil-800/60 p-2 text-gray-700 dark:text-sand-200">
                    <button
                        type="button"
                        onClick={() => execCommand('bold')}
                        className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-soil-700 font-bold"
                        title="Gras (Ctrl+B)"
                    >
                        B
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand('italic')}
                        className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-soil-700 italic font-serif"
                        title="Italique (Ctrl+I)"
                    >
                        I
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand('underline')}
                        className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-soil-700 underline"
                        title="Souligné (Ctrl+U)"
                    >
                        U
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand('strikeThrough')}
                        className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-soil-700 line-through"
                        title="Barré"
                    >
                        S
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    <button
                        type="button"
                        onClick={() => execCommand('formatBlock', '<h2>')}
                        className="rounded p-1.5 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Titre H2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand('formatBlock', '<h3>')}
                        className="rounded p-1.5 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Sous-titre H3"
                    >
                        H3
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand('formatBlock', '<p>')}
                        className="rounded p-1.5 text-xs hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Paragraphe normal"
                    >
                        ¶
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    <button
                        type="button"
                        onClick={() => execCommand('insertUnorderedList')}
                        className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Liste à puces"
                    >
                        • Liste
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand('insertOrderedList')}
                        className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Liste numérotée"
                    >
                        1. Liste
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    <button
                        type="button"
                        onClick={addLink}
                        className="rounded p-1.5 text-xs hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Insérer un lien"
                    >
                        🔗 Lien
                    </button>
                    <button
                        type="button"
                        onClick={addImage}
                        className="rounded p-1.5 text-xs hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Insérer une image"
                    >
                        🖼️ Image
                    </button>

                    <div className="h-4 w-px bg-gray-300 dark:bg-soil-700 mx-1" />

                    <button
                        type="button"
                        onClick={() => execCommand('removeFormat')}
                        className="rounded p-1.5 text-xs text-gray-400 hover:bg-gray-200 dark:hover:bg-soil-700"
                        title="Effacer le formatage"
                    >
                        🧹 Effacer
                    </button>
                </div>

                {/* Zone d'édition HTML */}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="min-h-[220px] max-h-[500px] overflow-y-auto p-4 text-sm text-gray-900 dark:text-sand-100 outline-none prose dark:prose-invert max-w-none"
                    style={{ whiteSpace: 'pre-wrap' }}
                />
            </div>
        </div>
    );
}

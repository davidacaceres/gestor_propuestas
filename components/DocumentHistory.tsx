import React from 'react';
import { Document, DocumentVersion } from '../types';
import { XIcon, DownloadIcon } from './Icon';

interface DocumentHistoryProps {
    document: Document;
    onCancel: () => void;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({ document: doc, onCancel }) => {
    
    const handleDownload = (version: DocumentVersion) => {
        if (!version.fileContent) {
            alert('El contenido del archivo no está disponible para descargar.');
            return;
        }
        const link = window.document.createElement('a');
        link.href = version.fileContent;
        link.download = version.fileName;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Historial de Versiones</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">"{doc.name}"</p>
                </div>
                <button onClick={onCancel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="mt-6 flow-root">
                <ul role="list" className="-mb-8 max-h-[60vh] overflow-y-auto pr-4">
                    {doc.versions.map((version, versionIdx) => (
                        <li key={version.versionNumber}>
                            <div className="relative pb-8">
                                {versionIdx !== doc.versions.length - 1 ? (
                                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3 items-start">
                                    <div>
                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${versionIdx === 0 ? 'bg-primary-500' : 'bg-gray-400'}`}>
                                            <span className="text-white font-bold text-sm">V{version.versionNumber}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1.5">
                                        <div className="flex justify-between items-center text-sm">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {new Date(version.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            <div className="flex items-center gap-x-3">
                                                <p className="font-medium text-gray-700 dark:text-gray-300 truncate" title={version.fileName}>{version.fileName}</p>
                                                <button onClick={() => handleDownload(version)} className="text-primary-600 hover:text-primary-800 transition-colors dark:text-primary-400 dark:hover:text-primary-300" title={`Descargar ${version.fileName}`}>
                                                    <DownloadIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">{version.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DocumentHistory;

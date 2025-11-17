import React from 'react';
import { DocumentVersion } from '../types';
import { XIcon, DownloadIcon } from './Icon';

interface DocumentVersionsModalProps {
  data: {
    proposalTitle: string;
    date: Date;
    versions: DocumentVersion[];
  };
  onCancel: () => void;
}

const DocumentVersionsModal: React.FC<DocumentVersionsModalProps> = ({ data, onCancel }) => {
    const { proposalTitle, date, versions } = data;

    const handleDownload = (version: DocumentVersion) => {
        if (!version.fileContent) {
            alert('El contenido del archivo no está disponible para descargar.');
            return;
        }
        const link = document.createElement('a');
        link.href = version.fileContent;
        link.download = version.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Versiones Actualizadas</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Para "{proposalTitle}" el {date.toLocaleDateString('es-ES')}
                    </p>
                </div>
                <button onClick={onCancel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="mt-6 flow-root">
                <ul role="list" className="-my-4 divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-y-auto pr-4">
                    {versions.map((version, idx) => (
                        <li key={`${version.fileName}-${version.versionNumber}-${idx}`} className="flex items-center py-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" title={(version as any).name}>
                                    {(version as any).name} <span className="font-mono bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs">v{version.versionNumber}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" title={version.fileName}>{version.fileName}</p>
                                {version.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">"{version.notes}"</p>}
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <button onClick={() => handleDownload(version)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    <DownloadIcon className="w-4 h-4 mr-2"/>
                                    Descargar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DocumentVersionsModal;

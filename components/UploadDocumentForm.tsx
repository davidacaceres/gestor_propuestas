import React, { useState } from 'react';
import { UploadIcon } from './Icon';

interface UploadDocumentFormProps {
  proposalId: string;
  documentId?: string;
  documentName?: string;
  onSubmit: (proposalId: string, data: { name: string; file: { name: string; content: string; }; notes: string; }, documentId?: string) => void;
  onCancel: () => void;
}

const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({ proposalId, documentId, documentName, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<{name: string, content: string} | null>(null);
  const [notes, setNotes] = useState('');

  const isNewVersion = !!documentId;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFile({ name: f.name, content: event.target?.result as string });
      };
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && (isNewVersion || name.trim())) {
      onSubmit(proposalId, { name: isNewVersion ? documentName! : name, file, notes }, documentId);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{isNewVersion ? `Nueva Versión para "${documentName}"` : 'Añadir Nuevo Documento'}</h2>
      <div className="space-y-4">
        {!isNewVersion && (
          <div>
            <label htmlFor="docName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Documento</label>
            <input type="text" id="docName" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          </div>
        )}
        <div>
           <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Archivo</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  <span>Subir un archivo</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">{file ? file.name : 'PNG, JPG, PDF, etc.'}</p>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas de la Versión</label>
          <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder={isNewVersion ? 'Ej: Correcciones basadas en feedback.' : 'Ej: Versión inicial del documento.'} required></textarea>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center">
          <UploadIcon className="w-5 h-5 mr-2" />
          {isNewVersion ? 'Subir Versión' : 'Añadir Documento'}
        </button>
      </div>
    </form>
  );
};

export default UploadDocumentForm;

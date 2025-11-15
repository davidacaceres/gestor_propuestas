import React from 'react';
import { ExclamationTriangleIcon } from './Icon';

interface ConfirmationDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar" }) => {
    return (
        <div>
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-primary-900/50">
                    <ExclamationTriangleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h2 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100" id="modal-title">{title}</h2>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-300">{message}</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    onClick={onConfirm}
                    className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 sm:ml-3 sm:w-auto"
                >
                    {confirmText}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-600"
                >
                    {cancelText}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;

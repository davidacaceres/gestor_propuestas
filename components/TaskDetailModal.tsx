import React, { useState, useMemo } from 'react';
import { Task, TeamMember, User, TaskPriority } from '../types';
import { XIcon, UserGroupIcon, ArrowUpIcon, MinusIcon, ArrowDownIcon } from './Icon';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  proposalId: string;
  teamMembers: TeamMember[];
  currentUser: User | null;
  onAddComment: (proposalId: string, taskId: string, text: string) => void;
}

const priorityIcons: Record<TaskPriority, { icon: React.FC<{className?: string}>; color: string }> = {
    'Alta': { icon: ArrowUpIcon, color: 'text-red-500' },
    'Media': { icon: MinusIcon, color: 'text-yellow-500' },
    'Baja': { icon: ArrowDownIcon, color: 'text-green-500' },
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  proposalId,
  teamMembers,
  currentUser,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const teamMembersMap = useMemo(() => new Map(teamMembers.map(tm => [tm.id, tm])), [teamMembers]);

  if (!isOpen) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && currentUser) {
      onAddComment(proposalId, task.id, commentText.trim());
      setCommentText('');
    }
  };
  
  const sortedComments = useMemo(() => {
    return [...(task.comments || [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [task.comments]);

  const PriorityIcon = priorityIcons[task.priority].icon;
  const priorityColor = priorityIcons[task.priority].color;

  return (
    <div className="relative z-20" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900/80 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{task.title}</h2>
                    <div className="flex items-center mt-2">
                        <PriorityIcon className={`w-5 h-5 mr-2 ${priorityColor}`} />
                        <span className={`text-sm font-semibold ${priorityColor}`}>Prioridad {task.priority}</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 max-w-xl whitespace-pre-wrap">{task.description || 'Sin descripción.'}</p>
                  </div>
                  <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                      <XIcon className="w-6 h-6" />
                  </button>
              </div>

              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Comentarios</h3>
                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4">
                  {sortedComments.length > 0 ? sortedComments.map(comment => {
                      const author = teamMembersMap.get(comment.authorId);
                      return (
                          <div key={comment.id} className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                  <UserGroupIcon className="w-6 h-6 text-gray-500 dark:text-gray-300"/>
                              </div>
                              <div className="flex-1">
                                  <div className="flex items-baseline justify-between">
                                      <p className="font-semibold text-gray-900 dark:text-gray-100">{author?.name || 'Usuario Desconocido'}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString('es-ES')}</p>
                                  </div>
                                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{comment.text}</p>
                                  </div>
                              </div>
                          </div>
                      );
                  }) : (
                    <p className="text-center py-6 text-gray-500 dark:text-gray-400">No hay comentarios en esta tarea todavía.</p>
                  )}
                </div>
                
                <form onSubmit={handleCommentSubmit} className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label htmlFor="task-comment-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Añadir un comentario</label>
                    <textarea
                        id="task-comment-text"
                        rows={3}
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Escribe tu comentario..."
                        required
                    />
                    <div className="mt-3 flex justify-end">
                        <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Publicar
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
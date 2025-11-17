import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Proposal, TeamMember, User, Role, Task, TaskStatus } from '../types';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XIcon, UserIcon, ClockIcon, EllipsisVerticalIcon } from './Icon';

interface TaskListProps {
  proposal: Proposal;
  teamMembers: TeamMember[];
  currentUser: User | null;
  onCreateTask: (proposalId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy' | 'status'>) => void;
  onUpdateTask: (proposalId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'createdBy'>>) => void;
  onDeleteTask: (proposalId: string, taskId: string) => void;
}

const statusStyles: Record<TaskStatus, { bg: string, text: string, border: string }> = {
  'Pendiente': { bg: 'bg-gray-100 dark:bg-gray-900/50', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-400' },
  'En Progreso': { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500' },
  'Completada': { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-300', border: 'border-green-500' },
};

const TaskList: React.FC<TaskListProps> = ({ proposal, teamMembers, currentUser, onCreateTask, onUpdateTask, onDeleteTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedAssignedTo, setEditedAssignedTo] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const teamMembersMap = useMemo(() => new Map(teamMembers.map(tm => [tm.id, tm])), [teamMembers]);
  const hasRole = (role: Role) => currentUser?.roles.includes(role) ?? false;
  const canManageTasks = !proposal.isArchived && (hasRole('Admin') || hasRole('ProjectManager'));
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuTaskId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    onCreateTask(proposal.id, {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
    });
    setNewTaskTitle('');
    setNewTaskDescription('');
  };
  
  const handleStartEdit = (task: Task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedAssignedTo(task.assignedToId || '');
    setEditedDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleSaveEdit = (taskId: string) => {
    const dueDate = editedDueDate ? new Date(editedDueDate) : undefined;
    if (dueDate) {
        dueDate.setMinutes(dueDate.getMinutes() + dueDate.getTimezoneOffset());
    }
    const dueDateUtc = dueDate ? new Date(Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())) : undefined;

    onUpdateTask(proposal.id, taskId, {
      title: editedTitle.trim(),
      description: editedDescription.trim() || undefined,
      assignedToId: editedAssignedTo || undefined,
      dueDate: dueDateUtc,
    });
    setEditingTask(null);
  };

  const assignedTeamMembers = useMemo(() => {
    return teamMembers.filter(tm => proposal.assignedTeam.some(at => at.memberId === tm.id));
  }, [proposal.assignedTeam, teamMembers]);
  
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = { 'Pendiente': [], 'En Progreso': [], 'Completada': [] };
    proposal.tasks.forEach(task => {
        if (grouped[task.status]) {
            grouped[task.status].push(task);
        }
    });
    // Sort tasks within each status group
    for (const status in grouped) {
      grouped[status as TaskStatus].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return grouped;
  }, [proposal.tasks]);

  const statuses: TaskStatus[] = ['Pendiente', 'En Progreso', 'Completada'];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Tablero de Tareas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map(status => (
          <div key={status} className={`rounded-lg ${statusStyles[status].bg}`}>
            <h4 className={`flex justify-between items-center font-bold p-4 border-b-2 ${statusStyles[status].text} ${statusStyles[status].border}`}>
                {status}
                <span className="text-sm font-normal bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">{tasksByStatus[status].length}</span>
            </h4>
            <div className="p-4 space-y-4 h-[60vh] overflow-y-auto">
              {tasksByStatus[status].map(task => {
                const isEditing = editingTask?.id === task.id;
                const assignee = task.assignedToId ? teamMembersMap.get(task.assignedToId) : null;
                
                return isEditing ? (
                  <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border-2 border-primary-500 space-y-3">
                    <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="w-full font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500"/>
                    <textarea value={editedDescription} onChange={e => setEditedDescription(e.target.value)} rows={3} placeholder="Añadir descripción..." className="mt-2 w-full text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
                     <div className="space-y-2">
                         <select value={editedAssignedTo} onChange={e => setEditedAssignedTo(e.target.value)} className="w-full text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-primary-500">
                           <option value="">Sin asignar</option>
                           {assignedTeamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                         </select>
                         <input type="date" value={editedDueDate} onChange={e => setEditedDueDate(e.target.value)} className="w-full text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
                     </div>
                     <div className="flex items-center justify-end space-x-2 pt-2">
                        <button onClick={handleCancelEdit} className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                        <button onClick={() => handleSaveEdit(task.id)} className="px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">Guardar</button>
                     </div>
                  </div>
                ) : (
                  <div key={task.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-l-4 ${statusStyles[task.status].border}`}>
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-800 dark:text-gray-100 pr-2">{task.title}</p>
                      {canManageTasks && (
                        <div className="relative flex-shrink-0">
                          <button onClick={() => setActiveMenuTaskId(task.id === activeMenuTaskId ? null : task.id)} className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <EllipsisVerticalIcon className="w-5 h-5"/>
                          </button>
                          {activeMenuTaskId === task.id && (
                              <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 ring-1 ring-black dark:ring-gray-700 ring-opacity-5">
                                  <div className="py-1">
                                      <p className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400">Mover a</p>
                                      {statuses.filter(s => s !== task.status).map(newStatus => (
                                          <button key={newStatus} onClick={() => { onUpdateTask(proposal.id, task.id, { status: newStatus }); setActiveMenuTaskId(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                                              {newStatus}
                                          </button>
                                      ))}
                                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                      <button onClick={() => { handleStartEdit(task); setActiveMenuTaskId(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">Editar</button>
                                      <button onClick={() => { onDeleteTask(proposal.id, task.id); setActiveMenuTaskId(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50">Eliminar</button>
                                  </div>
                              </div>
                          )}
                        </div>
                      )}
                    </div>
                     {task.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{task.description}</p>
                    )}
                    {(assignee || task.dueDate) && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2 space-x-3">
                        {assignee && <span className="flex items-center" title={`Asignado a: ${assignee.name}`}><UserIcon className="w-4 h-4 mr-1"/>{assignee.alias || assignee.name.split(' ')[0]}</span>}
                        {task.dueDate && <span className="flex items-center" title={`Vence: ${new Date(task.dueDate).toLocaleDateString()}`}><ClockIcon className="w-4 h-4 mr-1"/>{new Date(task.dueDate).toLocaleDateString('es-ES')}</span>}
                      </div>
                    )}
                  </div>
                )
              })}
              {tasksByStatus[status].length === 0 && (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No hay tareas.</div>
              )}
               {status === 'Pendiente' && canManageTasks && (
                <form onSubmit={handleCreateTask} className="mt-2 pt-2 space-y-2">
                   <input
                    type="text"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    placeholder="Título de la tarea..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                  <textarea
                    value={newTaskDescription}
                    onChange={e => setNewTaskDescription(e.target.value)}
                    placeholder="Añadir una descripción (opcional)..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button type="submit" className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Añadir Tarea
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

import React, { useState, useEffect, useMemo } from 'react';
import LoginPage from './pages/LoginPage';
import { Task, TaskStatus, User, Priority } from './types';
import { storageService } from './services/storageService';
import Sidebar from './components/Sidebar';
import TaskItem from './components/TaskItem';
import Stats from './components/Stats';
import TaskForm from './components/TaskForm';
import AdminPage from './pages/AdminPage';
import { ICONS } from './constants';






const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(storageService.getAuth());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>(TaskStatus.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // This connects the 'process' by fetching from your API
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users'); // Replace with your URL
        const data = await response.json();
        setAllUsers(data); // Put data into state
      } catch (error) {
        console.error("Connection failed", error);
      }
    };
    fetchUsers();
  }, []);

  // Load tasks on mount
  useEffect(() => {
    const savedTasks = storageService.getTasks();
    setTasks(savedTasks);
    setIsLoaded(true);
  }, []);

  // Save tasks on change
  useEffect(() => {
    if (isLoaded) {
      storageService.saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    storageService.setAuth(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    storageService.clearAuth();
  };

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskData.title || '',
      dueDate: taskData.dueDate || new Date().toISOString(),
      priority: taskData.priority || Priority.MEDIUM,
      isUpcoming: false,
      isCompleted: false,
      isImportant: false,
      createdAt: new Date().toISOString(),
      email: user?.email || '',
      reminderTime: taskData.reminderTime || '',
      user_id: user ? user.id.toString() : '',
      completed: false,
    
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));

  };
  
  const toggleUpcoming = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isUpcoming: !t.isUpcoming } : t));
  };
  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const toggleImportant = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isImportant: !t.isImportant } : t));
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filter by category
    if (filter === TaskStatus.TODAY) {
      const today = new Date().toDateString();
      result = result.filter(t => new Date(t.dueDate).toDateString() === today);
    } else if (filter === TaskStatus.IMPORTANT) {
      result = result.filter(t => t.isImportant);
    
    } else if (filter === TaskStatus.UPCOMING) {
      result = result.filter(t => t.isUpcoming);
    } else if (filter === TaskStatus.COMPLETED) {
      result = result.filter(t => t.isCompleted);
    }

    // Search query
    if (searchQuery) {
      result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return result;
  }, [tasks, filter, searchQuery]);

  const taskCounts = {
    [TaskStatus.ALL]: tasks.length,
    [TaskStatus.TODAY]: tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length,
   

[TaskStatus.UPCOMING]: tasks.filter(t =>
  !t.isCompleted &&
  new Date(t.dueDate) >= new Date(new Date().setHours(0, 0, 0, 0))
).length,

    [TaskStatus.IMPORTANT]: tasks.filter(t => t.isImportant).length,
    [TaskStatus.COMPLETED]: tasks.filter(t => t.isCompleted).length,
  };
  // Move this INSIDE the App component to access 'user'
const handleManualReminder = async (taskTitle: string, dueDate: string) => {
  if (!user || !user.email) {
    console.error("No user logged in or email missing");
    return;
  }
  
  try {
    await triggerEmailReminder(user.email, taskTitle, dueDate);
    alert("Reminder sent to " + user.email);
  } catch (error) {
    console.error("Error:", error);
  }
};

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 selection:bg-blue-100">
      <Sidebar currentFilter={filter} setFilter={setFilter} taskCounts={taskCounts} />

      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-6">
           
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{user.role}</p>
              </div>
            
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <ICONS.Logout className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

{user.role === 'admin' && filter === TaskStatus.ALL ? (
  <AdminPage 
    tasks={tasks} 
    user={allUsers} // This sends the data into the table
    currentUser={user} 
  />
) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{filter}</h1>
                  <p className="text-sm text-black-500 mt-1">Manage your productivity effortlessly.</p>
                </div>
                <button 
                  onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95"
                >
                  <ICONS.Plus className="w-5 h-5" />
                  New Task
                </button>
              </div>

              {filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-1">
                  {filteredTasks.map((task, idx) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      index={idx}
                      user={user}
                    
                    
                      onToggleComplete={toggleComplete}
                      onToggleImportant={toggleImportant}
                      onDelete={deleteTask}
                    
                      onEdit={(t) => { setEditingTask(t); setIsFormOpen(true); }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-24 h-24 text-blue-300" fill="none" viewBox="0 0 32 32" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">No tasks found</h3>
                  <p className="text-gray-400 text-sm mt-2 max-w-xs">Everything is under control. Take a break or create a new task to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {user.role !== 'admin' && <Stats tasks={tasks} />}

      <TaskForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSubmit={(data) => {
          if (editingTask) {
            updateTask(editingTask.id, data);
          } else {
            addTask(data);
          }
        }}
        initialData={editingTask}
      />
    
      
      

    </div>
  );
};

export default App;
function triggerEmailReminder(email: any, taskTitle: string, dueDate: string) {
  throw new Error('Function not implemented.');
}

function startofToday() {
  throw new Error('Function not implemented.');
}


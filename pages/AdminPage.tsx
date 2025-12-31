import React from 'react';
import { Task, User } from '../types';

interface AdminPageProps {
  tasks?: Task[];
  users?: User[];
  currentUser: User;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  tasks = [], 
  users = [], 
  currentUser 
}) => {
  
  // Calculate stats safely to prevent "reading length of undefined"
  const stats = [
    { label: 'Total Tasks', value: tasks?.length || 0 },
    { label: 'Completed', value: tasks?.filter(t => t.isCompleted).length || 0 },
    { label: 'Important', value: tasks?.filter(t => t.isImportant).length || 0 },
    { label: 'Total Users', value: users?.length || 0 },
  ];

  return (
    <div className="flex-1 h-full bg-[#f8fafc] overflow-y-auto p-4 lg:p-8 custom-scrollbar">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">ZenTask Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">System-wide performance and user management.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-black text-slate-800">{stat.value}</span>
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-[10px]">↑</div>
              </div>
            </div>
          ))}
        </div>

        {/* Professional User Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Registered Users</h3>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase">Management</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                  <th className="px-8 py-4">User Details</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Identifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-xs font-semibold text-slate-600 uppercase tracking-tighter">Active</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right font-mono text-xs text-slate-300">
                        #{user.id}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 italic">
                      No user records found. Check your database connection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

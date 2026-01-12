
import React, { useEffect, useState } from "react";
import { Task, User } from "../types";

interface AdminPageProps {
  tasks?: Task[];
  user: User[];
  currentUser: User;
}

const AdminPage: React.FC<AdminPageProps> = ({
  tasks = [],
  currentUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch ACTIVE users from backend
  useEffect(() => {
    fetch("http://localhost:8000/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      });
  }, []);

  // 🔹 Stats
  const stats = [
    { label: "Total Tasks", value: tasks.length },
    { label: "Completed", value: tasks.filter(t => t.isCompleted).length },
    { label: "Important", value: tasks.filter(t => t.isImportant).length },
    { label: "Total Users", value: users.length },
  ];

  return (
    <div className="flex-1 h-full bg-[#f8fafc] overflow-y-auto p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            ZenTask Admin Panel
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            System-wide performance and user management.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-[2rem] border shadow-sm"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {stat.label}
              </span>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-black text-slate-800">
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
          <div className="p-8 border-b flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Registered Users</h3>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">
              MANAGEMENT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold">
                  <th className="px-8 py-4">User Details</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Identifier</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center font-bold">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold">
                              {user.email}
                            </p>
                            <p className="text-xs text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-100 text-green-700">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-8 py-5">
                        <span className="text-xs font-semibold text-emerald-600">
                          {user.email}
                        </span>
                      </td>

                      <td className="px-8 py-5 text-right font-mono text-xs text-slate-400">
                        #{user.id}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-slate-400">
                      No active users found
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

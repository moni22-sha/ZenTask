import { Task } from "../types";

export async function createTask(task: Partial<Task>) {
  const user = JSON.parse(localStorage.getItem("user")!);

  if (!user?.id) {
    throw new Error("User not logged in");
  }

  const res = await fetch("http://localhost:5000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: task.title,
      due_date: task.dueDate,          // ✅ mapped
      reminder_time: task.reminderTime, // ✅ mapped
      priority: task.priority,
      user_id: user.id,                // ✅ IMPORTANT
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
}


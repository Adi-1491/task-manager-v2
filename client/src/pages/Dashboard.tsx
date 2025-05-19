import { useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task Title is Required!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (editingTaskId) {
        // UPDATE
        await axios.put(
          `http://localhost:8000/api/tasks/updatetask/${editingTaskId}`,
          { title, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task updated successfully");
        handleCancelEdit();
      } else {
        // CREATE
        await axios.post(
          "http://localhost:8000/api/tasks/createtask",
          { title, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task added successfully");
        setTitle("");
        setStatus("pending");
      }

      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error(editingTaskId ? "Failed to update task" : "Failed to add task");
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/tasks/gettask/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTasks = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/tasks/deletetask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task Deleted");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = (task: any) => {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setStatus(task.status);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setTitle("");
    setStatus("pending");
  };

  const toggleTaskStatus = async (task: any) => {
    const token = localStorage.getItem("token");
    const newStatus = task.status === "completed" ? "pending" : "completed";
  
    try {
      await axios.put(
        `http://localhost:8000/api/tasks/updatetask/${task._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task status");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🗂️ Your Task Dashboard
      </h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="flex gap-4 justify-center mb-6">
        <input
          type="text"
          value={title}
          placeholder="Enter task title"
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border rounded-lg w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        {editingTaskId ? (
          <>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        )}
      </form>

      {/* Task List Section */}
      <div className="max-w-2xl mx-auto bg-gray-50 shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Your Tasks:</h2>
        <ul className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet. Add some!</p>
          ) : (
            tasks.map((task: any) => (
            <li
              key={task._id}
              className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center border"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => toggleTaskStatus(task)}
                  className="w-5 h-5 accent-green-600"
                />
                <div>
                  <p className={`text-lg font-semibold ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
                    {task.title}
                  </p>
                  <p
                    className={`text-sm ${
                      task.status === "completed" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {task.status === "completed" ? "✅ Completed" : "⏳ Pending"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(task)} className="hover:text-yellow-500">
                  <Pencil />
                </button>
                <button onClick={() => deleteTasks(task._id)} className="hover:text-red-600">
                  <Trash2 />
                </button>
              </div>
            </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

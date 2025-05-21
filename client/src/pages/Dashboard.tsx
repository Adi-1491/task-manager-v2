import { useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  email: string;
}

const token  = localStorage.getItem("token");
let displayName = "User";

if(token)
{
  const decoded : JwtPayload = jwtDecode(token);
  const email = decoded.email;
  const name = email.split("@")[0];
  displayName = name.charAt(0).toUpperCase() + name.slice(1);
}


const Dashboard: React.FC = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task Title is Required!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (editingTaskId) {
        await axios.put(
          `http://localhost:8000/api/tasks/updatetask/${editingTaskId}`,
          { title, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task updated successfully");
        handleCancelEdit();
      } else {
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

      const sortedTasks = tasks.slice().sort((a: any, b: any) => {
        // Sort by completed status - incomplete first
        if (a.status === "completed" && b.status !== "completed") return 1; //put b before a
        if (a.status !== "completed" && b.status === "completed") return -1; //put a before b
        return 0;
      });
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] pb-10">
      {/* Navbar */}
      <header className="bg-black bg-opacity-30 backdrop-blur-lg border-b border-white/20 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center items-center">
        <h2 className="absolute left-6 text-white ml-4 text-lg">Hello, {displayName}!</h2>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center tracking-wide select-none">
            Your Task Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className=" absolute right-6 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-full shadow-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 flex flex-col items-center mt-8">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-6 shadow-2xl"
        >
          <input
            type="text"
            value={title}
            placeholder="Enter task title"
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-5 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-md"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-40 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-md"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {editingTaskId ? (
            <>
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 transition"
              >
                Update Task
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 bg-opacity-40 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 transition"
            >
              Add Task
            </button>
          )}
        </motion.form>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full mt-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold mb-5 text-white">Your Tasks:</h2>
          <ul className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-gray-300 text-center">No tasks yet. Add some!</p>
            ) : (
              sortedTasks.map((task: any) => (
                <li
                  key={task._id}
                  className="p-4 bg-white/20 rounded-xl shadow-md flex justify-between items-center border border-white/30"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => toggleTaskStatus(task)}
                      className="w-6 h-6 accent-pink-500 cursor-pointer"
                    />
                    <div>
                      <p
                        className={`text-lg font-semibold text-white ${
                          task.status === "completed" ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-sm">
                        {task.status === "completed" && (
                          <span className="text-pink-400">✅ Completed</span>
                        )}
                        {task.status === "pending" && (
                          <span className="text-yellow-400">⏳ Pending</span>
                        )}
                        {task.status === "in progress" && (
                          <span className="text-violet-400">🛠️ In Progress</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 text-white">
                    <button
                      onClick={() => handleEdit(task)}
                      className="hover:text-yellow-400 transition"
                      aria-label="Edit Task"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => deleteTasks(task._id)}
                      className="hover:text-pink-600 transition"
                      aria-label="Delete Task"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

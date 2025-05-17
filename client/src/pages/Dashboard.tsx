import { useEffect, useState } from "react";
import React from 'react';
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard: React.FC = () => {
  const[title,setTitle] = useState('');
  const[status,setStatus] = useState('pending');
  const[tasks,setTasks] = useState([]);  //holds an array of tasks object

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!title.trim()){ //trims all the spaces and check if we have nothing(i.e only space) after trimming 
      toast.error("Task Title is Required!");
      return;
    }
    try{
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/api/tasks/createtask",
        {title, status},
        {
          headers:{
            Authorization: `Bearer ${token}`
          },
        });
      toast.success("Task added successfully");
      setTitle('');
      setStatus('pending');
      console.log(response.data);
      fetchTasks(); //calling task after creating so that it updates after task is created
    }
    catch(error)
    {
      console.error(error);
    toast.error("Failed to add task");
    }
  }

    const fetchTasks = async () => {
      try
      {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/tasks/gettask/",
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });
          setTasks(response.data);
      }
      catch(error)
      {
        console.error(error);
        toast.error("Failed to fetch tasks");
      }
    };
    useEffect(()=>{
      fetchTasks();
    },[])

    const deleteTasks = async (taskId: string) => {
      try{
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/tasks/deletetask/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });
          toast.success("Task Deleted");
          fetchTasks();
      }
      catch(error)
      {
        console.error(error);
        toast.error("Failed to delete task");
      }
    };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🗂️ Your Task Dashboard
      </h1>

      {/* Form Section */}
      <form onSubmit = { handleSubmit } className="flex gap-4 justify-center mb-6">
        <input
          type="text"
          value={title}
          placeholder="Enter task title"
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border rounded-lg w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </form>

      {/* Task List Section */}
      <div className="max-w-2xl mx-auto bg-gray-50 shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Your Tasks:</h2>
        <ul className="space-y-3">
          {tasks.length === 0 ?(
            <p className="text-gray-500">No tasks yet. Add some!</p>
          ):(
            tasks.map((task: any) => (
            <li
              key={task._id}
              className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center border"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="text-lg font-semibold text-gray-800">{task.title}</span>
                <span
                  className={`mt-1 sm:mt-0 text-sm font-medium px-2 py-1 rounded-full ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status === "completed" ? "✅ Completed" : "⏳ Pending"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTasks(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                >
                  Delete
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

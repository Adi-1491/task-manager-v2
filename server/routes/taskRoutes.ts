import express from 'express'
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController';
import authMiddleware  from '../middleware/authMiddleware';
const router = express.Router();

router.post('/createtask',authMiddleware,createTask);

router.get('/gettask',authMiddleware,getTasks);

router.put('/updatetask/:id',authMiddleware,updateTask);

router.delete('/deletetask/:id',authMiddleware,deleteTask);

export default router;
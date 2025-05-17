import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/LoginPage';
import Register from './pages/Register';
import './App.css';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <>
    <ToastContainer position='top-right' autoClose={3000} theme='colored'/>
    <BrowserRouter>
      <Routes>
        <Route 
          path='/dashboard' 
          element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
          }
          />
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

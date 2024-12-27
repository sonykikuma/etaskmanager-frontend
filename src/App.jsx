import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route, Navigate } from "react-router-dom";
import RefreshHandler from "./components/RefreshHandler";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ProjectDetail from "./pages/ProjectDetail";
import TaskDetail from "./pages/TaskDetail";
import Header from "./components/Header";
import Projects from "./components/Projects";
import TaskForm from "./components/TaskForm";
import Teams from "./pages/Teams";
import Reports from "./pages/Reports";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const PrivateRoute = ({ element }) => {
    return isAuth ? element : <Navigate to="/login" />;
  };

  return (
    <>
      <div className="container">
        {/* <RefreshHandler setIsAuth={setIsAuth} /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/newTask" element={<TaskForm />} />
          {/* <Route path="/home" element={<PrivateRoute element={<Home />} />} /> */}
          <Route path="/teams" element={<Teams />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Batch from "./pages/Batch";
import Subject from "./pages/Subject";
import Form from "./pages/Form";
import Responses from "./pages/Responses";
import Response from "./pages/Response";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/batch" element={<Batch />} />
        <Route path="/subject" element={<Subject />} />
        <Route path="/form" element={<Form />} />
        <Route path="/responses" element={<Responses />} />
        <Route path="/response/:formid" element={<Response />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;

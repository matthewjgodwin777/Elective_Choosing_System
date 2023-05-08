import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function loginUser(event) {
    event.preventDefault();
    const res = await axios.post("http://localhost:3000/adminUser/login", {
      email: email,
      password: password,
    });
    if (res.data.user) {
      localStorage.setItem("token", res.data.user);
      // window.location.href = "/dashboard";
      toast.success("Login Successful!", { theme: "colored" });
      nav("/dashboard");
    } else {
      toast.error("Login Unsuccessful!", { theme: "colored" });
    }
  }

  return (
    <div className="h-screen flex">
      <div className="flex-1 grid place-items-center bg-purple-500 text-white">
        <div>
          <p className="text-5xl font-bold">ECS</p>
          <p className="text-xl font-semibold">
            Elective
          </p>
          <p className="text-xl font-semibold">Choosing System</p>
        </div>
      </div>
      <div className="flex-1 grid place-items-center">
        <form className="flex flex-col gap-3 w-1/2" onSubmit={loginUser}>
          <h1 className="font-bold text-3xl">Admin Login</h1>
          <label className="font-semibold">Email</label>
          <input
            className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <label className="font-semibold">Password</label>
          <input
            className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <input
            className="bg-purple-500 rounded-lg p-2 hover:bg-purple-800 text-white font-semibold"
            type="submit"
            value="Login"
          />
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;

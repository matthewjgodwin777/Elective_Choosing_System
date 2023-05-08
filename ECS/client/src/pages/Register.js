import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("empty");
  const [batches, setBatches] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:3000/batch");
      console.log(res.data);
      res.data.forEach((item) => {
        setBatches((b) => [...b, item]);
      });
    };
    fetchData();
  }, []);

  function getBatchString(batch) {
    return `${batch.start} - ${batch.end} (${batch.department})`;
  }

  async function registerUser(event) {
    event.preventDefault();
    const res = await fetch("http://localhost:3000/studentUser/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        batch: batch,
        registrationNumber: registrationNumber,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "ok") {
      toast.success("Registration Successful!", { theme: "colored" });
      nav("/Login");
    } else {
      toast.error("Registration Unsuccessful!", { theme: "colored" });
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
        <form className="flex flex-col gap-3 w-1/2" onSubmit={registerUser}>
          <h1 className="font-bold text-3xl">Sign Up</h1>

          <label className="font-semibold">Name</label>
          <input
            className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
          />

          <label className="font-semibold">Batch</label>
          <select
            className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
            value={batch}
            onChange={(e) => {
              console.log(e.target.value);
              setBatch(e.target.value);
            }}
          >
            <option default value="empty">
              ----
            </option>
            {batches.map((batch) => {
              return (
                <option key={batch._id} value={batch._id}>
                  {getBatchString(batch)}
                </option>
              );
            })}
          </select>

          <label className="font-semibold">Email</label>
          <input
            className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />

          <label className="font-semibold">Registration Number</label>
          <input
            className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            type="number"
            placeholder="Registration Number"
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
            value="Register"
            disabled={batch === "empty"}
          />
          <p>
            Existing user? &nbsp;
            <Link className="underline text-purple-500" to="/login">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

import axios from "axios";
import jwt from "jsonwebtoken";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import StudentNavigationBar from "./StudentNavigationbar";

function Response() {
  const [state, setState] = useState({
    loading: true,
    user: {},
    priority: [],
    priority1: [],
    priority2: [],
    priority3: [],
    formid: "",
    form: {},
    formValues: {
      priority1: "",
      priority2: "",
      priority3: "",
    },
  });
  const nav = useNavigate();

  let { formid } = useParams();
  console.log(`formid: ${formid}`);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      form: formid,
      student: state.user.id,
      priority1: state.formValues.priority1,
      priority2: state.formValues.priority2,
      priority3: state.formValues.priority3,
    };
    console.log(data);
    axios.post("http://localhost:3000/response", data).then((res) => {
      toast.success("Submitted!", { theme: "colored" });
    });
    nav("/studentDashboard");
  }

  async function handlePriorityChange(e) {
    const { name, value } = e.target;

    setState((prev) => {
      return { ...prev, formValues: { ...prev.formValues, [name]: value } };
    });

    setState((prev) => {
      let priority2 = prev.priority.filter(
        (i) => i.code !== prev.formValues.priority1
      );
      let priority3 = prev.priority.filter(
        (i) =>
          i.code !== prev.formValues.priority1 &&
          i.code !== prev.formValues.priority2
      );

      return { ...prev, priority2: priority2, priority3: priority3 };
    });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwt.verify(token, "secret123");
    console.log(decoded);

    setState({ ...state, loading: true });
    let dept = "";
    let elective = "";

    axios.get(`http://localhost:3000/form/${formid}`).then((res) => {
      setState((prev) => {
        return { ...prev, form: res.data };
      });
      dept = JSON.parse(res.data.batch).department;
      elective = res.data.elective;
      axios
        .get(`http://localhost:3000/subject/${elective}/${dept}`)
        .then((res) => {
          setState((prev) => {
            return {
              ...prev,
              priority: res.data,
              priority1: res.data,
              priority2: res.data,
              priority3: res.data,
              user: decoded,
              loading: false,
            };
          });
        });

      axios.get(`http://localhost:3000/elective/${elective}`).then((res) => {
        console.log(res);
        setState((prev) => {
          return {
            ...prev,
            form: { ...prev.form, elective: res.data.name },
          };
        });
      });
    });
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex flex-col gap-6">
      <StudentNavigationBar />
      <div className="grid place-items-center h-screen">
        <form
          className="w-1/2 bg-white shadow-xl rounded-xl p-10"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-3">
            <h1 className="text-center text-5xl my-5s font-semibold">
              {state.form.elective}
            </h1>
            <div>
              <span className="font-semibold">Start Time:</span>
              <span> {state.form.startTime}</span>
            </div>
            <div>
              <span className="font-semibold">End Time:</span>
              <span> {state.form.endTime}</span>
            </div>
            <div className="grid">
              <label className="font-semibold">Priority 1</label>
              <select
                name="priority1"
                className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
                value={state.formValues.priority1}
                onChange={handlePriorityChange}
                defaultValue="empty"
              >
                <option value="">----</option>

                {state.priority1.map((subject) => {
                  return (
                    <option key={subject._id} value={subject.code}>
                      {subject.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="grid">
              <label className="font-semibold">Priority 2</label>
              <select
                name="priority2"
                className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
                value={state.formValues.priority2}
                onChange={handlePriorityChange}
                defaultValue="empty"
              >
                <option value="">----</option>

                {state.priority2.map((subject) => {
                  return (
                    <option key={subject._id} value={subject.code}>
                      {subject.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="grid">
              <label className="font-semibold">Priority 3</label>
              <select
                name="priority3"
                className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
                value={state.formValues.priority3}
                onChange={handlePriorityChange}
                defaultValue="empty"
              >
                <option value="">----</option>

                {state.priority3.map((subject) => {
                  return (
                    <option key={subject._id} value={subject.code}>
                      {subject.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              disabled={
                state.formValues.priority1 === "" ||
                state.formValues.priority2 === "" ||
                state.formValues.priority3 === ""
              }
              type="submit"
              className="border-2 border-black p-2 rounded-lg font-semibold hover:text-white hover:bg-black disabled:text-white disabled:bg-black"
            >
              {state.formValues.priority1 === "" ||
              state.formValues.priority2 === "" ||
              state.formValues.priority3 === "" ? (
                <>
                  <i className="fa-solid fa-lock"></i>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-save"></i>
                  <span className="ml-6">Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Response;

import axios from "axios";
import jwt from "jsonwebtoken";
import React from "react";
import { Link } from "react-router-dom";
import StudentNavigationBar from "./StudentNavigationbar";

class StudentDashboard extends React.Component {
  state = {
    loading: true,
    data: {},
    future: [],
    past: [],
    filled: [],
    user: {},
  };

  async componentDidMount() {
    const token = localStorage.getItem("token");
    const decoded = jwt.verify(token, "secret123");
    console.log(decoded);

    this.setState({ ...this.state, user: decoded });
    const forms = await axios.get(
      `http://localhost:3000/studentDashboard/${decoded.id}`
    );

    console.log(forms);

    this.setState({
      ...this.state,
      user: decoded,
      future: forms.data.future,
      past: forms.data.past,
      filled: forms.data.filled,
    });
  }

  async handleClick(e, form) {
    const res = await axios.get(
      `http://localhost:3000/response/form/${form}/student/${this.state.user.id}`
    );
    this.setState((prev) => {
      return {
        ...prev,
        data: res.data,
      };
    });
  }

  render() {
    return (
      <div className="h-screen flex flex-col gap-6 bg-gray-100">
        <StudentNavigationBar />
        <h1 className="text-5xl font-semibold text-center">
          Hey {this.state.user.name}!
        </h1>
        <div className="mx-6">
          <h2 className="text-3xl">Forms to be filled: </h2>
          {this.state.future.length === 0 ? (
            <div className="my-6 border h-32 grid place-items-center rounded-xl bg-purple-100 my-6">
              No forms left to be filled
            </div>
          ) : (
            <div className="my-6 grid grid-cols-2 gap-4 bg-purple-100 p-8 rounded-xl">
              {this.state.future.map((form) => {
                return (
                  <div className="bg-white border p-4 flex justify-between items-center rounded shadow-lg">
                    <div>
                      <div className="font-semibold text-3xl">
                        {form.elective}
                      </div>
                      <div className="text-sm">
                        <p>Start Time: {form.startTime}</p>
                        <p>End Time: {form.endTime}</p>
                      </div>
                    </div>
                    <Link to={"/response/" + form._id} className="flex gap-2">
                      <button className="px-3 py-2 font-semibold text-white bg-green-500 hover:bg-green-800 rounded ">
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span className="ml-6">Fill</span>
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="mx-6">
          <h2 className="text-3xl">Forms History: </h2>
          {this.state.past.length === 0 && this.state.filled.length === 0 ? (
            <div className="my-6 border h-32 grid place-items-center rounded-xl bg-purple-100 my-6">
              No forms left to be filled
            </div>
          ) : (
            <div className="my-6 grid grid-cols-2 gap-4 bg-purple-100 p-8 rounded-xl">
              {this.state.past.map((form) => {
                return (
                  <div className="bg-white border p-4 flex justify-between items-center rounded shadow-lg">
                    <div>
                      <div className="font-semibold text-3xl">
                        {form.elective}
                      </div>
                      <div className="text-sm">
                        <p>Start Time: {form.startTime}</p>
                        <p>End Time: {form.endTime}</p>
                      </div>
                    </div>
                    <div className="px-3 py-2 font-semibold text-white rounded bg-red-500">
                      <i className="fa-solid fa-xmark"></i>
                      <span className="ml-6">Missed</span>
                    </div>
                  </div>
                );
              })}
              {this.state.filled.map((form) => {
                return (
                  <div className="bg-white border p-4 flex justify-between items-center rounded shadow-lg">
                    <div>
                      <div className="font-semibold text-3xl">
                        {form.elective}
                      </div>
                      <div className="text-sm">
                        <p>Start Time: {form.startTime}</p>
                        <p>End Time: {form.endTime}</p>
                      </div>
                    </div>
                    {form.allocated === "true" ? (
                      <div>
                        <button
                          className="px-3 py-2 font-semibold text-white rounded bg-green-500 hover:bg-green-800"
                          onClick={(e) => {
                            console.log(e);
                            this.handleClick(e, form._id);
                          }}
                        >
                          <i className="fa-solid fa-graduation-cap"></i>
                          <span className="ml-6">Check Allocation</span>
                        </button>
                        <p>
                          {/* {JSON.stringify(this.state.data)} */}
                          {this.state.data &&
                            this.state.data.form === form._id &&
                            this.state.data.allocated}
                          {this.state.data &&
                            this.state.data.form === form._id &&
                            this.state.data.allocated === "" && "Not Alloted"}
                        </p>
                      </div>
                    ) : (
                      <div className="px-3 py-2 font-semibold text-white rounded bg-orange-500">
                        <i className="fa-solid fa-check"></i>
                        <span className="ml-6">Submitted</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default StudentDashboard;

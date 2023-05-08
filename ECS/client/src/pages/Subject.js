import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import AdminNavigationBar from "./AdminNavigationBar";

class Subject extends React.Component {
  state = {
    add: true,
    loading: true,
    formValues: { _id: "", name: "", code: "", elective: "", department: "" },
    departments: [],
    electives: [],
  };

  handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      formValues: { ...this.state.formValues, [name]: value },
    });
  };

  handleAdd = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:3000/subject/`, this.state.formValues);

    this.setState({ ...this.state, formValues: {} });
    toast.success("Subject Added!", { theme: "colored" });
    this.refresh();
  };

  handleEditSave = async (e) => {
    e.preventDefault();
    this.setState({ ...this.state, loading: true });

    await axios.patch(
      `http://localhost:3000/subject/${this.state.formValues._id}`,
      this.state.formValues
    );

    console.log(this.state.formValues);
    toast.success("Subject Edited!", { theme: "colored" });
    this.refresh();
  };

  handleEditClick = async (e, id) => {
    let res = await axios.get(`http://localhost:3000/subject/${id}`);
    this.setState({ ...this.state, formValues: res.data, add: false });
  };

  handleDelete = async (e, id) => {
    this.setState({ ...this.state, loading: true });
    await axios.delete(`http://localhost:3000/subject/${id}`);
    toast.success("Subject Deleted!", { theme: "colored" });
    this.refresh();
  };

  refresh = async () => {
    const res = await axios.get("http://localhost:3000/subject");
    this.setState({ ...this.state, data: res.data, loading: false });
  };

  async componentDidMount() {
    const res = await axios.get("http://localhost:3000/subject");
    const dept = await axios.get("http://localhost:3000/department");
    const electives = await axios.get("http://localhost:3000/elective");

    this.setState({
      ...this.state,
      data: res.data,
      departments: dept.data,
      electives: electives.data,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="h-screen grid place-items-center">
          <i className="fa-solid fa-spinner"></i>
        </div>
      );
    }

    return (
      <div className="h-screen grid grid-cols-5">
        <AdminNavigationBar />
        <div className="col-span-2 grid place-items-center px-2 border-r-2 border-black">
          <form
            className="w-3/4 grid gap-4"
            onSubmit={
              this.state.add === false ? this.handleEditSave : this.handleAdd
            }
          >
            <h1 className="text-black font-bold text-3xl">
              {this.state.add === false ? "Edit" : "Add new"} subject
            </h1>
            <label className="font-semibold">Name</label>
            <input
              name="name"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.name || ""}
              onChange={this.handleChange}
              type="text"
              placeholder="Name"
            />
            <label className="font-semibold">Code</label>
            <input
              name="code"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.code || ""}
              onChange={this.handleChange}
              type="text"
              placeholder="Code"
            />
            <label className="font-semibold">Department</label>
            <select
              name="department"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.department}
              onChange={this.handleChange}
            >
              <option value="">----</option>
              {this.state.departments.map((department) => {
                return (
                  <option key={department._id} value={department.short}>
                    {department.short}
                  </option>
                );
              })}
            </select>
            <label className="font-semibold">Elective</label>
            <select
              name="elective"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.elective}
              onChange={this.handleChange}
            >
              <option value="">----</option>
              {this.state.electives.map((elective) => {
                return (
                  <option key={elective._id} value={elective.short}>
                    {elective.name}
                  </option>
                );
              })}
            </select>
            <button
              disabled={
                this.state.formValues.elective === "" ||
                this.state.formValues.department === ""
              }
              type="submit"
              className="border-2 border-black p-2 rounded-lg font-semibold hover:text-white hover:bg-black disabled:text-white disabled:bg-black"
            >
              {this.state.formValues.elective === "" ||
              this.state.formValues.department === "" ? (
                <>
                  <i className="fa-solid fa-lock"></i>
                </>
              ) : this.state.add === false ? (
                <>
                  <i className="fa-solid fa-pen"></i>
                  <span className="ml-6">Edit</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus"></i>
                  <span className="ml-6">Add</span>
                </>
              )}
            </button>
            {this.state.add === false && (
              <button
                className="underline text-purple-500"
                onClick={(e) =>
                  this.setState({ ...this.state, add: true, formValues: {} })
                }
              >
                Go back to add
              </button>
            )}
          </form>
        </div>
        <div className="pl-10 col-span-2 m-10 overflow-y-auto">
          <h2 className="text-3xl font-bold my-6">Subject</h2>
          <div className="grid gap-4">
            {this.state.data.map((subject) => {
              return (
                <div
                  className="border shadow-lg p-4 rounded-lg text-lg flex justify-between gap-2"
                  key={subject._id}
                >
                  <div>
                    <p className="text-lg font-semibold">
                      {subject.code} - {subject.name}
                    </p>
                    <p className="text-sm">Department: {subject.department}</p>
                    <p className="text-sm">Elective: {subject.elective}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => this.handleEditClick(e, subject._id)}
                      className="px-3 py-2 font-semibold text-white bg-yellow-500 hover:bg-yellow-800 rounded"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span className="ml-6">Edit</span>
                    </button>
                    <button
                      onClick={(e) => this.handleDelete(e, subject._id)}
                      className="px-3 py-2 font-semibold text-white bg-red-500 hover:bg-red-800 rounded"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                      <span className="ml-6">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Subject;

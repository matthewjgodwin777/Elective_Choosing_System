import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import AdminNavigationBar from "./AdminNavigationBar";

class Batch extends React.Component {
  state = {
    add: true,
    loading: true,
    formValues: { _id: "", start: "", end: "", department: "" },
    departments: [],
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
    let res = await axios.post(
      `http://localhost:3000/batch/`,
      this.state.formValues
    );

    res = await axios.get("http://localhost:3000/batch");
    this.setState({ ...this.state, data: res.data, loading: false });
    toast.success("Batch Added!", { theme: "colored" });
  };

  handleEditSave = async (e) => {
    e.preventDefault();
    this.setState({ ...this.state, loading: true });

    let res = await axios.patch(
      `http://localhost:3000/batch/${this.state.formValues._id}`,
      this.state.formValues
    );

    console.log(this.state.formValues);

    res = await axios.get("http://localhost:3000/batch");
    this.setState({ ...this.state, data: res.data, loading: false });
    toast.success("Batch Edited!", { theme: "colored" });
  };

  handleEditClick = async (e, id) => {
    let res = await axios.get(`http://localhost:3000/batch/${id}`);
    this.setState({ ...this.state, formValues: res.data, add: false });
  };

  handleDelete = async (e, id) => {
    this.setState({ ...this.state, loading: true });
    let res = await axios.delete(`http://localhost:3000/batch/${id}`);
    res = await axios.get("http://localhost:3000/batch");
    this.setState({ ...this.state, data: res.data, loading: false });
    toast.success("Batch Deleted!", { theme: "colored" });
  };

  async componentDidMount() {
    const res = await axios.get("http://localhost:3000/batch");
    const dept = await axios.get("http://localhost:3000/department");

    this.setState({
      ...this.state,
      data: res.data,
      departments: dept.data,
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
        <div className="grid col-span-2 place-items-center px-2 border-r-2 border-black">
          <form
            className="grid gap-4 w-3/4"
            onSubmit={
              this.state.add === false ? this.handleEditSave : this.handleAdd
            }
          >
            <h1 className="text-black font-bold text-3xl">
              {this.state.add === false ? "Edit" : "Add new"} batch
            </h1>
            <label className="font-semibold">Start Year</label>
            <input
              name="start"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.start || ""}
              onChange={this.handleChange}
              type="text"
              placeholder="Start Year"
            />
            <label className="font-semibold">End Year</label>
            <input
              name="end"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.end || ""}
              onChange={this.handleChange}
              type="text"
              placeholder="End Year"
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
            <button
              disabled={this.state.formValues.department === ""}
              type="submit"
              className="border-2 border-black p-2 rounded-lg font-semibold hover:text-white hover:bg-black disabled:text-white disabled:bg-black"
            >
              {this.state.formValues.department === "" ? (
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
          <h2 className="text-3xl font-bold my-6">Batch</h2>
          <div className="grid gap-4">
            {this.state.data.map((batch) => {
              return (
                <div
                  className="border shadow-lg p-4 rounded-lg text-lg flex justify-between"
                  key={batch._id}
                >
                  <div>
                    <p className="font-semibold">
                      Batch of {batch.start} - {batch.end}
                    </p>
                    <p className="text-sm">Department: {batch.department}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => this.handleEditClick(e, batch._id)}
                      className="px-3 py-1 font-semibold text-white bg-yellow-500 rounded"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span className="ml-6">Edit</span>
                    </button>
                    <button
                      onClick={(e) => this.handleDelete(e, batch._id)}
                      className="px-3 py-1 font-semibold text-white bg-red-500 rounded"
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

export default Batch;

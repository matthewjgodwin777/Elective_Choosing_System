import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import AdminNavigationBar from "./AdminNavigationBar";

class Form extends React.Component {
  state = {
    add: true,
    loading: true,
    formValues: {
      elective: "",
      batch: "",
      startTime: "",
      endTime: "",
    },
    batches: [],
    electives: [],
  };

  handleChange = (e) => {
    // console.log(e.target);
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      formValues: { ...this.state.formValues, [name]: value },
    });
  };

  handleAdd = async (e) => {
    e.preventDefault();
    console.log("Submit: ", this.state.formValues);
    let res = await axios.post(
      `http://localhost:3000/form`,
      this.state.formValues
    );

    res = await axios.get("http://localhost:3000/form");
    this.setState({ ...this.state, data: res.data, loading: false });
    toast.success("Form Added!", { theme: "colored" });
  };

  handleEditSave = async (e) => {
    e.preventDefault();
    this.setState({ ...this.state, loading: true });

    let res = await axios.patch(
      `http://localhost:3000/form/${this.state.formValues._id}`,
      this.state.formValues
    );

    console.log(this.state.formValues);

    res = await axios.get("http://localhost:3000/form");
    this.setState({ ...this.state, data: res.data, loading: false });
    toast.success("Form Edited!", { theme: "colored" });
  };

  handleEditClick = async (e, id) => {
    let res = await axios.get(`http://localhost:3000/form/${id}`);
    this.setState({ ...this.state, formValues: res.data, add: false });
  };

  handleDelete = async (e, id) => {
    this.setState({ ...this.state, loading: true });
    let res1 = await axios.get(`http://localhost:3000/response/form/${id}`)
    for (var x in res1.data) {
      await axios.delete(`http://localhost:3000/response/${res1.data[x]._id}`)
    }
    let res = await axios.delete(`http://localhost:3000/form/${id}`);
    res = await axios.get("http://localhost:3000/form");
    this.setState({ ...this.state, data: res.data, loading: false });

    toast.success("Form Deleted!", { theme: "colored" });
  };

  async componentDidMount() {
    const res = await axios.get("http://localhost:3000/form");
    const batches = await axios.get("http://localhost:3000/batch");
    const electives = await axios.get("http://localhost:3000/elective");

    this.setState({
      ...this.state,
      data: res.data,
      batches: batches.data,
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
              {this.state.add === false ? "Edit" : "Add new"} form
            </h1>
            {/* {JSON.stringify(this.state.formValues.batch)} */}
            <label className="font-semibold">Batch</label>
            <select
              name="batch"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.batch}
              onChange={this.handleChange}
              defaultValue="empty"
            >
              <option value="">----</option>
              {this.state.batches.map((batch) => {
                return (
                  <option key={batch._id} value={JSON.stringify(batch)}>
                    {`${batch.start}-${batch.end} (${batch.department})`}
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
              defaultValue="empty"
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

            <label className="font-semibold">Start Time</label>
            <input
              name="startTime"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.startTime || ""}
              onChange={this.handleChange}
              type="datetime-local"
              placeholder="Start Time"
            />

            <label className="font-semibold">End Time</label>
            <input
              name="endTime"
              className="border-none bg-purple-100 rounded-lg p-2 placeholder:text-slate-400"
              value={this.state.formValues.endTime || ""}
              onChange={this.handleChange}
              type="datetime-local"
              placeholder="End Time"
            />
            <button
              disabled={
                this.state.formValues.elective === "" ||
                this.state.formValues.batch === ""
              }
              type="submit"
              className="border-2 border-black p-2 rounded-lg font-semibold hover:text-white hover:bg-black disabled:text-white disabled:bg-black"
            >
              {this.state.formValues.elective === "" ||
              this.state.formValues.batch === "" ? (
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
          <h2 className="text-3xl font-bold my-6">Form</h2>
          <div className="grid gap-4">
            {this.state.data.map((form) => {
              return (
                <div
                  className="border shadow-lg p-4 rounded-lg text-lg flex justify-between gap-2"
                  key={form._id}
                >
                  <div>
                    <p className="text-lg font-semibold">
                      {form.elective} : {JSON.parse(form.batch).start} -{" "}
                      {JSON.parse(form.batch).end}{" "}
                      {"(" + JSON.parse(form.batch).department + ")"}
                    </p>
                    <p className="text-sm">Start Time: {form.startTime}</p>
                    <p className="text-sm">End Time: {form.endTime}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => this.handleEditClick(e, form._id)}
                      className="px-3 py-2 font-semibold text-white bg-yellow-500 hover:bg-yellow-800 rounded"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span className="ml-6">Edit</span>
                    </button>
                    <button
                      onClick={(e) => this.handleDelete(e, form._id)}
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

export default Form;

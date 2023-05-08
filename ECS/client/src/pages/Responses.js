import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import AdminNavigationBar from "./AdminNavigationBar";

class Form extends React.Component {
  state = {
    loading: true,
    form: "",
  };

  handleView = async (e, form) => {
    // const formRes = await axios.get(`http://localhost:3000/form/${form._id}`);

    // this.setState((prev) => {
    //   return {
    //     ...prev,
    //     allocated: formRes.data.allocated,
    //   };
    // });

    this.setState({ ...this.state, loading: true });
    const res = await axios.get(
      `http://localhost:3000/response/form/${form._id}`
    );

    const responsesArray = await Promise.all(
      res.data.map((i) => {
        return axios.get(`http://localhost:3000/studentUser/${i.student}`);
      })
    );

    // console.log(formRes.data.allocated);
    console.log(res);
    console.log(responsesArray);

    this.setState((prev) => {
      return {
        ...prev,
        form: form,
        responses: res.data.map((v, k) => {
          return { ...v, student: responsesArray[k].data };
        }),
        loading: false,
      };
    });
  };

  async componentDidMount() {
    const res = await axios.get("http://localhost:3000/form");

    this.setState((prev) => {
      return {
        ...prev,
        data: res.data,
        loading: false,
      };
    });
  }

  async handleClick() {
    await axios.get(
      `http://localhost:3000/response/allocate/${this.state.form._id}`
    );
    await this.handleView(null, this.state.form);
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
        <div className="px-10 col-span-2 overflow-y-auto border-r-2 border-black">
          <h2 className="text-3xl font-bold my-6">Forms</h2>
          <div className="grid gap-4">
            {this.state.data.map((form) => {
              return (
                <div
                  className="shadow-lg p-4 rounded-lg text-lg flex justify-between gap-2"
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
                  <div className="flex">
                    <button
                      onClick={(e) => this.handleView(e, form)}
                      className="px-3 py-2 font-semibold text-white bg-green-500 hover:bg-green-800 rounded"
                    >
                      <i className="fa-solid fa-eye"></i>
                      <span className="ml-6">View</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-2 col-span-2 m-10 overflow-y-auto">
          {this.state.responses && (
            <div>
              <div className="flex justify-between items-center">
                <div className="mb-5">
                  <p className="text-lg font-semibold">
                    {this.state.form.elective} :{" "}
                    {JSON.parse(this.state.form.batch).start} -{" "}
                    {JSON.parse(this.state.form.batch).end}{" "}
                    {"(" + JSON.parse(this.state.form.batch).department + ")"}
                  </p>
                  <p className="text-sm">
                    Start Time: {this.state.form.startTime}
                  </p>
                  <p className="text-sm">End Time: {this.state.form.endTime}</p>
                </div>
                {this.state.allocated !== "true"}
                {
                  <button
                    className="border-2 border-orange-500 text-orange-500 p-2 my-2 rounded-lg font-semibold hover:text-white hover:bg-orange-500"
                    onClick={() => {
                      this.handleClick();
                      toast.success("Allocated!", { theme: "colored" });
                    }}
                  >
                    <i className="fa-solid fa-gear"></i>
                    <span className="ml-6">Allocate</span>
                  </button>
                }
              </div>
              <table className="border border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">
                      Registration Number
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Priority 1
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Priority 2
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Priority 3
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Allocated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.responses.map((response) => {
                    return (
                      <tr
                        key={response._id}
                        className="border-b hover:bg-gray-100 text-left"
                      >
                        <td className="px-4 py-2 text-left">
                          {response.student.registrationNumber}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {response.student.name}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {response.priority1}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {response.priority2}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {response.priority3}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {response.allocated}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Form;

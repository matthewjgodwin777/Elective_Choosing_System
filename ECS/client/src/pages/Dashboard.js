import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import AdminNavigationBar from "./AdminNavigationBar";
import axios from "axios";

function Dashboard() {
  const nav = useNavigate();

  async function populateDashboard() {
    const response = await axios.get("http://localhost:3000/form");
    const allforms = response.data;

    allforms.map(async (form) => {
      const res = await axios.get(
        `http://localhost:3000/response/form/${form._id}`
      );
      const responsesArray = await Promise.all(
        res.data.map((i) => {
          return axios.get(`http://localhost:3000/studentUser/${i.student}`);
        })
      );

      var responses = res.data.map((v, k) => {
        return { ...v, student: responsesArray[k].data };
      })
      const jsonData = []
      responses.map((res1) => {
        jsonData.push({
          registrationNumber: res1.student.registrationNumber,
          name: res1.student.name,
          priority1: res1.priority1,
          priority2: res1.priority2,
          priority3: res1.priority3,
          allocated: res1.allocated
        })
      })

      // Define the header row
      const headerRow = ["registrationNumber", "name", "priority1", "priority2", "priority3", "allocated"];


      // Convert the data to a CSV string
      const dataRows = jsonData.map(row => Object.values(row));
      const dataCsv = dataRows.map(row => row.join(",")).join("\n");

      // Combine the header, data, and footer rows into a final CSV string
      const csvData = [headerRow.join(","), dataCsv].join("\n");
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('class', "flex items-center rounded-lg bg-purple-500 hover:bg-purple-400 p-4 m-4 text-white font-semibold text-2xl")
      const form_responses = document.getElementById("form_responses");
      form_responses.appendChild(link);

      const formdet = await axios.get(`http://localhost:3000/form/${form._id}`)
      const formdata = formdet.data
      const batch = JSON.parse(formdata.batch)
      const downloadFileName = formdata.elective + " : " + batch.start + " - " + batch.end + " (" + batch.department + ")"
      const downloadIcon = document.createElement('i');
      downloadIcon.classList.add('fa-solid', 'fa-download');
      link.appendChild(downloadIcon);

      const downloadText = document.createElement('span');
      downloadText.classList.add('ml-6');
    
      link.setAttribute('download', `${downloadFileName}.csv`);
      downloadText.textContent = `${downloadFileName}`;
      link.appendChild(downloadText);

      
    })


    // var res = 
    // jsonData

  }

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const user = jwt.decode(token);
        console.log(user);
        if (!user || user.email !== "admin@ssn.edu.in") {
          // localStorage.removeItem("token");
          nav("/admin");
        }
        else {
          populateDashboard();
        }
      }
      else nav("/admin");
    };
    checkAuthorization();
  }, [nav]);

  return (
    <div className="h-screen grid grid-cols-5">
      <AdminNavigationBar />
      <div className="pl-10 col-span-3 m-10">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <div id="form_responses">
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

function AdminNavigationBar() {
  const nav = useNavigate();

  function handleLogout() {
    localStorage.clear();
    nav("/admin");
  }
  return (
    <nav className="bg-purple-500 flex flex-col justify-between">
      <div>
        <Link
          className="flex items-center align-center rounded-lg hover:bg-purple-400 p-4 m-4 text-white font-semibold text-2xl"
          to="/dashboard"
        >
          <i className="fas fa-file-alt"></i>
          <span className="ml-6">Dashboard</span>
        </Link>

        <Link
          className="flex items-center align-center rounded-lg hover:bg-purple-400 p-4 m-4 text-white font-semibold text-2xl"
          to="/batch"
        >
          <i className="fa-solid fa-school"></i>
          <span className="ml-6">Batch</span>
        </Link>
        <Link
          className="flex items-center rounded-lg hover:bg-purple-400 p-4 m-4 text-white font-semibold text-2xl"
          to="/subject"
        >
          <i className="fa-solid fa-book"></i>
          <span className="ml-6">Subject</span>
        </Link>
        <Link
          className="flex items-center rounded-lg hover:bg-purple-400 p-4 m-4 text-white font-semibold text-2xl"
          to="/form"
        >
          <i className="fa-solid fa-rectangle-list"></i>
          <span className="ml-6">Form</span>
        </Link>
        <Link
          className="flex items-center rounded-lg hover:bg-purple-400 p-4 m-4 text-white font-semibold text-2xl"
          to="/responses"
        >
          <i className="fa-solid fa-paper-plane"></i>
          <span className="ml-6">Responses</span>
        </Link>
      </div>
      <div>
        <Link
          onClick={handleLogout}
          className="flex items-center rounded-lg hover:text-purple-400 hover:bg-white p-4 m-4 text-white font-semibold text-2xl"
          to="/admin"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="ml-6">Logout</span>
        </Link>
      </div>
    </nav>
  );
}

export default AdminNavigationBar;

import { useNavigate } from "react-router";

function StudentNavigationBar() {
  const nav = useNavigate();

  function handleLogout() {
    localStorage.clear();
    nav("/login");
  }

  return (
    <div className="flex items-center justify-between px-6 font-semibold text-2xl bg-purple-500 text-white py-3">
      <h1>ECS</h1>
      <button
        className="border-2 border-white p-2 rounded-lg font-semibold hover:bg-white hover:text-purple-500"
        onClick={handleLogout}
      >
        <i className="pr-6 fa-solid fa-right-from-bracket "></i>
        Logout
      </button>
    </div>
  );
}

export default StudentNavigationBar;

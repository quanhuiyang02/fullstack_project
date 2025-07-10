import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-3xl font-bold">歡迎來到寵物星球</h1>
      <button
        onClick={() => navigate("/game")}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
      >
        訪客模式進入
      </button>
    </div>
  );
};

export default LoginPage;
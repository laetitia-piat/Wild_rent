import { useNavigate } from "react-router-dom";

function MessageScreen({
    message,
    buttonLabel = "Retour à l'accueil",
  }: {
    message: string;
    buttonLabel?: string;
  }) {
    const navigate = useNavigate();
  
    return (
      <div className="flex flex-col justify-center items-center h-full bg-gray-100 p-4">
        <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-lg text-center">
          <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
            {message}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green text-white py-2 px-6 rounded-2xl hover:bg-blue transition duration-300 cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    );
  }

  export default MessageScreen;
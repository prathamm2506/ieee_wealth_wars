import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [teamNumber, setTeamNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://ieee-wealth-wars-backend.onrender.com/api/teams/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamNumber, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login Successful:", data);

      // Store team data in localStorage
      localStorage.setItem("teamData", JSON.stringify(data.team));

      // Redirect to /user page
      navigate("/user");
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10 shadow-lg">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7 font-semibold">Login</h4>

          <input
            type="text"
            placeholder="Team Number"
            className="input-box w-full p-2 mb-4 border rounded"
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input-box w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

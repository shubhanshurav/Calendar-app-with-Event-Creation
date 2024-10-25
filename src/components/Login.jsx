import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api/v1";
console.log(BACKEND_URL)

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, {
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Log In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Log In</button>
        </form>
        <p className="mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

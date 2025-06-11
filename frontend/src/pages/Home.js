import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl mb-6">Home</h1>
      <button onClick={() => navigate("/upload")} className="px-4 py-2 border rounded">Start</button>
    </div>
  );
};

export default Home;
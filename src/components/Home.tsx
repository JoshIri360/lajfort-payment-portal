import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-6xl font-bold mb-4">Lajfort School Payment Portal</h1>
      <p className="text-xl">
        Please{" "}
        <Link to={"/login"}>
          <span className="underline cursor-pointer">Login</span>
        </Link>{" "}
        to continue
      </p>
    </div>
  );
};

export default Home;

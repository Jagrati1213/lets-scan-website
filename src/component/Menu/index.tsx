import React, { useEffect } from "react";
import { Link, useNavigate, useRoutes } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);
  return (
    <div className={""}>
      <Link to="/">Explore Restaurants</Link>
    </div>
  );
};

export default Menu;

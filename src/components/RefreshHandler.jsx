import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RefreshHandler = ({ setIsAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuth(true);
      if (location.pathname === "/login" || location.pathname === "/signup") {
        navigate("/home", { replace: false });
      }
      //   else {
      //     setIsAuth(false);
      //   }
    }
  }, [location, navigate, setIsAuth]);

  return null;
};

export default RefreshHandler;

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
// import { logoutHandler } from "../utils";
import Header from "../components/Header";
import Projects from "../components/Projects";
import Tasks from "../components/Tasks";
import Footer from "../components/Footer";

const Home = () => {
  const location = useLocation();
  const [loggedinuser, setLoggedinuser] = useState("");
  const [loggedinuserid, setLoggedinuserid] = useState("");
  const [products, setProducts] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.user) {
      setLoggedinuser(location.state.user.name);
      setLoggedinuserid(location.state.user.userId);
    } else {
      setLoggedinuser(localStorage.getItem("loggedinuser"));
      setLoggedinuserid(localStorage.getItem("loggedinuserid"));
    }
  }, [location.state]);

  return (
    <>
      <Header />
      <hr />

      <div className="container mb-4">
        <h1 className="text-center py-3">
          {" "}
          {/* {loggedinuser.charAt(0).toUpperCase() + loggedinuser.slice(1)}'s */}
          WorkSync Dashboard
        </h1>
        <div className="row">
          <div
            className="col-md-3 shadow text-center py-3 rounded"
            style={{ height: "15rem" }}
          >
            <div className="pb-2">
              <h5>Dashboard</h5>
            </div>
            <div className="py-2 bg-light rounded">
              <Link to="/teams" style={{ textDecoration: "none" }}>
                Teams
              </Link>
            </div>
            <div className="py-2 bg-light rounded my-1">
              {" "}
              <Link to="/home" style={{ textDecoration: "none" }}>
                Projects
              </Link>
            </div>
            <div className="py-2 bg-light rounded my-1">
              {" "}
              <Link to="/reports" style={{ textDecoration: "none" }}>
                Report
              </Link>
            </div>
          </div>
          <div className="col-md-9 ml-3">
            <Projects />

            <Tasks />
          </div>
        </div>

        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default Home;

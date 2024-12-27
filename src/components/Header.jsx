import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutHandler } from "../utils";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-light w-100">
      <nav className="navbar navbar-expand-lg ">
        <div className="container d-flex align-items-center justify-content-between">
          {/* <div className="container"> */}
          <NavLink to="/home" className="navbar-brand fw-bold text-primary ">
            Workasana
          </NavLink>
          <button
            className="navbar-toggler align-self-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav mt-2">
              <li className="nav-item">
                {" "}
                <button
                  onClick={() => logoutHandler(navigate)}
                  className="btn btn-primary"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

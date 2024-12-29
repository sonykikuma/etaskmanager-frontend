import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams } from "../features/teamSlice";
import TeamForm from "../components/TeamForm";
import Footer from "../components/Footer";

const Teams = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.team.teams);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);
  // console.log(teams);

  const handleFormToggle = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <>
      <Header />
      <hr />
      <div className="container">
        <h1 className="text-center py-3">Teams Management</h1>
        <hr />
        <div className="row">
          <div
            className="col-md-3 shadow py-3 rounded d-flex align-items-center justify-content-center"
            style={{ height: "5rem" }}
          >
            <Link to="/home" style={{ textDecoration: "none" }}>
              {" "}
              <h5> Back to Dashboard</h5>
            </Link>
          </div>
          <div className="col-md-9 ml-3 mb-3">
            <h3 className=" py-2">Team List</h3>
            {teams?.map((team, index) => (
              <div className="card px-3 py-2 mb-2" key={team?._id}>
                <p>{`Team ${index + 1}: ${team?.name}`}</p>
              </div>
            ))}
            <button className="btn btn-primary mb-3" onClick={handleFormToggle}>
              Add New Team
            </button>
            {showForm && <TeamForm onClose={handleFormToggle} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Teams;

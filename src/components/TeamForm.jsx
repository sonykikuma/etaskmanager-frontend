import React, { useState } from "react";
import { createTeam } from "../features/teamSlice";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../utils";

const TeamForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createTeam({ name, description: desc })).then(() => {
      console.log("Team created successfully!");

      setName("");
      setDesc("");
      handleSuccess("Team created successfully!");

      onClose(); // Close the form after submission
      // setTimeout(() => {
      // }, 3000);
    });
  };

  return (
    <div className="">
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            placeholder="Team Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Team
        </button>
        <span className="me-2"></span>
        <button
          type="button"
          className="btn btn-secondary ml-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default TeamForm;

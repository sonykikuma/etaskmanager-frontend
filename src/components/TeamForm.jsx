import React, { useState } from "react";
import { createTeam } from "../features/teamSlice";
import { useDispatch } from "react-redux";

const TeamForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createTeam({ name, description: desc })).then(() => {
      setName("");
      setDesc("");
      onClose(); // Close the form after submission
    });
  };

  const handleFormToggle = () => {
    setShowForm((prev) => !prev);
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
        <button
          type="button"
          className="btn btn-secondary ml-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TeamForm;

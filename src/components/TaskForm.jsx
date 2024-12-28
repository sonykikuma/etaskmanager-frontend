import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select"; // For dropdown and multi-select
import DatePicker from "react-datepicker"; // For date picker
import "react-datepicker/dist/react-datepicker.css";
import { createTask, fetchTasks } from "../features/taskSlice";
import { fetchProjects } from "../features/projectSlice";
import Header from "./Header";
import { fetchTeams } from "../features/teamSlice";
import { fetchOwners } from "../features/ownersSlice";
import { fetchTags } from "../features/tagsSlice";

const TaskForm = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.tasks);
  const error = useSelector((state) => state.tasks);
  const projects = useSelector((state) => state.project.projects); //state we get from store
  const teams = useSelector((state) => state.team.teams);
  const owners1 = useSelector((state) => state.owner.owners);
  const tags1 = useSelector((state) => state.tag.tags);
  const tasks = useSelector((state) => state.task);
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTeams());
    dispatch(fetchOwners());
    dispatch(fetchTags());
    dispatch(fetchTasks());
  }, [dispatch]);

  const renderedProjects = projects?.allProjects;
  const renderedTags = tags1?.allTags;
  //.map((tag) => tag.name);
  //console.log(projectOptions);

  const [title, setTitle] = useState("");
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState(null);
  const [owners, setOwners] = useState([]);
  const [tags, setTags] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !title ||
      !team ||
      owners.length === 0 ||
      tags.length === 0 ||
      !dueDate ||
      !time
    ) {
      alert("Please fill out all fields");
      return;
    }
    const taskData = {
      name: title,
      team: team.value,
      project: project.value,
      owners: owners.map((owner) => owner.value),
      tags: tags.map((tag) => tag.value),
      dueDate,
      timeToComplete: time,
    };
    console.log("Task Data:", taskData);

    dispatch(createTask(taskData));
    setTitle("");
    setTeam(null);
    setProject(null);
    setOwners([]);
    setTags([]);
    setDueDate(new Date());
    setTime("");
  };

  const teamOptions = teams?.map((team) => ({
    value: team._id,
    label: team.name,
  }));
  const ownerOptions = owners1?.data?.map((owner) => ({
    value: owner._id,
    label: owner.name,
  }));

  const tagOptions = renderedTags?.map((tag) => ({
    //value: tag._id,
    value: tag.name,
    label: tag.name,
  }));

  const projectOptions = renderedProjects?.map((project) => ({
    value: project._id,
    label: project.name,
  }));

  return (
    <>
      <Header />
      <hr />
      <div className="container">
        <h2 className="text-center py-3"> Create New Task</h2>
        <div className="bg-light rounded shadow px-3 py-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Task Name:</label>
              <br />
              <input
                className="form-control"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task name"
              />
            </div>
            <div className="mb-3">
              <label>Project:</label>
              <Select
                options={projectOptions}
                value={project}
                onChange={setProject}
                placeholder="Select a project"
              />
            </div>

            <div className="mb-3">
              <label>Team:</label>
              <Select
                options={teamOptions}
                value={team}
                onChange={setTeam}
                placeholder="Select a team"
              />
            </div>
            <div className="mb-3">
              <label>Owners:</label>
              <Select
                options={ownerOptions}
                isMulti
                value={owners}
                onChange={setOwners}
                placeholder="Select owners"
              />
            </div>
            <div className="mb-3">
              <label>Tags:</label>
              <Select
                options={tagOptions}
                isMulti
                value={tags}
                onChange={setTags}
                placeholder="Select tags"
              />
            </div>
            <div className="mb-3">
              <label>Due Date:</label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select a due date"
                className=" form-control"
              />
            </div>
            <div className="mb-3">
              <label>Time (Days):</label>
              <input
                className="form-control"
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Enter time in days"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </form>
        </div>
        {status === "creating" && <p>Creating task...</p>}
        {status === "error" && <p>Error: {error}</p>}
      </div>
      <Footer />
    </>
  );
};

export default TaskForm;

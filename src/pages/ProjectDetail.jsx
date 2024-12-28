import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import { fetchProjects } from "../features/projectSlice";
import { fetchTasks } from "../features/taskSlice";
import { fetchTags } from "../features/tagsSlice";
import { getDueDate } from "../utils";
import { Link, useParams } from "react-router-dom";
import { fetchOwners } from "../features/ownersSlice";
import Footer from "../components/Footer";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.project.projects); // coming from store
  const tasks = useSelector((state) => state.task.tasks);
  const owners1 = useSelector((state) => state.owner.owners);
  const tags1 = useSelector((state) => state.tag.tags);
  const status = useSelector((state) => state.task.status);
  const error = useSelector((state) => state.task.error);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedSort, setSelectedSort] = useState("dueDate");

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchOwners());
    dispatch(fetchTags());
    dispatch(fetchTasks());
  }, [dispatch]);

  const renderedProjects = projects?.allProjects;
  const renderedTasks = tasks.tasks;
  const renderedTags = tags1?.allTags?.map((tag) => tag.name);
  const ownerOptions = owners1?.data?.map((owner) => owner.name);

  const projectData = renderedProjects?.find(
    (project) => String(project._id) === String(projectId)
  );
  //console.log(renderedTasks, projectData);
  const projectTasks = renderedTasks?.filter(
    (task) => String(task.project?._id) === String(projectId)
  );

  const filteredTasks = projectTasks.filter((task) => {
    const matchesOwner =
      !selectedOwner ||
      task.owners.some((owner) => owner.name === selectedOwner);
    const matchesTag = !selectedTag || task.tags.includes(selectedTag);
    return matchesOwner && matchesTag;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (selectedSort === "dueDate") {
      // Sort by due date
      const dueA = new Date(getDueDate(a.createdAt, a.timeToComplete));
      const dueB = new Date(getDueDate(b.createdAt, b.timeToComplete));
      return dueA - dueB; // Ascending order of due dates
    } else if (selectedSort === "assignedDateRange") {
      // Sort by createdAt (task assignment date)
      const createdA = new Date(a.createdAt);
      const createdB = new Date(b.createdAt);
      return createdA - createdB; // Ascending order of createdAt
    }
    return 0; // Default case, no sorting
  });

  return (
    <>
      <Header />
      <hr />
      <div className="container">
        <h1 className="text-center py-3">Project: {projectData.name}</h1>
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
          <div className="col-md-9 ml-3">
            <h3 className=" py-2">Task List</h3>
            {/* Filters */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="ownerFilter" className="mr-2">
                  Filter by Owner:
                </label>
                <select
                  id="ownerFilter"
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                  className="mr-3"
                >
                  <option value="">All Owners</option>
                  {ownerOptions?.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="tagFilter" className="mr-2">
                  Filter by Tag:
                </label>
                <select
                  id="tagFilter"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="">All Tags</option>
                  {renderedTags?.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6 py-3 mb-3">
              <label htmlFor="sortTasks" className="mr-2">
                Sort by:
              </label>
              <select
                id="sortTasks"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="dueDate">Due Date</option>
                <option value="assignedDateRange">Assigned Date Range</option>
              </select>
            </div>

            {status === "loading" && <p>Loading....</p>}
            {error && <p>An error occured while fetching tasks</p>}
            {sortedTasks?.map((task, index) => (
              <Link
                to={`/tasks/task._id`}
                key={task._id}
                style={{ textDecoration: "none" }}
              >
                <div className="card bg-light mb-2 px-3 py-3">
                  <p>
                    {`Task ${index + 1}`}: {task?.name}{" "}
                  </p>
                  <p>{`Due: ${getDueDate(
                    task?.createdAt,
                    task?.timeToComplete
                  )}`}</p>
                  <p>{`Owners: ${task?.owners
                    ?.map((o) => o.name)
                    .join(", ")}`}</p>
                  <p>{`Status: ${task?.calculatedStatus}`}</p>
                </div>
              </Link>
            ))}
            <Link to="/newTask" className="btn btn-primary mb-3">
              Add New Task
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectDetail;

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../features/projectSlice";
import Header from "./Header";
import { Link } from "react-router-dom";

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects); // coming from store
  const status = useSelector((state) => state.project.status);
  const error = useSelector((state) => state.project.error);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const renderedProjects = projects?.allProjects;
  console.log("projects", renderedProjects);

  return (
    <>
      <div className="container ml-2">
        <h2>Projects</h2>
        {status === "loading" && <p>Loading....</p>}
        {error && <p>An error occured while fetching projects</p>}
        <div className="row">
          {renderedProjects?.map((project) => (
            <div className="col-md-6" key={project?._id}>
              <div className="card p-1 mb-2 bg-light">
                <Link
                  to={`/projects/${project?._id}`}
                  className="text-center"
                  style={{ textDecoration: "none" }}
                >
                  {project?.name}
                </Link>
              </div>
            </div>
          ))}
        </div>{" "}
      </div>
    </>
  );
};

export default Projects;

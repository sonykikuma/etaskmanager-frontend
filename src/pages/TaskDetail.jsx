import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import { fetchTasks } from "../features/taskSlice";
import { getDueDate } from "../utils";
import { Link, useParams } from "react-router-dom";

const TaskDetail = () => {
  const dispatch = useDispatch();
  const { taskId } = useParams();
  const tasks = useSelector((state) => state.task.tasks);
  const [isCompleted, setIsCompleted] = useState(false);

  const renderedTasks = tasks?.tasks;

  const taskData = renderedTasks?.find(
    (task) => String(task._id) === String(taskId)
  );
  console.log(taskData);

  // Function to calculate time remaining
  const calculateTimeRemaining = (createdAt, timeToComplete) => {
    const dueDate = new Date(getDueDate(createdAt, timeToComplete));
    const currentDate = new Date();
    const timeDiff = dueDate - currentDate;

    if (timeDiff <= 0) {
      return "0";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

    return `${days} days, ${hours} hours, ${minutes} minutes remaining`;
  };

  const handleMarkAsComplete = () => {
    setIsCompleted(true);
  };

  return (
    <>
      <Header />
      <hr />
      <div className="container">
        <h1 className="text-center py-3">Task: {taskData?.name}</h1>
        <hr />

        <div className="row">
          <div
            className="col-md-3 shadow py-3 me-3 rounded d-flex align-items-center justify-content-center"
            style={{ height: "5rem" }}
          >
            <Link to="/home" style={{ textDecoration: "none" }}>
              {" "}
              <h5> Back to Dashboard</h5>
            </Link>
          </div>
          <div className="col-md-7 mx-2 px-3 py-4 shadow rounded  ">
            <h3 className=" mb-3 px-5">Task Details</h3>
            <div className="px-5">
              <p>Project: {taskData?.project?.name}</p>
              <p>Team: {taskData?.team?.name}</p>
              <p>
                Owners:{" "}
                {taskData?.owners
                  ?.map(
                    (owner) =>
                      owner.name.charAt(0).toUpperCase() + owner.name.slice(1)
                  )
                  .join(",")}
              </p>
              <p>Tags: {taskData?.tags?.map((tag) => tag).join(", ")}</p>
              <p>{`Due: ${getDueDate(
                taskData?.createdAt,
                taskData?.timeToComplete
              )}`}</p>

              <p>Due Date: {taskData?.project?.name}</p>
            </div>
            <div className="px-5">
              <p>Status: {taskData?.calculatedStatus}</p>
              <p>
                Time Remaining:{" "}
                {calculateTimeRemaining(
                  taskData?.createdAt,
                  taskData?.timeToComplete
                )}{" "}
                Days
              </p>
              <button
                className={`btn btn-primary`}
                onClick={handleMarkAsComplete}
                //disabled={isCompleted}
              >
                {isCompleted ? "Completed" : "Mark as Complete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetail;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/taskSlice";
import { getDueDate } from "../utils";
import { Link } from "react-router-dom";

const Tasks = () => {
  const dispatch = useDispatch();
  // const tasks = useSelector((state) => {
  //   console.log(state.task);
  // });

  const { tasks, status, error } = useSelector((state) => state.task);
  // const status = useSelector((state) => state.task.status);
  // const error = useSelector((state) => state.task.error);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (tasks == undefined) {
      dispatch(fetchTasks());
    }
  }, [tasks]);

  //console.log("tasks", tasks);

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks?.filter((task) => task.calculatedStatus === statusFilter);

  const handleFilterChange = (newFilter) => {
    // setStatusFilter(event.target.value); this is for filter if we use select option
    setStatusFilter(newFilter);
  };

  return (
    <div className="container ml-2 mt-4">
      <h3>My Tasks</h3>
      {/* Filter Buttons */}
      {/* <div>
        <label>Filter By Status:</label>
        <br />
        <select
          value={statusFilter} // bind the selected value to the statusFilter state
          onChange={handleFilterChange} // handle change event
          className="form-select"
        >
          <option value="all">All Tasks</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="To Do">To Do</option>
        </select>
      </div> */}
      <div className=" mb-3">
        Quick filters:
        <button
          onClick={() => handleFilterChange("all")}
          className="btn btn-secondary mx-1"
        >
          All Tasks
        </button>
        <button
          onClick={() => handleFilterChange("Completed")}
          className="btn btn-success mx-1"
        >
          Completed
        </button>
        <button
          onClick={() => handleFilterChange("In Progress")}
          className="btn btn-warning mx-1"
        >
          In Progress
        </button>
        {/* <button
          onClick={() => handleFilterChange("To Do")}
          className="btn btn-primary mx-1"
        >
          To Do
        </button> */}
        {/* <button
          onClick={() => handleFilterChange("all")}
          className="btn btn-danger"
        >
          Clear Filter
        </button> */}
      </div>

      {status === "loading" && <p>Loading....</p>}
      {error && <p>An error occured while fetching tasks</p>}

      {filteredTasks && filteredTasks.length > 0
        ? filteredTasks.map((task, index) => (
            <Link
              to={`/tasks/${task._id}`}
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
          ))
        : " No Tasks found"}
      <Link to="/newTask" className="btn btn-primary">
        Add New Task
      </Link>
    </div>
  );
};

export default Tasks;

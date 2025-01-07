import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/taskSlice";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Footer from "../components/Footer";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks);
  const [chartData, setChartData] = useState(null);
  const [noWorkDone, setNoWorkDone] = useState(false);
  const [doughnutData, setDoughnutData] = useState(null);
  const [teamChartData, setTeamChartData] = useState(null); // New state for team task chart
  const [ownerChartData, setOwnerChartData] = useState(null); // New state for owner tasks chart
  const [tasksLastWeek, setTasksLastWeek] = useState([]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  //console.log("all tasks", tasks);

  useEffect(() => {
    if (tasks) {
      // 1.Calculate completed and pending work
      const completedTasks = tasks.filter(
        (task) => task.calculatedStatus === "Completed"
      );
      //console.log("completed tasks", completedTasks);
      const pendingTasks = tasks.filter(
        (task) => task.calculatedStatus !== "Completed"
      );
      //console.log("pending tasks", pendingTasks);

      //2. Doughnut chart data
      setDoughnutData({
        labels: ["Completed Work", "Pending Work"],
        datasets: [
          {
            data: [completedTasks.length, pendingTasks.length],
            backgroundColor: [
              "rgba(75, 192, 192, 0.5)",
              "rgba(255, 99, 132, 0.5)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      });

      // 3.Calculate tasks closed by each team
      const teamTaskCount = tasks.reduce((acc, task) => {
        if (task.calculatedStatus === "Completed") {
          const teamName = task.team?.name || "Unassigned"; // Used "Unassigned" if no team name
          acc[teamName] = (acc[teamName] || 0) + 1;
        }
        return acc;
      }, {});

      const teamNames = Object.keys(teamTaskCount);
      const taskCounts = Object.values(teamTaskCount);
      //console.log(teamTaskCount);
      setTeamChartData({
        labels: teamNames,
        datasets: [
          {
            label: "Tasks Closed by Team",
            data: taskCounts,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });

      //related to 1st chart- Filter tasks completed last week
      const now = new Date();
      let oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);

      const filteredTasksLastWeek = tasks.filter(
        (task) =>
          task.calculatedStatus === "Completed" &&
          new Date(task.updatedAt) <= oneWeekAgo &&
          new Date(task.updatedAt) <= now
      );
      console.log("chart1", filteredTasksLastWeek);

      setTasksLastWeek(filteredTasksLastWeek);

      if (filteredTasksLastWeek.length === 0) {
        setNoWorkDone(true);
        setChartData(null);
        return;
      }

      setNoWorkDone(false);

      const taskNames = filteredTasksLastWeek.map((task) => task.name);
      console.log("tasknames", taskNames);
      setChartData({
        labels: taskNames,
        datasets: [
          {
            label: "Completion Dates",
            data: filteredTasksLastWeek.map((_, index) => index + 1),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });

      // 4. Calculate tasks closed by each owner
      //console.log("aabha", tasks);

      const ownerTaskCount = tasks.reduce((acc, task) => {
        if (
          task.calculatedStatus === "Completed" &&
          Array.isArray(task.owners)
        ) {
          //  console.log("Inspecting Task:", task);
          task.owners.forEach((owner) => {
            //   console.log("Inspecting Owner:", owner);
            const ownerName = owner.name || "Unassigned";
            acc[ownerName] = (acc[ownerName] || 0) + 1;
          });
        }
        if (!task.owners || !Array.isArray(task.owners)) {
          console.warn("Task has no valid owners:", task);
        }

        return acc;
      }, {});

      const ownerNames = Object.keys(ownerTaskCount);
      const ownerCounts = Object.values(ownerTaskCount);
      //console.log(ownerTaskCount);

      setOwnerChartData({
        labels: ownerNames,
        //labels: ["Owner 1", "Owner 2", "Owner 3"], // Test labels

        datasets: [
          {
            label: "Tasks Closed by Owner",
            // data: [5, 10, 15], // Test data

            data: ownerCounts,
            backgroundColor: "rgba(153, 102, 255, 0.5)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
    console.log("Chart Data for owner:", ownerChartData);
  }, [tasks]);

  return (
    <>
      <Header />
      <hr />
      <div className="container">
        <h1 className="text-center py-3">Workasana Reports</h1>
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
            <h3 className=" py-2">Report Overview</h3>
            <hr />
            <div className="mt-3 mb-3">
              <h3>Total Work Done Last Week:</h3>
              {noWorkDone ? (
                <p>No work done last week.</p>
              ) : chartData ? (
                <Bar
                  key={chartData ? "bar-chart" : ""}
                  data={chartData}
                  options={{
                    indexAxis: "y", // Y-axis for task names
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Tasks Completed Last Week (Dates on X-axis)",
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          callback: (value, index) =>
                            tasksLastWeek[index]?.updatedAt &&
                            new Date(
                              tasksLastWeek[index].updatedAt
                            ).toLocaleDateString(),
                        },
                      },
                      y: {
                        ticks: {
                          font: {
                            size: 10, // Smaller font size
                          },
                          autoSkip: false, // Show all labels
                        },
                      },
                    },
                  }}

                  // options={{
                  //   indexAxis: "y", // Switch axis: Task names on Y-axis
                  //   responsive: true,
                  //   plugins: {
                  //     legend: {
                  //       position: "top",
                  //     },
                  //     title: {
                  //       display: true,
                  //       text: "Tasks Completed Last Week (Dates on X-axis)",
                  //     },
                  //   },
                  //   scales: {
                  //     x: {
                  //       ticks: {
                  //         callback: (value, index) =>
                  //           tasksLastWeek[index]?.updatedAt &&
                  //           new Date(
                  //             tasksLastWeek[index].updatedAt
                  //           ).toLocaleDateString(), // Dates on X-axis
                  //       },
                  //     },
                  //   },
                  // }}
                />
              ) : (
                <p>Loading chart data...</p>
              )}
            </div>
            <hr />
            <div className="my-3">
              <h3>Total Days of Work Pending:</h3>
              {doughnutData ? (
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Work Status Overview",
                      },
                    },
                  }}
                />
              ) : (
                <p>Loading doughnut chart...</p>
              )}
            </div>
            <hr />
            <div className="my-3">
              <h3>Tasks Closed by Team:</h3>
              {teamChartData ? (
                <Bar
                  data={teamChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Tasks Closed by All Team",
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Team Names",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Number of Tasks Closed",
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <p>No tasks have been closed by any team.</p>

                // <p>Loading team task chart...</p>
              )}
            </div>
            <hr />
            <div className="my-3">
              <h3>Tasks Closed by Owner:</h3>
              {ownerChartData ? (
                <Bar
                  data={ownerChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Tasks Closed by Each Owner",
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Owner Names",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Number of Tasks Closed",
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <p>No tasks have been closed by any owner.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Reports;

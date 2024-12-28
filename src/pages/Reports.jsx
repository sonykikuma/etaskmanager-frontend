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
  const tasks = useSelector((state) => state.task.tasks.tasks);
  const [chartData, setChartData] = useState(null);
  const [noWorkDone, setNoWorkDone] = useState(false);
  const [doughnutData, setDoughnutData] = useState(null);
  const [teamChartData, setTeamChartData] = useState(null); // New state for team task chart
  const [ownerChartData, setOwnerChartData] = useState(null); // New state for owner tasks chart

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  console.log(tasks);

  useEffect(() => {
    if (tasks) {
      // 1.Calculate completed and pending work
      const completedTasks = tasks.filter(
        (task) => task.calculatedStatus === "Completed"
      );
      const pendingTasks = tasks.filter(
        (task) => task.calculatedStatus !== "Completed"
      );

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
          const teamName = task.team?.name || "Unassigned"; // Use "Unassigned" if no team name
          acc[teamName] = (acc[teamName] || 0) + 1;
        }
        return acc;
      }, {});

      //   const completedTasks1 = tasks.filter(
      //     (task) => task.calculatedStatus === "Completed"
      //   );

      //   const teamTaskCount = completedTasks1.reduce((acc, task) => {
      //     const teamName = task?.team?.name || "Unassigned"; // Default to "Unassigned" if no team name
      //     acc[teamName] = (acc[teamName] || 0) + 1;
      //     return acc;
      //   }, {});

      const teamNames = Object.keys(teamTaskCount);
      const taskCounts = Object.values(teamTaskCount);

      setTeamChartData({
        labels: teamNames,
        datasets: [
          {
            label: "Tasks Closed by Team",
            data: taskCounts, // y-axis will be the number of tasks closed by each team
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });

      //related to 1st chart- Filter tasks completed last week
      const now = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);

      const tasksLastWeek = tasks.filter(
        (task) =>
          task.calculatedStatus === "Completed" &&
          new Date(task.updatedAt) >= oneWeekAgo &&
          new Date(task.updatedAt) <= now
      );

      if (tasksLastWeek.length === 0) {
        setNoWorkDone(true);
        setChartData(null);
        return;
      }

      setNoWorkDone(false);

      const taskNames = tasksLastWeek.map((task) => task.name);
      const taskDates = tasksLastWeek.map((task) =>
        new Date(task.updatedAt).toLocaleDateString()
      );

      // Set chart data
      setChartData({
        labels: taskNames,
        datasets: [
          {
            label: "Completion Dates",
            data: taskDates.map((_, index) => index + 1), // Dummy data for bar heights
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });

      // 4. Calculate tasks closed by each owner
      const ownerTaskCount = tasks.reduce((acc, task) => {
        if (task.calculatedStatus === "Completed") {
          task.owners.forEach((owner) => {
            const ownerName = owner.name || "Unassigned";
            acc[ownerName] = (acc[ownerName] || 0) + 1;
          });
        }
        return acc;
      }, {});

      const ownerNames = Object.keys(ownerTaskCount);
      const ownerCounts = Object.values(ownerTaskCount);

      setOwnerChartData({
        labels: ownerNames,
        datasets: [
          {
            label: "Tasks Closed by Owner",
            data: ownerCounts,
            backgroundColor: "rgba(153, 102, 255, 0.5)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
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
            <div className="mt-3">
              <h3>Total Work Done Last Week:</h3>
              {noWorkDone ? (
                <p>No work done last week.</p>
              ) : chartData ? (
                <Bar
                  key={chartData ? "bar-chart" : ""}
                  data={chartData}
                  options={{
                    indexAxis: "y", // Switch axis: Task names on Y-axis
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
                            ).toLocaleDateString(), // Dates on X-axis
                        },
                      },
                    },
                  }}
                />
              ) : (
                <p>Loading chart data...</p>
              )}
            </div>
            <hr />
            <div className="mt-3">
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
            <div className="mt-5">
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
            <div className="mt-5">
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

import { toast } from "react-toastify";

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
  });
};

export const handleError = (msg) => {
  toast.error(msg, {
    position: "top-right",
  });
};

export const logoutHandler = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedinuser");
  localStorage.removeItem("loggedinuserid");
  handleSuccess("user logged out");
  setTimeout(() => {
    navigate("/login");
  }, 1000);
};
export const getDueDate = (createdAt, dayToComplete) => {
  const dueDate = new Date(createdAt);
  dueDate.setDate(dueDate.getDate() + dayToComplete);
  return dueDate.toISOString().split("T")[0];
};

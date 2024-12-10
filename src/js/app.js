import TopTasks from "./top-tasks";

const container = document.querySelector(".card");

document.addEventListener("DOMContentLoaded", () => {
  const topTasks = new TopTasks(container);
  topTasks.createTopTasksHtml();
  topTasks.isChangingGroup();
  topTasks.isEnter();
  topTasks.isInput();
});

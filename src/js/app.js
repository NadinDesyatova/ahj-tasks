import TopTasks from "./top-tasks";

const container = document.querySelector(".card");

document.addEventListener("DOMContentLoaded", () => {
  const topTasks = new TopTasks(container);
  topTasks.createTopTasksHtml();
  topTasks.mooveToAllToggle();
  topTasks.mooveToPinnedToggle();
  topTasks.isEnter();
  topTasks.isInput();
});

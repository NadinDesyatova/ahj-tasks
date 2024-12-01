import Task from "./task";
import AllTasks from "./all-tasks";
import PinnedTasks from "./pinned-tasks";
import SearchTasks from "./filter";

export default class TopTasks {
  constructor(container) {
    this.container = container;
    this.allTasks = new AllTasks();
    this.pinnedTasks = new PinnedTasks();
    this.searchTasks = new SearchTasks(this.allTasks.tasks);

    this.createTopTasksHtml = this.createTopTasksHtml.bind(this);
    this.passValue = this.passValue.bind(this);
    this.validateAndCreateTask = this.validateAndCreateTask.bind(this);
    this.clear = this.clear.bind(this);
    this.completeAllTasks = this.completeAllTasks.bind(this);
    this.completePinnedTasks = this.completePinnedTasks.bind(this);
    this.mooveToPinnedToggle = this.mooveToPinnedToggle.bind(this);
    this.mooveToAllToggle = this.mooveToAllToggle.bind(this);
    this.onEnterInput = this.onEnterInput.bind(this);
    this.onInput = this.onInput.bind(this);
    this.isInput = this.isInput.bind(this);
  }

  createTopTasksHtml() {
    const topTasksHtml = `
      <div class="tasks">
        <div class="group__title group__title__main">TOP Tasks</div>
        <form class="tasks__control">
          <input type="text" class="tasks__input" placeholder="Введите название новой задачи">
        </form>
        <div class="tasks__list">
          <div class="group__title group__title__pinned">Pinned:</div>
          <div class="group__pinned">
            <div class="empty__group empty__group_active">...No pinned tasks</div>
          </div>
          <div class="group__title group__title__all">All Tasks:</div>
          <div class="group__all">
            <div class="empty__group empty__group_active">...No tasks found</div>
          </div>
        </div>
      </div>`;
    this.container.insertAdjacentHTML("beforeend", topTasksHtml);
    this.tasksContainer = this.container.querySelector(".tasks");
    this.inputElement = this.tasksContainer.querySelector(".tasks__input");
    this.allTasksElement = this.tasksContainer.querySelector(".group__all");
    this.allTasksIsEmpty = this.allTasksElement.querySelector(".empty__group");
    this.pinnedTasksElement =
      this.tasksContainer.querySelector(".group__pinned");
    this.pinnedTasksIsEmpty =
      this.pinnedTasksElement.querySelector(".empty__group");
  }

  passValue() {
    const value = this.inputElement.value.trim();
    if (!value) {
      throw new Error("! Нельзя добавить пустую строку");
    } else {
      return value;
    }
  }

  validateAndCreateTask() {
    try {
      const currentValue = this.passValue();
      const currentTask = new Task(currentValue);
      this.allTasks.add(currentTask);
      this.inputElement.closest(".tasks__control").reset();
      this.completeAllTasks();
      const existTooltip = this.tasksContainer.querySelector(".tooltip");
      if (existTooltip !== null) {
        existTooltip.remove();
      }
    } catch (error) {
      const tooltipHtml = `<div class="tooltip">${error.message}</div>`;
      this.inputElement.insertAdjacentHTML("afterEnd", tooltipHtml);
      const tooltip = this.inputElement.nextElementSibling;
      const { top, left } = this.inputElement.getBoundingClientRect();
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top - 17}px`;
      tooltip.classList.add("tooltip_active");
      this.inputElement.closest(".tasks__control").reset();
    }
  }

  clear(tasks) {
    const tasksArr = [...tasks];
    if (tasksArr) {
      tasks.forEach((task) => task.remove());
    }
  }

  completeAllTasks() {
    const all = this.allTasksElement.querySelectorAll(".task");
    this.clear(all);
    const searchTasksCollection = this.searchTasks.filter(
      this.inputElement.value.trim(),
    );
    if (searchTasksCollection.length > 0) {
      this.allTasksIsEmpty.classList.remove("empty__group_active");
      searchTasksCollection.forEach((task) => {
        this.allTasksElement.insertAdjacentHTML("beforeend", task.taskHtml);
      });
      this.mooveToPinnedToggle();
    } else {
      this.allTasksIsEmpty.classList.add("empty__group_active");
    }
  }

  completePinnedTasks() {
    const pinned = this.pinnedTasksElement.querySelectorAll(".task");
    this.clear(pinned);
    if (this.pinnedTasks.tasks.length > 0) {
      if (this.pinnedTasks.tasks.length === 1) {
        this.pinnedTasksIsEmpty.classList.remove("empty__group_active");
      }
      this.pinnedTasksIsEmpty.classList.remove("empty__group_active");
      this.pinnedTasks.tasks.forEach((task) => {
        this.pinnedTasksElement.insertAdjacentHTML("beforeend", task.taskHtml);
      });
      this.mooveToAllToggle();
    } else {
      this.pinnedTasksIsEmpty.classList.add("empty__group_active");
    }
  }

  mooveToAllToggle() {
    this.pinnedTasksElement.addEventListener("click", (event) => {
      const element = event.target;
      if (element.classList.contains("task__toggle-checked")) {
        event.stopImmediatePropagation();
        const elementIndexToAll = this.pinnedTasks.tasks.findIndex(
          (task) => task.taskHtml === element.closest(".task").outerHTML,
        );
        const elementToAll = this.pinnedTasks.tasks.find(
          (task) => task.taskHtml === element.closest(".task").outerHTML,
        );
        this.pinnedTasks.tasks.splice(elementIndexToAll, 1);
        if (this.pinnedTasks.tasks.length === 0) {
          this.pinnedTasksIsEmpty.classList.add("empty__group_active");
        }
        elementToAll.taskHtml = `<div class="task"><div class="task__title">${elementToAll.value}</div><div class="task__toggle task__toggle-unchecked"></div></div>`;
        this.allTasks.add(elementToAll);
        if (this.allTasks.tasks.length === 1) {
          this.allTasksIsEmpty.classList.remove("empty__group_active");
        }
        this.completeAllTasks();
        this.completePinnedTasks();
      }
    });
  }

  mooveToPinnedToggle() {
    this.allTasksElement.addEventListener("click", (event) => {
      const element = event.target;
      if (element.classList.contains("task__toggle-unchecked")) {
        event.stopImmediatePropagation();
        const elementIndexToPin = this.allTasks.tasks.findIndex(
          (task) => task.taskHtml === element.closest(".task").outerHTML,
        );
        const elementToPin = this.allTasks.tasks.find(
          (task) => task.taskHtml === element.closest(".task").outerHTML,
        );
        this.allTasks.tasks.splice(elementIndexToPin, 1);
        if (this.allTasks.tasks.length === 0) {
          this.allTasksIsEmpty.classList.add("empty__group_active");
        }
        elementToPin.taskHtml = `<div class="task"><div class="task__title">${elementToPin.value}</div><div class="task__toggle task__toggle-checked"></div></div>`;
        this.pinnedTasks.add(elementToPin);
        if (this.pinnedTasks.tasks.length === 1) {
          this.pinnedTasksIsEmpty.classList.remove("empty__group_active");
        }
        this.completeAllTasks();
        this.completePinnedTasks();
      }
    });
  }

  onInput() {
    const existTooltip = this.tasksContainer.querySelector(".tooltip");
    if (existTooltip !== null) {
      existTooltip.remove();
    }
    setTimeout(() => this.completeAllTasks(), 500);
  }

  isInput() {
    this.inputElement
      .closest(".tasks__control")
      .addEventListener("input", this.onInput);
  }

  onEnterInput(e) {
    e.preventDefault();
    this.validateAndCreateTask();
  }

  isEnter() {
    this.inputElement
      .closest(".tasks__control")
      .addEventListener("submit", this.onEnterInput);
  }
}

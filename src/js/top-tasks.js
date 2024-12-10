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
    this.completeGroup = this.completeGroup.bind(this);
    this.completeAllTasks = this.completeAllTasks.bind(this);
    this.completePinnedTasks = this.completePinnedTasks.bind(this);
    this.changeGroupToggle = this.changeGroupToggle.bind(this);
    this.isChangingGroup = this.isChangingGroup.bind(this);
    this.onEnterInput = this.onEnterInput.bind(this);
    this.onInput = this.onInput.bind(this);
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
          <div class="group group__pinned">
            <div class="empty__group empty__group_active">...No pinned tasks</div>
          </div>
          <div class="group__title group__title__all">All Tasks:</div>
          <div class="group group__all">
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

    this.groups = this.tasksContainer.querySelectorAll(".group");
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
  
  completeGroup(existElements, parent, tasksArr, emptyElement) {
    this.clear(existElements);
    if (tasksArr.length > 0) {
      emptyElement.classList.remove("empty__group_active");
      tasksArr.forEach((task) => {
        parent.insertAdjacentHTML("beforeend", task.taskHtml);
      });
    } else {
      emptyElement.classList.add("empty__group_active");
    }
  }

  completeAllTasks() {
    const all = this.allTasksElement.querySelectorAll(".task");
    const searchTasksCollection = this.searchTasks.filter(
      this.inputElement.value.trim(),
    );
    this.completeGroup(all, this.allTasksElement, searchTasksCollection, this.allTasksIsEmpty);
  }

  completePinnedTasks() {
    const pinned = this.pinnedTasksElement.querySelectorAll(".task");
    this.completeGroup(pinned, this.pinnedTasksElement, this.pinnedTasks.tasks, this.pinnedTasksIsEmpty)
  }

  changeGroupToggle(
    elemTarget, 
    initialClass, 
    initialTasks, 
    finalClass, 
    finalTasks 
  ) {
    if (elemTarget.classList.contains(initialClass)) {
      const elementIndexToMoove = initialTasks.tasks.findIndex(
        (task) => task.taskHtml === elemTarget.closest(".task").outerHTML,
      );
      const elementToMoove = initialTasks.tasks.find(
        (task) => task.taskHtml === elemTarget.closest(".task").outerHTML,
      );
      initialTasks.tasks.splice(elementIndexToMoove, 1);
      elementToMoove.taskHtml = `<div class="task"><div class="task__title">${elementToMoove.value}</div><div class="task__toggle ${finalClass}"></div></div>`;
      finalTasks.add(elementToMoove);
      this.completeAllTasks();
      this.completePinnedTasks();
    }
  }
  
  isChangingGroup() {
    this.groups.forEach(group => {
      group.addEventListener("click", (event) => {
        const element = event.target;
        const { initialClass, initialTasks, finalClass, finalTasks } =
          group.classList.contains("group__all")
            ? { 
                initialClass: "task__toggle-unchecked", 
                initialTasks: this.allTasks, 
                finalClass: "task__toggle-checked", 
                finalTasks: this.pinnedTasks 
              }
            : {
                initialClass: "task__toggle-checked", 
                initialTasks: this.pinnedTasks, 
                finalClass: "task__toggle-unchecked", 
                finalTasks: this.allTasks 
              };
        this.changeGroupToggle(element, initialClass, initialTasks, finalClass, finalTasks);
      });
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

export default class Task {
  constructor(value) {
    this.value = value;
    this.taskHtml = `<div class="task"><div class="task__title">${value}</div><div class="task__toggle task__toggle-unchecked"></div></div>`;
  }
}

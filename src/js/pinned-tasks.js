export default class PinnedTasks {
  constructor() {
    this.tasks = [];
  }
  
  add(task) {
    this.tasks.push(task);
  }
}

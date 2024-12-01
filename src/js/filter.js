export default class SearchTasks {
  constructor(tasks) {
    this.tasks = tasks;
  }

  filter(pattern) {
    const filter = new RegExp(pattern, "i");

    return this.tasks.filter((task) => filter.test(task.value));
  }
}

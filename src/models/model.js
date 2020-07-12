class Model {
  constructor() {
    this.list = JSON.parse(localStorage.getItem('model')) || {};
  }

  setList(list) {
    this.list = list;
  }
}

export default Model;

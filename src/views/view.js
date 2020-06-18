const view = {
  init() {
    this.view = document.getElementById('view');

    this.render();
  },
  render() {
    this.view.textContent = 'Pour passion into everything you do.';
  },
};

export default view;

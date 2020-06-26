import View from './view';
import { default as Controller } from '../controllers/controller';

class ListView extends View {
  init() {
    // Set variables / DOM elements
    this.listNode = document.getElementById('list-view');
    this.input = document.getElementById('task');
    this.submit = document.getElementById('submit-form');
    this.clear = document.getElementById('clear-list');

    // Attach event listeners
    this.submit.addEventListener('click', this.handleSubmit.bind(this));
    this.clear.addEventListener('click', function () {
      Controller.updateList('empty');
    });

    // Subscribe to events
    Controller.subscribe(this.render, 'modelUpdate', this);

    // Render
    this.render(Controller.getList());
  }

  render(model) {
    const frag = document.createDocumentFragment();
    let i = model.length - 1;
    let itemNode;
    let checkbox;
    let item;
    let deleteIcon;

    this.listNode.innerHTML = '';

    for (i; i >= 0; i -= 1) {
      item = model[i];

      // Create checkbox input
      checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      if (item.completed) checkbox.checked = true;

      // Create delete icon
      deleteIcon = View.createNodeWithText('span', ' x;');
      deleteIcon.addEventListener(
        'click',
        (function (index, _this) {
          return function () {
            Controller.updateList('remove', index);
            return _this.render();
          };
        })(i, this)
      );

      // Create item node
      itemNode = View.createNodeWithText('li', item.task);
      itemNode.appendChild(checkbox);
      itemNode.appendChild(deleteIcon);

      frag.appendChild(itemNode); // Append to frag
    }
    return this.listNode.appendChild(frag); // Append to DOM
  }

  handleSubmit(e) {
    e.preventDefault();
    const { value } = this.input;

    if (!value) return this;
    return Controller.updateList('add', { completed: false, task: value });
  }
}

export default ListView;

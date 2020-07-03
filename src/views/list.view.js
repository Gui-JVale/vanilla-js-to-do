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

  /*
   *
   * Receives the list as param.
   * Creates DOM elements for each task
   * Add Event listeners to elements
   * Returns by appending the fragment to the DOM
   */
  render(model) {
    const frag = document.createDocumentFragment();
    let i = model.length - 1;
    let itemNode;
    let textWrapper;
    let dragIcon;
    let checkbox;
    let label;
    let item;
    let deleteIcon;

    this.listNode.innerHTML = '';

    for (i; i >= 0; i -= 1) {
      item = model[i];

      // Create text wrapper for task
      textWrapper = View.createNodeWithText('span', item.task);
      textWrapper.classList.add('list__task');

      // Create drag icon
      dragIcon = document.createElement('ion-icon');
      dragIcon.setAttribute('name', 'apps-outline');
      dragIcon.classList.add('list__drag-icon');
      dragIcon.addEventListener('mousedown', function () {
        this.parentElement.setAttribute('draggable', true);
      });

      // Create checkbox input
      checkbox = document.createElement('input');
      checkbox.style.display = 'none';
      checkbox.classList.add('list__checkbox');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('id', `toggle-task-${i}`);
      if (item.completed) checkbox.checked = true;

      // Create checkbox label
      label = document.createElement('label');
      label.classList.add('list__label');
      label.setAttribute('for', `toggle-task-${i}`);
      label.addEventListener(
        'click',
        (function (index) {
          return function () {
            Controller.updateList('toggleComplete', index);
          };
        })(i)
      );

      // Create delete icon
      deleteIcon = document.createElement('ion-icon');
      deleteIcon.setAttribute('name', 'trash-outline');
      deleteIcon.classList.add('list__delete-icon');
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
      itemNode = document.createElement('li');
      itemNode.appendChild(dragIcon);
      itemNode.appendChild(checkbox);
      itemNode.appendChild(textWrapper);
      itemNode.appendChild(label);
      itemNode.appendChild(deleteIcon);
      itemNode.classList.add('list__item');
      itemNode.addEventListener('dragend', function () {
        this.setAttribute('draggable', false);
      });

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

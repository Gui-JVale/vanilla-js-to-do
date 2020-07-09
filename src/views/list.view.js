import View from './view';
import { default as Controller } from '../controllers/controller';

class ListView extends View {
  init() {
    this.setupProps(); // Set variables / DOM elements
    this.setupEventListeners(); // Attach event listeners
    Controller.subscribe(this.render, 'modelUpdate', this); // Subscribe to model

    // Render
    return this.render(Controller.getList());
  }

  /*
   *
   * @param model to do list
   * Builds "li" for each task and append full list
   * to DOM
   */
  render(model) {
    const frag = document.createDocumentFragment();
    let i = model.length - 1;
    let itemNode;
    let item;
    let childs;

    this.listNode.innerHTML = '';
    this.input.value = '';

    for (i; i >= 0; i -= 1) {
      item = model[i];

      // Build "LI" element w/ its children
      childs = ListView.buildChildNodes(item, i);
      itemNode = ListView.buildItemNode(childs, i);
      this.addDragAndDrop(itemNode); // Add drag and drop func.

      frag.appendChild(itemNode); // Append to frag
    }
    return this.listNode.appendChild(frag); // Append to DOM
  }

  setupProps() {
    this.listNode = document.getElementById('list-view');
    this.input = document.getElementById('task');
    this.submit = document.getElementById('submit-form');
    this.clear = document.getElementById('clear-list');
    this.dropzone = document.createElement('li');
    this.ghostNode = null;
    this.dragging = null;
    this.draggedOver = null;
    this.shiftX = null;
    this.shiftY = null;
    this.dropzone.classList.add('list__drag-dropzone');
  }

  setupEventListeners() {
    this.submit.addEventListener('click', this.handleSubmit.bind(this));
    this.clear.addEventListener('click', function () {
      Controller.updateList('empty');
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { value } = this.input;

    if (!value) return this;
    return Controller.updateList('add', { completed: false, task: value });
  }

  addDragAndDrop(itemNode) {
    const dragIcon = itemNode.querySelector('.list__drag-icon');
    return this.dragAndDrop(dragIcon);
  }

  static buildItemNode(childs, index) {
    const itemNode = document.createElement('li');
    itemNode.dataset.index = index;
    childs.forEach((child) => itemNode.appendChild(child));
    itemNode.classList.add('list__item');

    return itemNode;
  }

  static buildChildNodes(item, i) {
    const childs = [];

    childs.push(ListView.buildDragIcon());
    childs.push(ListView.buildTextWrapper(item.task));
    childs.push(ListView.buildCheckbox(item.completed, i));
    childs.push(ListView.buildLabel(i));
    childs.push(ListView.buildDeleteIcon(i));

    return childs;
  }

  static buildTextWrapper(text) {
    const textWrapper = View.createNodeWithText('span', text);
    textWrapper.draggable = false;
    textWrapper.classList.add('list__task');
    textWrapper.addEventListener('dragstart', function (e) {
      e.preventDefault();
      e.cancelBubble();
    });

    return textWrapper;
  }

  static buildDragIcon() {
    const dragIcon = document.createElement('ion-icon');
    dragIcon.setAttribute('name', 'apps-outline');
    dragIcon.classList.add('list__drag-icon');
    dragIcon.addEventListener('mousedown', function () {
      this.parentElement.setAttribute('draggable', true);
    });
    return dragIcon;
  }

  static buildCheckbox(checked, index) {
    const checkbox = document.createElement('input');
    checkbox.style.display = 'none';
    checkbox.classList.add('list__checkbox');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', `toggle-task-${index}`);
    if (checked) checkbox.checked = true;

    return checkbox;
  }

  static buildLabel(i) {
    const label = document.createElement('label');
    label.classList.add('list__label');
    label.setAttribute('for', `toggle-task-${i}`);
    label.addEventListener('dragstart', ListView.stop);
    label.addEventListener(
      'click',
      (function (index) {
        return function () {
          Controller.updateList('toggleComplete', index);
        };
      })(i)
    );

    return label;
  }

  static buildDeleteIcon(index) {
    const deleteIcon = document.createElement('span');
    const trash = document.createElement('ion-icon');
    trash.setAttribute('name', 'trash-outline');
    deleteIcon.classList.add('list__delete-icon');
    deleteIcon.appendChild(trash);
    deleteIcon.addEventListener('dragstart', ListView.stop);
    deleteIcon.addEventListener('click', function () {
      Controller.updateList('remove', index);
    });

    return deleteIcon;
  }

  /*
   *
   * Drag n'Drop Algorithm:
   *
   * The Drag n'Drop functionality consists of 3 events:
   * mousedown, mousemove and mouseup.
   *
   * On MouseDown:
   *  - Default drag listener is canceled
   *  - The dragged element is set as this.dragging (to use later)
   *  - A "Ghost Node" is created by cloning the dragging element
   * (this is the element that is the one actually dragged around
   * the screen, like a facade)
   *  - The original dragged element is hidden
   *  - The dropzone element is appended to the list -- for better UX
   *  - Then the initial move occurs, based on where the user click
   * happened on the screen
   *  - After that, the event listeners of mousemove and mouseup
   * are added to the ghostNode
   *
   */
  dragAndDrop(dragBtn) {
    dragBtn.addEventListener(
      'mousedown',
      function (event) {
        this.dragging = dragBtn.parentElement;
        this.shiftX =
          event.clientX - this.dragging.getBoundingClientRect().left;
        this.shiftY = event.clientY - this.dragging.getBoundingClientRect().top;

        // Setup
        this.ghostNode = this.dragging.cloneNode(true);
        this.ghostNode.classList.add('list__dragging');
        this.ghostNode.addEventListener('dragstart', (e) => e.preventDefault());
        dragBtn.addEventListener('dragstart', (e) => e.preventDefault());
        this.listNode.insertBefore(this.dropzone, this.dragging);
        this.dragging.style.display = 'none';
        document.body.append(this.ghostNode);
        ListView.moveAt(
          this.ghostNode,
          event.pageX - this.shiftX / 2,
          event.pageY - this.shiftY / 2
        ); // Initial Coordinates (based on initial press)

        // On Mouse Move Event
        this.ghostNode.addEventListener(
          'mousemove',
          this.draggingOnMouseMove.bind(this)
        );

        // On Mouse up Event
        this.ghostNode.addEventListener(
          'mouseup',
          this.draggingOnMouseUp.bind(this)
        );
      }.bind(this)
    );
  }

  /*
   *
   * Drag n'Drop Algorithm:
   *
   * On MouseMove:
   *  - We get the element below the dragged element
   *  - We than move the ghost element based on where the
   * mouse currently is (creating the drag functionality)
   *  - If the element below the one dragged is an <li>,
   * we then store it on this.draggedOver (to refer later)
   *  - Then the dropzone is inserted before the element
   * below the one being dragged
   *
   */
  draggingOnMouseMove(e) {
    const elemBelow = ListView.getElemBelow(this.ghostNode, e);

    ListView.moveAt(
      this.ghostNode,
      e.pageX - this.shiftX / 2,
      e.pageY - this.shiftY / 2
    );
    if (elemBelow && elemBelow.tagName === 'LI') {
      this.draggedOver = elemBelow;
      elemBelow.parentElement.insertBefore(this.dropzone, this.draggedOver);
    }
  }

  /*
   *
   * Drag n'Drop Algorithm:
   *
   * On MouseUp:
   *  - Check if this.dragging and this.draggedOver are valid
   *  - Now the actual insertion occurs. The original dragged
   * element is inserted before the draggedOver(declared on
   * the mouseup event)
   * - The Ghost node and dropzone are removed
   * - Event listeners are removed
   * - All dragging props are reset to null
   */
  draggingOnMouseUp() {
    if (this.draggedOver && this.dragging) {
      this.listNode.insertBefore(this.dragging, this.draggedOver);

      // Add controller logic
    }
    // Reset
    this.ghostNode.removeEventListener('mousemove', this.draggingOnMouseMove);
    this.ghostNode.removeEventListener('mouseup', this.draggingOnMouseUp);
    this.listNode.removeChild(this.dropzone);
    document.body.removeChild(this.ghostNode);
    this.dragging.style.display = 'flex';

    this.ghostNode = null;
    this.dragging = null;
    this.draggedOver = null;
  }

  static getElemBelow(topNode, event) {
    const node = topNode;

    node.style.display = 'none';
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    node.style.display = 'flex';
    return elemBelow;
  }

  static moveAt(element, x, y) {
    const node = element;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
  }

  static stop(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

export default ListView;

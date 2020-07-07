import model from '../models/model';

/*
 *
 * Brains of the app
 * Manage subscriptions
 * Talks to the model
 */
class Controller {
  static subscribers = {
    any: [],
  };

  static subscribe(fn, type, context) {
    const pubtype = type || 'any';
    const subs = Controller.subscribers;
    if (typeof subs[pubtype] === 'undefined') {
      subs[pubtype] = [];
    }
    subs[type].push({ fn, context: context || this });
  }

  static unsubscribe(fn, type, context) {
    this.visitSubscribers('unsubscribe', fn, type, context);
  }

  static publish(publication, type) {
    this.visitSubscribers('publish', publication, type);
  }

  static visitSubscribers(action, arg, type, context) {
    const pubtype = type || 'any';
    const subscribers = Controller.subscribers[pubtype];
    subscribers.forEach((sub, i) => {
      if (action === 'publish') {
        sub.fn.call(sub.context, arg);
      } else if (sub === arg && sub.context === context) {
        subscribers.splice(i, 1);
      }
    });
  }

  static getList() {
    return model.filter((m) => m);
  }

  static getTask(i) {
    return model[i];
  }

  static add(task) {
    if (task) {
      return model.push(task);
    }
    return false;
  }

  static remove(arg) {
    return model.splice(typeof arg === 'string' ? model.indexOf(arg) : arg);
  }

  static swap([index1, index2]) {
    const temp = model[index1];
    model[index1] = model[index2];
    model[index2] = temp;
  }

  static toggleComplete(index) {
    const task = Controller.getTask(index);
    if (task) task.completed = !task.completed;
    return this;
  }

  static empty() {
    return model.splice(0, model.length);
  }

  static save() {
    return localStorage.setItem(
      'model',
      JSON.stringify(model.filter((m) => m))
    );
  }

  static autoSave(fn, arg) {
    fn(arg);
    return this.save();
  }

  static autoSaveAndPublish(fn, arg, publication, type) {
    this.autoSave(fn, arg);
    return this.publish(publication, type);
  }

  static interface = {
    updateList(action, ...args) {
      if (typeof action !== 'string') {
        throw Error(
          'First parameter must be a string defining the type of action'
        );
      }

      if (action === 'add' && typeof args[0] === 'object') {
        Controller.autoSaveAndPublish(
          Controller.add,
          args[0],
          model,
          'modelUpdate'
        );
      } else if (action === 'add' && typeof args[0] !== 'object') {
        throw Error('If action is to add, second parameter must an object');
      }

      if (action === 'remove' && typeof args[0] === 'number') {
        Controller.autoSaveAndPublish(
          Controller.remove,
          args[0],
          model,
          'modelUpdate'
        );
      } else if (action === 'remove' && typeof args[0] !== 'number') {
        throw Error(
          'If action is to delete, second parameter must be an index'
        );
      }

      if (action === 'toggleComplete' && typeof args[0] === 'number') {
        Controller.autoSaveAndPublish(
          Controller.toggleComplete,
          args[0],
          model,
          'modelUpdate'
        );
      }

      if (action === 'swap' && args.length === 2) {
        Controller.autoSaveAndPublish(
          Controller.swap,
          args,
          model,
          'modelUpdate'
        );
      }

      if (action === 'empty') {
        Controller.autoSaveAndPublish(
          Controller.empty,
          null,
          model,
          'modelUpdate'
        );
      }
    },

    subscribe: Controller.subscribe,

    unsubscribe: Controller.unsubscribe,

    getList: Controller.getList,
  };
}

export default Controller.interface;

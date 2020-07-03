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
    return model;
  }

  static getTask(i) {
    return model[i];
  }

  static add(task) {
    return model.push(task);
  }

  static remove(arg) {
    return model.splice(typeof arg === 'string' ? model.indexOf(arg) : arg);
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
    return localStorage.setItem('model', JSON.stringify(model));
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
    updateList(action, arg) {
      if (typeof action !== 'string') {
        throw Error(
          'First parameter must be a string defining the type of action'
        );
      }

      if (action === 'add' && typeof arg === 'object') {
        Controller.autoSaveAndPublish(
          Controller.add,
          arg,
          model,
          'modelUpdate'
        );
      } else if (action === 'add' && typeof arg !== 'object') {
        throw Error('If action is to add, second parameter must an object');
      }

      if (action === 'remove' && typeof arg === 'number') {
        Controller.autoSaveAndPublish(
          Controller.remove,
          arg,
          model,
          'modelUpdate'
        );
      } else if (action === 'remove' && typeof arg !== 'number') {
        throw Error(
          'If action is to delete, second parameter must be an index'
        );
      }

      if (action === 'toggleComplete' && typeof arg === 'number') {
        Controller.autoSaveAndPublish(
          Controller.toggleComplete,
          arg,
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

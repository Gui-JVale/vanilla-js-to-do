import Controller from './controller';

const controller = new Controller();

class ControllerInterface {
  constructor() {
    this.interface = 'facade';
    this.controller = controller;
  }
}

export default ControllerInterface;

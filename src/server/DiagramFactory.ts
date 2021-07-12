import Diagram from './Diagram';

export default class DiagramFactory {
  static make() {
    return new Diagram();
  }
}

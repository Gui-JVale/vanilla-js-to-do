class View {
  static createNodeWithText(node, text, ...args) {
    const elem = document.createElement(node);
    let string;

    if (typeof node !== 'string')
      throw Error('First argument must be valid node string');
    if (Array.isArray(text)) string = text.join(' ');
    if (args) string = `${text} ${args.join(' ')}`;

    elem.appendChild(document.createTextNode(string || text));

    return elem;
  }
}

export default View;

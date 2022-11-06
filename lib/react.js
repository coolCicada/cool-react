function isTextVdom(vdom) {
  return typeof vdom === 'string' || typeof vdom === 'number';
}
function isElementVdom(vdom) {
  return typeof vdom === 'object' && typeof vdom.type === 'string';
}
function isComponentVdom(vdom) {
  return typeof vdom === 'object' && typeof vdom.type === 'function';
}
function setAttribute(dom, props) {
  for (const key in props) {
    const value = props[key];
    if (typeof value === 'function' && key.startsWith('on')) {
      const eventType = key.slice(2).toLowerCase();
      dom.__handlers = dom.__handlers || {};
      dom.removeEventListener(eventType, dom.__handlers[eventType]);
      dom.addEventListener(eventType, value);
      dom.__handlers[eventType] = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(dom.style, value);
    } else if (key === 'className') {
      dom.setAttribute('class', value);
    } else if (key === 'ref') {
      value(dom);
    } else if (key === 'key') {
      dom.__key = value;
    } else if (typeof value !== 'object' && typeof value !== 'function') {
      dom.setAttribute(key, value);
    }
  }
}
function createElement(type, props, ...children) {
  const childrenArr = [];
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      childrenArr.push(...children[i]);
    } else {
      childrenArr.push(children[i]);
    }
  }
  return {
    type,
    props,
    children: childrenArr
  };
}
function replace(newDom, oldDom) {
  oldDom.parentNode.replaceChild(newDom, oldDom);
  return newDom;
}
function patchText(dom, vdom) {
  return replace(render(vdom), dom);
}
function patchComponent(dom, vdom) {
  const props = Object.assign({}, vdom.props, {
    children: vdom.children
  });
  if (dom.__instance && dom.__instance.constructor === vdom.type) {
    return patch(dom, dom.__instance.render());
  } else if (Component.isPrototypeOf(vdom.type)) {
    return replace(render(vdom), dom);
  } else {
    return patch(dom, vdom.type(props));
  }
}
function patchTag(dom, vdom) {
  if (dom.nodeName !== vdom.type.toUpperCase() && vdom === 'object') {
    return replace(render(vdom), dom);
  } else {
    for (const attr of dom.attributes) dom.removeAttribute(attr.name);
    setAttribute(dom, vdom.props);
    const oldDoms = {};
    [].concat(...dom.childNodes).map((child, index) => {
      const key = child.__key || `_index_${index}`;
      oldDoms[key] = child;
    });
    [].concat(...vdom.children).map((child, index) => {
      const key = child.props && child.props.key || `_index_${index}`;
      let newDom = null;
      if (oldDoms[key]) {
        newDom = patch(oldDoms[key], child);
      } else {
        newDom = render(child);
      }
      dom.appendChild(newDom);
      delete oldDoms[key];
    });
    for (const key in oldDoms) {
      oldDoms[key].remove();
    }
    return dom;
  }
}
function patch(dom, vdom) {
  if (dom instanceof Text) return patchText(dom, vdom);else if (isComponentVdom(vdom)) return patchComponent(dom, vdom);else return patchTag(dom, vdom);
}
class Component {
  constructor(props) {
    this.props = props || {};
    this.state = null;
  }
  setState(nextState) {
    this.state = {
      ...this.state,
      ...nextState
    };
    if (this.dom) {
      patch(this.dom, this.render());
    }
  }
}
function render(vdom, parent) {
  let dom = null;
  if (isTextVdom(vdom)) {
    dom = document.createTextNode(vdom);
  } else if (isElementVdom(vdom)) {
    dom = document.createElement(vdom.type);
    for (const child of vdom.children) {
      dom.appendChild(render(child));
    }
    setAttribute(dom, vdom.props);
  } else if (isComponentVdom(vdom)) {
    const props = Object.assign({}, vdom.props, {
      children: vdom.children
    });
    if (Component.isPrototypeOf(vdom.type)) {
      const instance = new vdom.type(props);

      // instance.componentWillMount();

      const componentVdom = instance.render();
      dom = render(componentVdom);

      // instance.componentDidMount();

      instance.dom = dom;
      dom._instance = instance;
    } else {
      dom = render(vdom.type(props));
    }
  }
  if (parent) {
    return parent.appendChild(dom);
  }
  return dom;
}
export { createElement, render, Component };
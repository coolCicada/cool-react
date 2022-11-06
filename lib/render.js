import { render, createElement, Component } from './react.js';
function Item(props) {
  return createElement("li", {
    className: "item",
    style: props.style,
    onClick: props.onRemoveItem
  }, props.children);
}
;
class List extends Component {
  constructor(props) {
    super();
    this.state = {
      list: [{
        text: 'aaa',
        color: 'blue'
      }, {
        text: 'ccc',
        color: 'orange'
      }, {
        text: 'ddd',
        color: 'red'
      }],
      textColor: props.textColor
    };
  }
  handleAdd() {
    this.setState({
      list: [...this.state.list, {
        text: this.ref.value
      }]
    });
  }
  handleItemRemove(index) {
    this.setState({
      list: this.state.list.filter((item, i) => i !== index)
    });
  }
  render() {
    return createElement("div", {
      className: "wrapper"
    }, createElement("ul", {
      className: "list"
    }, this.state.list.map((item, index) => {
      return createElement(Item, {
        style: {
          background: item.color,
          color: this.state.textColor
        },
        onRemoveItem: () => this.handleItemRemove(index)
      }, item.text);
    })), createElement("div", null, createElement("input", {
      ref: ele => {
        this.ref = ele;
      }
    }), createElement("button", {
      onClick: this.handleAdd.bind(this)
    }, "add")));
  }
}
render(createElement(List, {
  textColor: 'pink'
}), document.getElementById('app'));
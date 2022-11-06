import { render, createElement, Component } from './react.js';

function Item(props) {
  return (
    <li
      className='item'
      style={props.style}
      onClick={props.onRemoveItem}
    >
      {props.children}
    </li>
  ) 
};

class List extends Component {
  constructor(props) {
    super();
    this.state = {
      list: [
        {
            text: 'aaa',
            color: 'blue'
        },
        {
            text: 'ccc',
            color: 'orange'
        },
        {
            text: 'ddd',
            color: 'red'
        }
      ],
      textColor: props.textColor
    }
  }

  handleAdd() {
    this.setState({
      list: [
        ...this.state.list,
        {
          text: this.ref.value
        }
      ]
    })
  }

  handleItemRemove(index) {
    this.setState({
      list: this.state.list.filter((item, i) => i !== index)
    })
  }

  render() {
    return (
      <div className='wrapper'>
        <ul className='list'>
          {this.state.list.map((item, index) => {
            return (
              <Item
                style={{ background: item.color, color: this.state.textColor }}
                onRemoveItem={() => this.handleItemRemove(index)}
              >
                {item.text}
              </Item>
            )
          })}
        </ul>
        <div>
          <input ref={(ele) => {this.ref = ele}}/>
          <button onClick={this.handleAdd.bind(this)}>add</button>
        </div>
      </div>
    )
  }
}

render(<List textColor={'pink'}/>, document.getElementById('app'))

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// This is a "functional component". It is a title-case function that returns React's XML-
// like template. It is not a class, and has no concept of `this`. Just pass in the props
// and read off them like any object.
function Square(props) {
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  /* 
    In React, the parent should be responsible for maintaining the state of all children,
    not each child maintaining their own state. State can be passed from parent to child
    using `props`. This is more efficient, reliable, and maintainable.

  */
  constructor(props) {
    // `super` is a special function when working with classes, and more specifically
    // subclasses. Super will inherit the methods and relevant properties of the
    // parent class.. In this case `React.Component`
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    }
  }

  handleClick(i) {
    // Sliced to change data without mutation. We want to preserve the state of `squares`
    // at this point in time so that we can have an "undo" button
    // It is also more performant in React to "batch update" an object... Only one traversal
    // of the DOM is required to see these changes.
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares})
  }

  renderSquare(i) {
    return <Square
      value={this.state.squares[i]}
      /*
        State can't be updated from child up to parent, but you _can_ pass functions
        as a prop. functions will be executed from the scope of their definition, in
        this case, Board. On Square click, it will execute the `handleClick` method in
        the parent Board.
      */
      onClick={() => this.handleClick(i)}
    />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

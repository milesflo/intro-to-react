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
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      /*
        State can't be updated from child up to parent, but you _can_ pass functions
        as a prop. functions will be executed from the scope of their definition, in
        this case, Board. On Square click, it will execute the `handleClick` method in
        the parent Board.
      */
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
  
    return (
      <div>
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
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // You can use `map` over an array to create UI elements for each entry
    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move
        : 'Go to game start';
      return (
        /*
          `key` is a special, reserved property in React. It is used to identify UI elements
          like `id` in native HTML. These keys are very useful for dynamically created lists.
          This must be unique for every entry created. 

        */
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // Sliced to change data without mutation. We want to preserve the state of `squares`
    // at this point in time so that we can have an "undo" button
    // It is also more performant in React to "batch update" an object... Only one traversal
    // of the DOM is required to see these changes.
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // Using `concat` here is prefered over `push` since it does not mutate the original array
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    })
  }

}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// This is absurd and I'm glad it came with the tute
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

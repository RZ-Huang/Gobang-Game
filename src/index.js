import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

const boardSize = 19;

// 計算是否有贏家了，每步棋都會進入這裡計算
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3, 4],
    [19, 20, 21, 22, 23],
    [38, 39, 40, 41, 42],
    [57, 58, 59, 60, 61],
    [76, 77, 78, 79, 80],
    [0, 19, 38, 57, 76],
    [1, 20, 39, 58, 77],
    [2, 21, 40, 59, 78],
    [3, 22, 41, 60, 79],
    [4, 23, 42, 61, 80],
    [0, 20, 40, 60, 80],
    [4, 22, 40, 58, 76],
  ];

  for (let i = 0; i <= boardSize - lines[0].length; i += 1) {
    for (let j = 0; j <= boardSize - lines[0].length; j += 1) {
      const updateLines = lines.map(line => (
        line.map(number => (number + boardSize * i + j))
      ));
      for (let k = 0; k < lines.length; k += 1) {
        const [a, b, c, d, e] = updateLines[k];
        if (squares[a]
          && squares[a] === squares[b] && squares[a] === squares[c]
          && squares[a] === squares[d] && squares[a] === squares[e]
        ) {
          return squares[a];
        }
      }
    }
  }

  return null;
}

// 每個格子的 render
function Square(props) {
  const { value, onClick } = props;
  return (
    <button type="button" className="square" onClick={onClick}>
      {value}
    </button>
  );
}

// 棋盤的 render
class Board extends Component {
  renderSquare(i) {
    const { squares, onClick } = this.props;
    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {
          [...Array(boardSize)].map((row, i) => (
            <div key={i} className="board-row">
              {
                [...Array(boardSize)].map((square, j) => this.renderSquare(boardSize * i + j))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(boardSize * boardSize).fill(null),
        rows: '',
        columns: '',
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // 跳到選擇的 step 的歷史步驟
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  // 每次點格子就會觸發改變狀態，除非格子已是非 null 的資料或是已有贏家
  handleClick(i) {
    const { history, xIsNext, stepNumber } = this.state;
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return null;
    }
    squares[i] = xIsNext ? '⚫' : '⚪';
    this.setState({
      history: currentHistory.concat([{
        squares,
        rows: i % boardSize,
        columns: parseInt(i / boardSize, 10),
      }]),
      stepNumber: currentHistory.length,
      xIsNext: !xIsNext,
    });

    return null;
  }

  render() {
    const { history, stepNumber, xIsNext } = this.state;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    // render 所有歷史步驟
    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move # ${move}(${step.rows + 1},${step.columns + 1})`
        : 'Go to game start';
      return (
        <li key={move}>
          <button type="button" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      alert(`Winner: ${winner}`);
    } else {
      status = `Next player: ${(xIsNext ? '⚫' : '⚪')}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById('root'));

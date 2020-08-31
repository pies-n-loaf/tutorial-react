import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import toe from './toe.svg';
import tictac from './tic-tac.svg';
import tictactoe from './tic-tac-toe.svg';
import './index.css';

function Square(props) {
  return (
    <button
      className={"square" + (props.isWinner ? " winner" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinner={(this.props.winningSquares && this.props.winningSquares.includes(i))}
        key={i}
      />
    );
  }

  render() {
    const rows = Array(3).fill(null).map((row, i) => {
      const squares = Array(3).fill(null).map((square, j) => {
        return this.renderSquare(j + (3 * i));
      });
      return (
        <div className="board-row" key={i}>
          {squares}
        </div>
      );
    });

    return (
      <div>
        {rows}
      </div>
    );
  }
}

function MovePosition(props) {
  if (!props.col || !props.row) {
    return null;
  }
  return (
    <span className="move-position">
      ({props.col}, {props.row})
    </span>
  );
}

class Move extends React.Component {
  renderPosition() {
    return (
      <MovePosition
        col={this.props.position ? this.props.position.col : null}
        row={this.props.position ? this.props.position.row : null}
      />
    );
  }

  render() {
    const position = this.renderPosition();
    let desc = this.props.move ?
      'move #' + this.props.move :
      'game start';
    desc = this.props.isCurrent ?
      desc[0].toUpperCase() + desc.slice(1) :
      "Go to " + desc;

    return (
      <button
        className={"btn btn-outline-info move px-2 py-1 mx-2" + (this.props.isCurrent ? " current" : "")}
        disabled={this.props.isCurrent}
        onClick={this.props.onClick}
      >
        {desc} {position}
      </button>
    );
  }
}

class MoveList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reversed: false,
    };
  }

  reverseMoves() {
    const reversed = this.state.reversed;
    this.setState({
      reversed: !reversed,
    });
  }

  renderMove(move, position) {
    return (
      <Move
        move={move}
        position={position}
        isCurrent={(this.props.currentMove === move)}
        onClick={() => this.props.onClick(move)}
      />
    );
  }

  render() {
    const history = this.props.history;
    let moves = history.map((step, move) => {
      const previousMove = move ?
        history[move - 1].squares : null;
      const position = determinePosition(previousMove, step.squares);

      return (
        <li key={move} className="my-2">
          {this.renderMove(move, position)}
        </li>
      );
    });
    if (this.state.reversed) {
      moves = moves.reverse();
    }

    return (
      <div>
        <ol className="moves pl-3">{moves}</ol>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-info btn-sm border-0 px-1 py-0 sort"
            onClick={() => this.reverseMoves()}
          >
            Sort moves in
            {this.state.reversed ? " ascending " : " descending "}
            order
          </button>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
        return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else if (this.state.stepNumber < 9) {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    } else {
      status = "Draw"
    }

    return (
      <div className="game container-fluid p-md-5 p-3">
        <h1 className="display-2 px-lg-5 py-2">Tic-Tac-Toe</h1>
        <div className="row px-lg-5 py-3">
          <div className="game-board col-12 col-md py-3">
            <h2 className="status">{status}</h2>
            <Board
              squares={current.squares}
              winningSquares={winner ? winner.move : null}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info col-12 col-md py-3">
            <h2>Moves</h2>
            <MoveList
              history={this.state.history}
              currentMove={this.state.stepNumber}
              onClick={(move) => this.jumpTo(move)}
            />
          </div>
        </div>
      </div>
    );
  }
}

function IconsAttribute(props) {
  return (
    <p className="small">
      Icons made by{' '}
      <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> (tic-tac-toe),{' '}
      <a href="https://creativemarket.com/eucalyp" title="Eucalyp">Eucalyp</a> (tic-tac), and{' '}
      <a href="https://www.flaticon.com/authors/darius-dan" title="Darius Dan">Darius Dan</a> (toe) from{' '}
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>.
    </p>
  );
}

function Footer(props) {
  return (
    <footer className="footer px-md-5 px-3 py-3">
      <div className="container-fluid px-lg-5">
        <div className="d-md-flex justify-content-between align-items-top mt-4">
          <div>
            <p className="made-by mb-1">
              Made by Sandy.
            </p>
            <IconsAttribute />
            <div class="text-center text-md-left">
              <img src={tictac} className="tic-tac" alt="tic-tac" />
              <img src={toe} className="toe" alt="toe" />
            </div>
          </div>
          <div className="text-center mt-3 mt-md-0">
            <img src={logo} className="logo" alt="ReactJS logo" />
            <p>
              <a href="https://reactjs.org/" className="react-home">React</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Header(props) {
  return (
    <header className="header px-md-5 px-3 py-2">
      <nav className="navbar navbar-light px-lg-5">
        <a className="navbar-brand" href="https://github.com/simply-so/tutorial-react">
          <img src={tictactoe} className="tic-tac-toe d-inline-block align-center mr-2" alt="tic-tac-toe" />
          <span className="d-none d-md-inline">
            : a <span className="react-js">reactjs</span> practice app
          </span>
        </a>
      </nav>
    </header>
  );
}

class Page extends React.Component {
  render () {
    return (
      <div className="page">
        <Header />
        <Game />
        <Footer />
      </div>
    );
  }
}

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
      return {
        player: squares[a],
        move: lines[i],
      };
    }
  }
  return null;
}

function determinePosition(oldSquares, newSquares) {
  let newSquare;
  for (let i = 0; i < newSquares.length; i++) {
    if ((!oldSquares && newSquares[i]) || (oldSquares && (oldSquares[i] !== newSquares[i]))) {
      newSquare = i;
      break;
    }
  }
  if (newSquare === null) { return null; }

  const row = parseInt(newSquare / 3) + 1;
  const col = (newSquare % 3) + 1;
  return {
    col: col,
    row: row,
  };
}

// ========================================

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);

/* TODO: my ideas for improvements
 *  - add the ability to toggle between light and dark mode
 */

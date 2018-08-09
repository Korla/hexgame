import React from 'react';
import { HexGrid, Token } from 'boardgame.io/ui';
import { gameSize } from './constants';
import { isClickable, getCell } from './game';

const style = {
  maxWidth: '50%',
  maxHeight: '50%',
  padding: '40',
};

const possibleMoves = [
  {
    text: 'Claim neighbors',
    move: 'claimNeighbors',
  },
  {
    text: 'Attack x',
    move: 'attackX',
  },
  {
    text: 'Attack y',
    move: 'attackY',
  },
  {
    text: 'Attack z',
    move: 'attackZ',
  },
];

const getMoveStyle = (isSelected) => ({
  padding: 10,
  marginLeft: 10,
  border: '1px solid black',
  cursor: 'pointer',
  backgroundColor: isSelected ? '#ddd' : 'inherit',
})

export class Board extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      selectedMove: 0
    }
    this.onCellClick = this.onCellClick.bind(this);
    this.onMoveClick = this.onMoveClick.bind(this);
    this.render = this.render.bind(this);
  }

  onCellClick({ x, y }) {
    const cell = getCell(x, y, this.props.G.cells);
    if (isClickable(cell)) {
      this.props.moves[possibleMoves[this.state.selectedMove].move](cell);
    }
  }

  onMoveClick(id) {
    this.setState({ selectedMove: id });
  }

  render() {
    const tokens = [
      ...this.props.G.cells
        .filter(({ player }) => player !== undefined)
        .map(({ x, y, coord, player }) => (
          <Token
            key={coord}
            x={x}
            y={y}
            z={-x - y}
            style={{ fill: this.props.G.playerColors[player] }}
          />
        )),
      ...this.props.G.cells
        .filter(isClickable)
        .map(({ x, y, coord }) => (
          <Token
            key={coord}
            x={x}
            y={y}
            z={-x - y}
            style={{ fill: '#ddd' }}
          />
        ))
    ];

    const winner = this.props.ctx.gameover ?
      this.props.ctx.gameover.winner !== undefined ?
        (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) :
        (
          <div id="winner">Draw!</div>
        ) :
      null;

    return (
      <div>
        <HexGrid levels={gameSize} outline={true} onClick={this.onCellClick} style={style}>
          {tokens}
        </HexGrid>
        {winner}
        <div>
          {
            possibleMoves.map((m, i) => (
              <span key={i} onClick={() => this.onMoveClick(i)} style={getMoveStyle(i === this.state.selectedMove)}>
                {m.text}
              </span>
            ))
          }
        </div>
      </div>
    );
  }
}

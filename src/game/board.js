import React from 'react';
import { HexGrid } from 'boardgame.io/ui';
import { getCoord } from './game';

const style = {
  display: 'flex',
  flexDirection: 'column'
};

const hexStyle = {
  display: 'flex',
  flexGrow: 1,
  width: 500,
}

const menuStyle = {
  display: 'flex',
  justifyContent: 'spaceAround',
}

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
    };
    this.onCellClick = this.onCellClick.bind(this);
    this.onMoveClick = this.onMoveClick.bind(this);
    this.render = this.render.bind(this);
  }

  onCellClick(iCoord) {
    if (this.props.G.clickableCells[getCoord(iCoord)] === undefined) {
      return;
    }
    this.props.moves[possibleMoves[this.state.selectedMove].move](iCoord);
  }

  onMoveClick(id) {
    this.setState({ selectedMove: id });
  }

  render() {
    const neighboorCells = Object.keys(this.props.G.clickableCells)
      .reduce((prev, curr) => {
        prev[curr] = '#ddd';
        return prev;
      }, {});
    const colorMap = this.props.G.cells
      .reduce((prev, { x, y, z, player }) => {
        const coord = getCoord({ x, y, z });
        prev[coord] = this.props.G.playerColors[player];
        return prev;
      }, neighboorCells);

    const winner = this.props.ctx.gameover ?
      this.props.ctx.gameover.player !== undefined ?
        (
          <div id="winner">Winner: {this.props.ctx.gameover.player}</div>
        ) :
        (
          <div id="winner">Draw!</div>
        ) :
      null;

    return (
      <div style={style}>
        <HexGrid levels={this.props.G.levels} outline={true} onClick={this.onCellClick} style={hexStyle} colorMap={colorMap}></HexGrid>
        {winner}
        <div style={menuStyle}>
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

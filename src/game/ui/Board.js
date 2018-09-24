import React from 'react';
import { HexGrid } from 'boardgame.io/ui';
import { createPoint, isSame } from '../utils';
import { Token } from 'boardgame.io/dist/ui';
import { Insect } from './Insect';

const style = {
  display: 'flex',
  flexDirection: 'column'
};

const hexStyle = {
  display: 'flex',
  flexGrow: 1,
  width: 500,
}

const styles = {
  moves: {
    display: 'flex',
    flexDirection: 'row',
  },
  move: {
    padding: 5,
    border: '1px solid black',
  },
  clickableMove: {
    cursor: 'pointer',
  }
}

export class Board extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.render = this.render.bind(this);
    this.cellClicked = this.cellClicked.bind(this);
  }

  cellClicked({ x, y, z }) {
    const phase = this.props.ctx.phase;
    const point = createPoint(x, y, z);
    if (phase === 'selectInsect') {
      const found = this.props.G.insects.find((insect) => isSame(point)(insect.point));
      if (found && found.player === this.props.ctx.currentPlayer && found.isMovable === true) {
        this.props.moves.selectOld(found);
      }
    } else if (phase === 'moveInsect') {
      const found = this.props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        this.props.moves.moveInsect(found);
      }
    }
  }

  render() {
    const player = this.props.G.players[this.props.ctx.currentPlayer];
    return (
      <div style={style}>
        <HexGrid
          levels={this.props.G.grid.levels}
          style={hexStyle}
          colorMap={this.props.G.grid.colorMap}
          onClick={this.cellClicked}>
          {
            this.props.G.insects.map((insect, i) => {
              const { x, y, z } = insect.point;
              return <Token x={x} y={y} z={z} key={i}>
                <Insect insect={insect} />
              </Token>
            })
          }
        </HexGrid>
        <div>
          <div>Player: {player.id}</div>
          <div style={styles.moves}>
            {player.insects.map((insect, i) => {
              return insect.isClickable ?
                <div style={{ ...styles.move, ...styles.clickableMove }} onClick={() => this.props.moves.selectNew(insect)} key={i}>{insect.type}</div> :
                <div style={styles.move} key={i}>{insect.type}</div>;
            })}
          </div>
        </div>
        <div>phase: {this.props.ctx.phase}</div>
        <button onClick={this.props.moves.cancel}>Cancel</button>
      </div>
    );
  }
}

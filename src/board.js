import React from 'react';
import { HexGrid, Token } from 'boardgame.io/ui';
import { gameSize } from './constants';

const style = {
  maxWidth: '50%',
  maxHeight: '50%',
  padding: '40'
};

export const Board = (props) => {
  const onClick = (args) => console.log(args);
  const tokens = props.G.cells
    .filter(({ player }) => player !== undefined)
    .map(({ x, y, coord, player }) => (
      <Token
        key={coord}
        x={x}
        y={y}
        z={-x - y}
        style={{ fill: props.G.playerColors[player] }}
      />
    ));
  return (
    <HexGrid levels={gameSize} outline={true} onClick={onClick} style={style}>
      {tokens}
    </HexGrid >
  );
}

import React from 'react';

const insectColors = {
  ant: 'blue',
  queen: 'yellow',
  spider: 'brown',
  grasshopper: '#7cfc00',
}

export class Insect extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.render = this.render.bind(this);
  }

  render() {
    const { insect: { type, isMovable } } = this.props;
    return (
      <g transform="scale(.022222,.022222)">
        <g>
          <path
            d="M -10,-10 L -10,10 L 10,10 L 10,-10 Z"
            style={{
              fill: insectColors[type],
              stroke: isMovable ? 'black' : 'grey',
            }}
          />
        </g>
      </g>
    )
  }
}

import React from 'react';

const insectColors = {
  ant: 'blue',
  queen: 'yellow',
}

export class Insect extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.render = this.render.bind(this);
  }

  render() {
    const { type } = this.props;
    return (
      <g transform="scale(.022222,.022222)">
        <g>
          <path
            d="M -10,-10 L -10,10 L 10,10 L 10,-10 Z"
            style={{
              fill: insectColors[type],
              stroke: 'black',
            }}
          />
        </g>
      </g>
    )
  }
}
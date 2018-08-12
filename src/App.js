import React from 'react';
import Client from "./game/Client";

const style = {
  display: 'flex',
};

export const App = () => (
  <div style={style}>
    <Client playerID="0"></Client>
    <Client playerID="1"></Client>
  </div>
)
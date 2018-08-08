import { Client } from 'boardgame.io/react';
import { game } from './game';
import { ai } from './ai';
import { Board } from './board';

const App = Client({ game, board: Board, ai });

export default App;
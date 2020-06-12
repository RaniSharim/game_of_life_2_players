import { Board } from "./board"
import { Game } from "./game";
import { UI } from "./ui";

const board = new Board();
const game = new Game(board);
const ui = new UI(game);

ui.create_board();
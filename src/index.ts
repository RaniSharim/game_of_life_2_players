import { Board } from "./board"
import { Game } from "./game";
import { UI } from "./ui";

const game = new Game();
const ui = new UI(game);

ui.new_game();
import { BOARD_SIZE, Cell } from './board'
import { Game, GameState, CellDelta } from './game'
export class UI {

    game: Game;
    
    constructor(game: Game) {
        this.game = game
    }

    new_game() {
        this.game.init_game();

        this.set_current_player_title();
        this.set_current_placements_left();
        this.set_current_score();

        this.create_board();
        this.setup_buttons();
    }

    create_board() {
        const board = document.getElementById("playboard")
        board.innerHTML = '';

        for (let row = 0; row < BOARD_SIZE; row++) {
            const dom_row = document.createElement("div");
            dom_row.style.display = "flex";
            dom_row.style.flexDirection = "row";
            for (let col = 0; col < BOARD_SIZE; col++) {
                const dom_col = document.createElement("div");
                dom_col.className = "board_cell";
                dom_col.id = `${row}-${col}`;
                dom_col.onclick = () => this.cell_clicked(row, col)
                dom_row.appendChild(dom_col)
            }
            board.appendChild(dom_row);
        }
    }

    setup_buttons() {
        const pass_btn = document.getElementById("pass_player_button");
        pass_btn.onclick = () => this.pass_player();
        pass_btn.style.display = 'inline-block';
        pass_btn.removeAttribute("disabled");

        const new_game_btn = document.getElementById("new_game_button");
        new_game_btn.onclick = () => this.new_game();
        new_game_btn.style.display = 'none';

        const win_div = document.getElementById("winner");
        win_div.innerHTML = '';
        win_div.classList.remove('player_0');
        win_div.classList.remove('player_1');
        win_div.parentElement.style.display = "none";
    }

    cell_clicked(row: number, col: number) {
        console.log(`Clicked ${row} : ${col}`);

        if (this.game.can_place_at_xy(row, col)) {
            this.game.place_at_xy(row, col);
            const current_player = this.game.get_current_player();
            this.change_color_at_xy(row, col, `active_player_${current_player}`);
            this.set_current_placements_left();
            this.set_current_score();
        }
    }

    change_color_at_xy(row: number, col: number, css_class: string) {
        const cell = document.getElementById(`${row}-${col}`);
        cell.classList.remove("active_player_0");
        cell.classList.remove("active_player_1");
        
        if (css_class) {
            cell.classList.add(css_class);      
        }
    }

    change_colors_many(diff: CellDelta[]) {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const delta = diff[row*BOARD_SIZE + col];
                if (delta == CellDelta.NoChange) {
                    continue;
                }

                this.change_color_at_xy(row, col, delta == CellDelta.Die ? null : delta == CellDelta.SpawnPlayer0 ? "active_player_0" : "active_player_1")
            }
        }
    }

    async pass_player() {
        this.game.pass_player();
        this.set_current_player_title();

        if (this.game.get_game_state() == GameState.Run) {
            document.getElementById("pass_player_button").setAttribute("disabled", "disabled");
            this.run_game();
        }
    }

    sleep(ms: number) {
         return new Promise(resolve => setTimeout(resolve, ms));
    }

    async run_game() {
        while (this.game.get_game_state() == GameState.Run) {
            console.log(`Running game loop`)
            const board_delta = this.game.game_step();
            this.change_colors_many(board_delta);
            this.set_current_score();
            await this.sleep(500)
        }

        console.log(`Ending game loop`)

        if (this.game.get_game_state() == GameState.Place) {
            document.getElementById("pass_player_button").removeAttribute("disabled");
            this.set_current_player_title();
        }
        else if (this.game.get_game_state() == GameState.End) {
            this.end_game();
        }
    }

    end_game() {
        document.getElementById("pass_player_button").style.display = "none";
        document.getElementById("new_game_button").style.display = "inline-block";

        const score = this.game.score;
        const placements_left = this.game.get_placements_left()

        const win_div = document.getElementById("winner");
        if (score[0] + placements_left[0] > score[1] + placements_left[1]) {
            win_div.innerHTML = "Red Wins!";
            win_div.classList.add("player_0");
        } 
        else if (score[1] + placements_left[1] > score[0] + placements_left[0]) {
            win_div.innerHTML = "Blue Wins!";
            win_div.classList.add("player_1");
        }
        else {
            win_div.innerHTML = "Tie!";
        }
        
        win_div.parentElement.style.display = "block";
    }

    set_current_player_title() {
        const current_player = this.game.get_current_player();
        const current_player_title = document.getElementById(`current_player`);
        current_player_title.innerHTML = current_player == 0 ? 'Red' : 'Blue'
        current_player_title.classList.remove('player_0')
        current_player_title.classList.remove('player_1')
        current_player_title.classList.add(`player_${current_player}`)
    }

    set_current_placements_left() {
        const placements_left = this.game.get_placements_left();
        document.getElementById(`player_0_placements`).innerHTML = placements_left[0].toString();
        document.getElementById(`player_1_placements`).innerHTML = placements_left[1].toString();
    }

    set_current_score() {
        const score = this.game.calculate_score();
        document.getElementById(`player_0_score`).innerHTML = score[0].toString();
        document.getElementById(`player_1_score`).innerHTML = score[1].toString();
    }
}
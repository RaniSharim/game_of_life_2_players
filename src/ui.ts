import { Game, GameState, CellDelta, BirthRules } from './game'
export class UI {

    game: Game;
    board_size: number;
    
    constructor(game: Game) {
        this.game = game
    }

    new_game() {
        this.game.init_game();

        this.board_size = this.game.get_board_size();

        this.set_current_player_title();
        this.set_current_placements_left();
        this.set_current_score();

        this.create_board();
        this.setup_buttons();
    }

    create_board() {
        const board = document.getElementById("playboard")
        board.innerHTML = '';

        for (let row = 0; row < this.board_size; row++) {
            const dom_row = document.createElement("div");
            dom_row.style.display = "flex";
            dom_row.style.flexDirection = "row";
            for (let col = 0; col < this.board_size; col++) {
                const dom_col = document.createElement("div");
                dom_col.classList.add("board_cell");
                
                dom_col.classList.add(`_${this.board_size}X${this.board_size}`);

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

        const instructions_toggle = document.getElementById("instructions_toggle");
        instructions_toggle.onclick = () => {
            const instructions = document.getElementById('instructions');
            if (instructions.style.display == "none") {
                instructions.style.display = "block"
            }
            else {
                instructions.style.display = "none"
            }
        }

        const configuration_toggle = document.getElementById("configuration_toggle");
        configuration_toggle.onclick = () => {
            const configuration = document.getElementById('configuration');
            if (configuration.style.display == "none") {
                configuration.style.display = "block"
            }
            else {
                configuration.style.display = "none"
            }
        }

        const save_config = document.getElementById("save_config");
        save_config.onclick = () => this.save_config()

        const random_place_div = document.getElementById('random_place_div');
        random_place_div.style.display = "block";

        const random_place_button = document.getElementById("random_place_button");
        random_place_button.removeAttribute("disabled");
        random_place_button.onclick = () => this.random_placement();
    }

    select_birth_rules(birth_rules_str: string) {
        switch (birth_rules_str) {
            case "normal" : return BirthRules.Normal;
            case "three_plus_one" : return BirthRules.ThreePlusOne;
            case "both" : return BirthRules.Both;
            case "p2life" : return BirthRules.P2Life;
            default: return BirthRules.Normal;
        }
    }

    save_config() {
        const max_first_player_placements =  (<HTMLInputElement>document.getElementById("max_first_player_placements")).value;
        const max_second_player_placements =  (<HTMLInputElement>document.getElementById("max_second_player_placements")).value;
        const max_round_placements =  (<HTMLInputElement>document.getElementById("max_round_placements")).value;
        const board_size = (<HTMLSelectElement>document.getElementById("board_size")).value;

        const birth_rules = (<HTMLSelectElement>document.getElementById("birth_rules")).value;
        
        this.game.set_config(parseInt(max_first_player_placements), parseInt(max_second_player_placements), parseInt(max_round_placements), parseInt(board_size), this.select_birth_rules(birth_rules));
        this.new_game();
    }

    cell_clicked(row: number, col: number) {
        console.log(`Clicked ${row} : ${col}`);

        if (this.game.can_place_at_xy(row, col)) {
            this.game.place_at_xy(row, col);
            const current_player = this.game.get_current_player();
            this.change_color_at_xy(row, col, `selected_player_${current_player}`);
            this.set_current_placements_left();
            this.set_current_score();
            document.getElementById("pass_player_button").classList.add("green_animate");
        }
        else if (this.game.can_undo_at_xy(row, col)) {
            this.game.undo_at_xy(row, col);
            this.change_color_at_xy(row, col, '');
            this.set_current_placements_left();
            this.set_current_score();
        }
    }

    change_color_at_xy(row: number, col: number, css_class: string) {
        const cell = document.getElementById(`${row}-${col}`);
        cell.classList.remove("active_player_0");
        cell.classList.remove("active_player_1");
        cell.classList.remove("selected_player_0");
        cell.classList.remove("selected_player_1");
        
        if (css_class) {
            cell.classList.add(css_class);      
        }
    }

    fix_selections() {
        const current_player = this.game.get_current_player();
        const placement_list = this.game.undo_list;

        placement_list.forEach(([row, col]) => {
            this.change_color_at_xy(row, col, `active_player_${current_player}`);
        });        
    }

    change_colors_many(diff: CellDelta[]) {
        for (let row = 0; row < this.board_size; row++) {
            for (let col = 0; col < this.board_size; col++) {
                const delta = diff[row*this.board_size + col];
                if (delta == CellDelta.NoChange) {
                    continue;
                }

                this.change_color_at_xy(row, col, delta == CellDelta.Die ? null : delta == CellDelta.SpawnPlayer0 ? "active_player_0" : "active_player_1")
            }
        }
    }

    async pass_player() {
        document.getElementById("pass_player_button").classList.remove("green_animate");

        this.fix_selections();
        this.game.pass_player();
        this.set_current_player_title();

        if (this.game.get_game_state() == GameState.Run) {
            document.getElementById("pass_player_button").setAttribute("disabled", "disabled");
            document.getElementById("random_place_button").setAttribute("disabled", "disabled");
            this.run_game();
        }
        else if (this.game.get_game_state() == GameState.End) {
            this.end_game();
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
            document.getElementById("random_place_button").removeAttribute("disabled");
            this.set_current_player_title();
            this.set_current_placements_left()
        }
        else if (this.game.get_game_state() == GameState.End) {
            this.end_game();
        }
    }

    end_game() {
        document.getElementById("pass_player_button").style.display = "none";
        document.getElementById("random_place_div").style.display = "none";
        document.getElementById("new_game_button").style.display = "inline-block";

        const score = this.game.score;
        const placements_left = this.game.get_placements_left()

        const win_div = document.getElementById("winner");
        if (score[0] > score[1]) {
            win_div.innerHTML = "Red Wins!";
            win_div.classList.add("player_0");
        } 
        else if (score[1] > score[0]) {
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

        if (this.game.has_placement_limit) {
            const left_to_place_this_round = this.game.left_to_place_this_round;
            document.getElementById(`player_0_placements`).innerHTML += ` (${left_to_place_this_round[0].toString()})`;
            document.getElementById(`player_1_placements`).innerHTML += ` (${left_to_place_this_round[1].toString()})`;
        }

    }

    set_current_score() {
        const score = this.game.calculate_score();
        document.getElementById(`player_0_score`).innerHTML = score[0].toString();
        document.getElementById(`player_1_score`).innerHTML = score[1].toString();
    }

    random_placement() {
        let number_to_place =  parseInt((<HTMLInputElement>document.getElementById("random_place_input")).value);
        const max_can_place = this.game.get_placements_left_for_current_player();

        if (number_to_place > max_can_place) {
            number_to_place = max_can_place;
        }

        while (number_to_place > 0) {
            const x = Math.floor(Math.random() * 1000) % this.board_size;
            const y = Math.floor(Math.random() * 1000) % this.board_size;

            if (this.game.can_place_at_xy(x, y)) {
                this.cell_clicked(x, y);
                number_to_place--;
            }
        }
    }
}
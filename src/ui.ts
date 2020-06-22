import { Game, GameState, CellDelta, BirthRules } from './game'
import { Replay, ReplayStep, ReplayStepType } from './replay'

export class UI {

    game: Game;
    board_size: number;
    
    constructor(game: Game) {
        this.game = game
        this.draw_replay_box();
    }

    new_game() {
        this.game.init_game();

        this.board_size = this.game.get_board_size();

        this.set_current_player_title(this.game.get_current_player());
        this.set_current_placements_left(this.game.get_placements_left(), this.game.has_placement_limit, this.game.left_to_place_this_round);
        this.set_current_score(this.game.calculate_score());

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
        pass_btn.style.display = 'block';
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


        const replay_toggle = document.getElementById("replay_toggle");
        replay_toggle.onclick = () => {
            const configuration = document.getElementById('replay');
            if (configuration.style.display == "none") {
                configuration.style.display = "block";
            }
            else {
                configuration.style.display = "none";
            }
        };

        const run_replay = document.getElementById("run_replay");
        run_replay.onclick = () => this.load_and_run_replay();

        const save_replay = document.getElementById("save_replay_button");
        save_replay.onclick = () => this.save_replay();
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
            this.set_current_placements_left(this.game.get_placements_left(), this.game.has_placement_limit, this.game.left_to_place_this_round);
            this.set_current_score(this.game.calculate_score());
            document.getElementById("pass_player_button").classList.add("green_animate");
        }
        else if (this.game.can_undo_at_xy(row, col)) {
            this.game.undo_at_xy(row, col);
            this.change_color_at_xy(row, col, '');
            this.set_current_placements_left(this.game.get_placements_left(), this.game.has_placement_limit, this.game.left_to_place_this_round);
            this.set_current_score(this.game.calculate_score());
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

    change_colors_many(diff: CellDelta[], pattern: string = `active_player`) {
        for (let row = 0; row < this.board_size; row++) {
            for (let col = 0; col < this.board_size; col++) {
                const delta = diff[row*this.board_size + col];
                if (delta == CellDelta.NoChange) {
                    continue;
                }

                this.change_color_at_xy(row, col, delta == CellDelta.Die ? null : delta == CellDelta.SpawnPlayer0 ? `${pattern}_0` : `${pattern}_1`)
            }
        }
    }

    async pass_player() {
        document.getElementById("pass_player_button").classList.remove("green_animate");

        this.fix_selections();
        this.game.pass_player();
        this.set_current_player_title(this.game.get_current_player());

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
            this.set_current_score(this.game.calculate_score());
            await this.sleep(500)
        }

        console.log(`Ending game loop`)

        if (this.game.get_game_state() == GameState.Place) {
            document.getElementById("pass_player_button").removeAttribute("disabled");
            document.getElementById("random_place_button").removeAttribute("disabled");
            this.set_current_player_title(this.game.get_current_player());
            this.set_current_placements_left(this.game.get_placements_left(), this.game.has_placement_limit, this.game.left_to_place_this_round);
        }
        else if (this.game.get_game_state() == GameState.End) {
            this.end_game();
        }
    }    

    end_game() {
        document.getElementById("pass_player_button").style.display = "none";
        document.getElementById("random_place_div").style.display = "none";
        document.getElementById("new_game_button").style.display = "block";
        document.getElementById("save_replay_button").style.display = "block";

        const score = this.game.score;
        const placements_left = this.game.get_placements_left()

        this.set_winner(score);
    }

    set_current_player_title(current_player: number) {
        const current_player_title = document.getElementById(`current_player`);
        current_player_title.innerHTML = current_player == 0 ? 'Red' : 'Blue'
        current_player_title.classList.remove('player_0')
        current_player_title.classList.remove('player_1')
        current_player_title.classList.add(`player_${current_player}`)
    }

    set_current_placements_left(placements_left: number[], has_placement_limit: boolean, left_to_place_this_round: number[] ) {
        document.getElementById(`player_0_placements`).innerHTML = placements_left[0].toString();
        document.getElementById(`player_1_placements`).innerHTML = placements_left[1].toString();

        if (has_placement_limit) {
            document.getElementById(`player_0_placements`).innerHTML += ` (${left_to_place_this_round[0].toString()})`;
            document.getElementById(`player_1_placements`).innerHTML += ` (${left_to_place_this_round[1].toString()})`;
        }

    }

    set_current_score(score: number[]) {        
        document.getElementById(`player_0_score`).innerHTML = score[0].toString();
        document.getElementById(`player_1_score`).innerHTML = score[1].toString();
    }

    set_winner(score: number[]) {
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

    async load_and_run_replay() {
        const selected_replay = (<HTMLSelectElement> document.getElementById('replays_avaliable')).value;
        const replay_str = localStorage.getItem(selected_replay);
        if (replay_str) {
            await this.run_replay(JSON.parse(replay_str));
        }
    }

    fix_placement_to_active() {
        for (let player = 0; player < 2; player ++) {
            const elements = document.getElementsByClassName(`selected_player_${player}`);

            while (elements.length) {
                elements[0].classList.add(`active_player_${player}`)
                elements[0].classList.remove(`selected_player_${player}`);
            }
        }        
    }

    async run_replay(replay: Replay) {
        this.game.set_config(replay.max_first_player_placements, replay.max_second_player_placements, replay.max_round_placements,
            replay.board_size, replay.birth_rules);
        
        this.game.init_game();
        this.game.go_to_replay();

        this.board_size = this.game.get_board_size();

        this.set_current_score(this.game.calculate_score());

        this.create_board();

        document.getElementById("pass_player_button").style.display = "none";
        document.getElementById("random_place_div").style.display = "none";

        const win_div = document.getElementById("winner");
        win_div.innerHTML = '';
        win_div.classList.remove('player_0');
        win_div.classList.remove('player_1');
        win_div.parentElement.style.display = "none";

        for (let index in replay.replay_steps) {
            const replay_step:ReplayStep = replay.replay_steps[index];

            if (replay_step.replay_step_type !== ReplayStepType.End) {
                console.log(`Running replay`)
                this.set_current_placements_left(replay_step.left_to_place, replay.has_placement_limit, replay_step.left_to_place_this_round);
                this.set_current_player_title(replay_step.current_player);
                const board_delta = replay_step.board_delta;
                if (replay_step.replay_step_type == ReplayStepType.Run) {
                    this.change_colors_many(board_delta);
                    this.set_current_score(replay_step.score);
                    await this.sleep(500)
                }
                else if (replay_step.replay_step_type == ReplayStepType.Placement) {
                    // Show selection color
                    this.change_colors_many(board_delta, `selected_player`);
                    this.set_current_score(replay_step.score);
                    await this.sleep(300)
                    // Fix selection colors to normal
                    this.fix_placement_to_active();
                    await this.sleep(250)
                }
               
            }
            else {
                this.set_winner(replay_step.score);
            }
        }

        document.getElementById("new_game_button").style.display = "block";
    }

    get_max_replay_number() {
        let last_replay_number = 0;
        let last_replay_str = localStorage.getItem('last_replay_number');

        if (last_replay_str) {
            last_replay_number = parseInt(last_replay_str);
        }

        return last_replay_number;
    }

    save_replay() {
        const next_replay_number = this.get_max_replay_number() + 1;
        localStorage.setItem('last_replay_number', next_replay_number.toString());
        localStorage.setItem(`replay_${next_replay_number}`, JSON.stringify(this.game.replay));

        document.getElementById("save_replay_button").style.display = "none";
        
        this.draw_replay_box();
    }

    draw_replay_box() {
        const max_replay_number = this.get_max_replay_number();


        const select_box = <HTMLSelectElement>document.getElementById('replays_avaliable');

        while (select_box.options.length > 0) { select_box.options.remove(0); }

        for (let i = 1; i <= max_replay_number; i++) {
            const replay_json = localStorage.getItem(`replay_${i}`);
            if (replay_json) {
                const replay = <Replay>JSON.parse(replay_json);
                const score = replay.replay_steps.find(step => step.replay_step_type == ReplayStepType.End).score;
                const new_replay_option = new Option(`#${i}, Red: ${score[0]}, Blue: ${score[1]}`, `replay_${i}`);               
                select_box.add(new_replay_option);
            }
        }
    }
}
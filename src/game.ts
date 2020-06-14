
import { BOARD_SIZE, Cell, Board } from './board'

export enum CellDelta {
    NoChange,
    Die,
    SpawnPlayer0,
    SpawnPlayer1
}

export enum GameState {
    InActive,
    Place,
    Run,
    End
}

interface SavedGameState {
    board: Cell[];
    score: number[];
}

export class Game {
    board: Board;
    old_states: Array<SavedGameState>;

    current_player = 0;
    left_to_place = [0,0];
    score = [0,0];

    game_state: GameState = GameState.InActive;
    
    prev_player_placed: boolean = true;
    current_player_placed: boolean = false;

    constructor(board: Board) {
        this.board = board;
        this.init_game();
    }

    init_game() {
        // Reset play area and history
        this.board.reset_play_area();
        this.old_states = [];
        this.left_to_place = [20, 20];
        this.score = [0,0];
        // Choose startring player at random
        this.current_player = Math.random() > 0.5 ? 0 : 1;
        // Other player gets another placement
        this.left_to_place[1 - this.current_player] += 1;

        this.go_to_placement();
    }

    get_current_player() : number {
        return this.current_player
    }

    get_placements_left() : Array<number> {
        return this.left_to_place;
    }

    get_game_state() {
        return this.game_state
    }

    game_step() {
        let board_delta = this.get_board_delta();
        let old_state = <Cell[]>Object.assign([], this.board.play_area);
        let old_score = <number[]>Object.assign([], this.score);
        this.old_states.push({board: old_state, score: old_score});

        board_delta.forEach((new_state, idx) => {
            switch (new_state) {
                case CellDelta.NoChange: break;
                case CellDelta.Die: this.board.set_cell(idx, Cell.Dead, false); break;
                case CellDelta.SpawnPlayer0: this.board.set_cell(idx, Cell.AlivePlayer0, true); break;
                case CellDelta.SpawnPlayer1: this.board.set_cell(idx, Cell.AlivePlayer1, true); break;
            }
        })

        this.calculate_score();

        console.log(`Comparing states`)

        // If board is empty and one player can't place, end game
        if ((this.left_to_place[0] == 0 && this.score[0] == 0) || (this.left_to_place[1] == 0 && this.score[1] == 0))
        {
            this.go_to_end_game();
        }

        // Pause game if board has only one color or is in a loop
        if (this.score[0] == 0 || this.score[1] == 0 || this.check_for_repeating_game_state()) {
            console.log(`Match found`)
            this.go_to_placement();
            if (this.left_to_place[0] > this.left_to_place[1]) {
                this.current_player = 0
            }
            else if (this.left_to_place[1] > this.left_to_place[0]) {
                this.current_player = 1
            }
            else {
                this.current_player = 1 - this.current_player
            }
        }       

        return board_delta;
    }

    compare_states(state1: SavedGameState, state2: SavedGameState) : boolean {
        if (state1.score[0] != state2.score[0] || state1.score[1] != state2.score[1]) {
            return false;
        }
        
        for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
            if (state1.board[i] != state2.board[i]) { 
                return false;
            }
        }

        return true;
    }

    check_for_repeating_game_state() {
        const current_game_state = { board: this.board.play_area, score: this.score }
        return this.old_states.some(old_state => this.compare_states(current_game_state, old_state))
    }

    get_cell_delta(row:number, col:number): CellDelta {
        let neighborhood = this.board.get_neighborhood(row, col);
        let current_cell_alive = this.board.get_cell_xy(row, col) != Cell.Dead

        switch (neighborhood.total) {
            case 2: return CellDelta.NoChange;
            case 3: return current_cell_alive ? 
                        CellDelta.NoChange : 
                        neighborhood.alive_player_1_count > neighborhood.alive_player_2_count ?
                        CellDelta.SpawnPlayer0 : CellDelta.SpawnPlayer1

            default:  return current_cell_alive ? CellDelta.Die : CellDelta.NoChange;
        }
    }

    get_board_delta() : CellDelta[] {
        let play_area_delta = new Array<CellDelta>();
        for (let c_row = 0; c_row < BOARD_SIZE; c_row++) {
            for (let c_col = 0; c_col < BOARD_SIZE; c_col++) {
                play_area_delta.push(this.get_cell_delta(c_row, c_col))            
            }
        }

        return play_area_delta;
    }

    go_to_placement() {
        console.log(`State = placement`);

        if (this.left_to_place[0] == 0 && this.left_to_place[1] == 0) {
            this.go_to_end_game();
        }
        else {
            this.game_state = GameState.Place;
            this.prev_player_placed = true;
            this.current_player_placed = false;    
        }
    }

    go_to_run() {
        console.log(`State = run`);
        this.game_state = GameState.Run;
    }

    go_to_end_game() {
        console.log(`State = end`);
        this.game_state = GameState.End;
    }

    can_place_at_xy(row:number, col:number): boolean {
        return this.game_state == GameState.Place && this.board.get_cell_xy(row, col) == Cell.Dead && this.left_to_place[this.current_player] > 0;
    }

    place_at_xy(row:number, col:number) {        
        this.left_to_place[this.current_player] -= 1;
        this.current_player_placed = true;
        this.board.set_cell_xy(row, col, this.current_player == 0 ? Cell.AlivePlayer0 : Cell.AlivePlayer1)
    }
    
    pass_player() {
        if (!this.current_player_placed && !this.prev_player_placed) {
            this.go_to_run();
        }

        this.prev_player_placed = this.current_player_placed;
        this.current_player = 1-this.current_player;
        this.current_player_placed = false;

        if (this.left_to_place[this.current_player] == 0) {
            this.go_to_run();
        }
    }

    calculate_score(): Array<number> {
        let score = [0, 0];
        for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
            if (this.board.play_area[i] == Cell.AlivePlayer0) {
                score[0]++
            }
            else if (this.board.play_area[i] == Cell.AlivePlayer1) {
                score[1]++
            }
        }

        this.score = score;

        return score;
    }
}
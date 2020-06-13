
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    var Cell;
    (function (Cell) {
        Cell[Cell["Dead"] = 0] = "Dead";
        Cell[Cell["AlivePlayer0"] = 1] = "AlivePlayer0";
        Cell[Cell["AlivePlayer1"] = 2] = "AlivePlayer1";
    })(Cell || (Cell = {}));
    const BOARD_SIZE = 10;
    class GetNeighborhoodResult {
        constructor(alive_player_1_count = 0, alive_player_2_count = 0) {
            this.alive_player_1_count = alive_player_1_count;
            this.alive_player_2_count = alive_player_2_count;
        }
        get total() { return this.alive_player_1_count + this.alive_player_2_count; }
    }
    class Board {
        constructor() {
            this.reset_play_area();
        }
        reset_play_area() {
            this.play_area = new Array(BOARD_SIZE * BOARD_SIZE);
            this.play_area.fill(Cell.Dead);
        }
        get_cell_xy(row, col) {
            return this.play_area[row * BOARD_SIZE + col];
        }
        set_cell(cell_number, new_state, allow_override = false) {
            if (new_state == Cell.Dead && this.play_area[cell_number] == Cell.Dead) {
                throw new Error(`Cannot kill a dead cell ${cell_number} = ${Math.floor(cell_number / BOARD_SIZE)} : ${cell_number % BOARD_SIZE}`);
            }
            else if ((new_state == Cell.AlivePlayer0 || new_state == Cell.AlivePlayer1) && this.play_area[cell_number] != Cell.Dead && !allow_override) {
                throw new Error(`Cannot spawn on occupied cell ${Math.floor(cell_number / BOARD_SIZE)} : ${cell_number % BOARD_SIZE}`);
            }
            this.play_area[cell_number] = new_state;
        }
        set_cell_xy(row, col, new_state) {
            let cell_number = row * BOARD_SIZE + col;
            this.set_cell(cell_number, new_state, false);
        }
        get_neighborhood(row, col) {
            let alive_player_1_count = 0;
            let alive_player_2_count = 0;
            for (let row_delta = -1; row_delta < 2; row_delta++) {
                let c_row = row + row_delta;
                if (c_row < 0 || c_row >= BOARD_SIZE) {
                    continue;
                }
                for (let col_delta = -1; col_delta < 2; col_delta++) {
                    if (row_delta == 0 && col_delta == 0) {
                        continue;
                    }
                    let c_col = col + col_delta;
                    if (c_col < 0 || c_col >= BOARD_SIZE) {
                        continue;
                    }
                    switch (this.play_area[c_row * BOARD_SIZE + c_col]) {
                        case Cell.Dead: /* do nothing */
                            break;
                        case Cell.AlivePlayer0:
                            alive_player_1_count++;
                            break;
                        case Cell.AlivePlayer1:
                            alive_player_2_count++;
                            break;
                    }
                }
            }
            return new GetNeighborhoodResult(alive_player_1_count, alive_player_2_count);
        }
    }
    //# sourceMappingURL=board.js.map

    var CellDelta;
    (function (CellDelta) {
        CellDelta[CellDelta["NoChange"] = 0] = "NoChange";
        CellDelta[CellDelta["Die"] = 1] = "Die";
        CellDelta[CellDelta["SpawnPlayer0"] = 2] = "SpawnPlayer0";
        CellDelta[CellDelta["SpawnPlayer1"] = 3] = "SpawnPlayer1";
    })(CellDelta || (CellDelta = {}));
    var GameState;
    (function (GameState) {
        GameState[GameState["InActive"] = 0] = "InActive";
        GameState[GameState["Place"] = 1] = "Place";
        GameState[GameState["Run"] = 2] = "Run";
        GameState[GameState["End"] = 3] = "End";
    })(GameState || (GameState = {}));
    class Game {
        constructor(board) {
            this.current_player = 0;
            this.left_to_place = [0, 0];
            this.score = [0, 0];
            this.game_state = GameState.InActive;
            this.prev_player_placed = true;
            this.current_player_placed = false;
            this.board = board;
            this.init_game();
        }
        init_game() {
            // Reset play area and history
            this.board.reset_play_area();
            this.old_states = [];
            this.left_to_place = [20, 20];
            this.score = [0, 0];
            // Choose startring player at random
            this.current_player = Math.random() > 0.5 ? 0 : 1;
            // Other player gets another placement
            this.left_to_place[1 - this.current_player] += 1;
            this.go_to_placement();
        }
        get_current_player() {
            return this.current_player;
        }
        get_placements_left() {
            return this.left_to_place;
        }
        get_game_state() {
            return this.game_state;
        }
        game_step() {
            let board_delta = this.get_board_delta();
            let old_state = Object.assign([], this.board.play_area);
            let old_score = Object.assign([], this.score);
            this.old_states.push({ board: old_state, score: old_score });
            board_delta.forEach((new_state, idx) => {
                switch (new_state) {
                    case CellDelta.NoChange: break;
                    case CellDelta.Die:
                        this.board.set_cell(idx, Cell.Dead, false);
                        break;
                    case CellDelta.SpawnPlayer0:
                        this.board.set_cell(idx, Cell.AlivePlayer0, true);
                        break;
                    case CellDelta.SpawnPlayer1:
                        this.board.set_cell(idx, Cell.AlivePlayer1, true);
                        break;
                }
            });
            this.calculate_score();
            console.log(`Comparing states`);
            if ((this.left_to_place[0] == 0 && this.score[0] == 0) || (this.left_to_place[1] == 0 && this.score[1] == 0)) {
                this.go_to_end_game();
            }
            if (this.check_for_repeating_game_state()) {
                console.log(`Match found`);
                this.go_to_placement();
                if (this.left_to_place[0] > this.left_to_place[1]) {
                    this.current_player = 0;
                }
                else if (this.left_to_place[1] > this.left_to_place[0]) {
                    this.current_player = 1;
                }
                else {
                    this.current_player = 1 - this.current_player;
                }
            }
            return board_delta;
        }
        compare_states(state1, state2) {
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
            const current_game_state = { board: this.board.play_area, score: this.score };
            return this.old_states.some(old_state => this.compare_states(current_game_state, old_state));
        }
        get_cell_delta(row, col) {
            let neighborhood = this.board.get_neighborhood(row, col);
            let current_cell_alive = this.board.get_cell_xy(row, col) != Cell.Dead;
            switch (neighborhood.total) {
                case 2: return CellDelta.NoChange;
                case 3: return current_cell_alive ?
                    CellDelta.NoChange :
                    neighborhood.alive_player_1_count > neighborhood.alive_player_2_count ?
                        CellDelta.SpawnPlayer0 : CellDelta.SpawnPlayer1;
                default: return current_cell_alive ? CellDelta.Die : CellDelta.NoChange;
            }
        }
        get_board_delta() {
            let play_area_delta = new Array();
            for (let c_row = 0; c_row < BOARD_SIZE; c_row++) {
                for (let c_col = 0; c_col < BOARD_SIZE; c_col++) {
                    play_area_delta.push(this.get_cell_delta(c_row, c_col));
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
        can_place_at_xy(row, col) {
            return this.game_state == GameState.Place && this.board.get_cell_xy(row, col) == Cell.Dead && this.left_to_place[this.current_player] > 0;
        }
        place_at_xy(row, col) {
            this.left_to_place[this.current_player] -= 1;
            this.current_player_placed = true;
            this.board.set_cell_xy(row, col, this.current_player == 0 ? Cell.AlivePlayer0 : Cell.AlivePlayer1);
        }
        pass_player() {
            if (!this.current_player_placed && !this.prev_player_placed) {
                this.go_to_run();
            }
            this.prev_player_placed = this.current_player_placed;
            this.current_player = 1 - this.current_player;
            this.current_player_placed = false;
            if (this.left_to_place[this.current_player] == 0) {
                this.go_to_run();
            }
        }
        calculate_score() {
            let score = [0, 0];
            for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
                if (this.board.play_area[i] == Cell.AlivePlayer0) {
                    score[0]++;
                }
                else if (this.board.play_area[i] == Cell.AlivePlayer1) {
                    score[1]++;
                }
            }
            this.score = score;
            return score;
        }
    }
    //# sourceMappingURL=game.js.map

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class UI {
        constructor(game) {
            this.game = game;
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
            const board = document.getElementById("playboard");
            board.innerHTML = '';
            for (let row = 0; row < BOARD_SIZE; row++) {
                const dom_row = document.createElement("div");
                dom_row.style.display = "flex";
                dom_row.style.flexDirection = "row";
                for (let col = 0; col < BOARD_SIZE; col++) {
                    const dom_col = document.createElement("div");
                    dom_col.className = "board_cell";
                    dom_col.id = `${row}-${col}`;
                    dom_col.onclick = () => this.cell_clicked(row, col);
                    dom_row.appendChild(dom_col);
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
        cell_clicked(row, col) {
            console.log(`Clicked ${row} : ${col}`);
            if (this.game.can_place_at_xy(row, col)) {
                this.game.place_at_xy(row, col);
                const current_player = this.game.get_current_player();
                this.change_color_at_xy(row, col, `active_player_${current_player}`);
                this.set_current_placements_left();
                this.set_current_score();
            }
        }
        change_color_at_xy(row, col, css_class) {
            const cell = document.getElementById(`${row}-${col}`);
            cell.classList.remove("active_player_0");
            cell.classList.remove("active_player_1");
            if (css_class) {
                cell.classList.add(css_class);
            }
        }
        change_colors_many(diff) {
            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    const delta = diff[row * BOARD_SIZE + col];
                    if (delta == CellDelta.NoChange) {
                        continue;
                    }
                    this.change_color_at_xy(row, col, delta == CellDelta.Die ? null : delta == CellDelta.SpawnPlayer0 ? "active_player_0" : "active_player_1");
                }
            }
        }
        pass_player() {
            return __awaiter(this, void 0, void 0, function* () {
                this.game.pass_player();
                this.set_current_player_title();
                if (this.game.get_game_state() == GameState.Run) {
                    document.getElementById("pass_player_button").setAttribute("disabled", "disabled");
                    this.run_game();
                }
            });
        }
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        run_game() {
            return __awaiter(this, void 0, void 0, function* () {
                while (this.game.get_game_state() == GameState.Run) {
                    console.log(`Running game loop`);
                    const board_delta = this.game.game_step();
                    this.change_colors_many(board_delta);
                    this.set_current_score();
                    yield this.sleep(500);
                }
                console.log(`Ending game loop`);
                if (this.game.get_game_state() == GameState.Place) {
                    document.getElementById("pass_player_button").removeAttribute("disabled");
                    this.set_current_player_title();
                }
                else if (this.game.get_game_state() == GameState.End) {
                    this.end_game();
                }
            });
        }
        end_game() {
            document.getElementById("pass_player_button").style.display = "none";
            document.getElementById("new_game_button").style.display = "inline-block";
            const score = this.game.score;
            const placements_left = this.game.get_placements_left();
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
            current_player_title.innerHTML = current_player == 0 ? 'Red' : 'Blue';
            current_player_title.classList.remove('player_0');
            current_player_title.classList.remove('player_1');
            current_player_title.classList.add(`player_${current_player}`);
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
    //# sourceMappingURL=ui.js.map

    const board = new Board();
    const game = new Game(board);
    const ui = new UI(game);
    ui.new_game();
    //# sourceMappingURL=index.js.map

}));
//# sourceMappingURL=bundle.js.map

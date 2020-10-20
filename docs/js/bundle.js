(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var Cell;
    (function (Cell) {
        Cell[Cell["Dead"] = 0] = "Dead";
        Cell[Cell["AlivePlayer0"] = 1] = "AlivePlayer0";
        Cell[Cell["AlivePlayer1"] = 2] = "AlivePlayer1";
    })(Cell || (Cell = {}));
    var GetNeighborhoodResult = /** @class */ (function () {
        function GetNeighborhoodResult(alive_player_1_count, alive_player_2_count) {
            if (alive_player_1_count === void 0) { alive_player_1_count = 0; }
            if (alive_player_2_count === void 0) { alive_player_2_count = 0; }
            this.alive_player_1_count = alive_player_1_count;
            this.alive_player_2_count = alive_player_2_count;
        }
        Object.defineProperty(GetNeighborhoodResult.prototype, "total", {
            get: function () { return this.alive_player_1_count + this.alive_player_2_count; },
            enumerable: false,
            configurable: true
        });
        return GetNeighborhoodResult;
    }());
    var Board = /** @class */ (function () {
        function Board(board_size) {
            if (board_size === void 0) { board_size = 10; }
            this.board_size = board_size;
            this.reset_play_area();
        }
        Board.prototype.reset_play_area = function () {
            this.play_area = new Array(this.board_size * this.board_size);
            //this.play_area.fill(Cell.Dead);
            for (var i = 0; i < this.board_size * this.board_size; i++) {
                this.play_area[i] = Cell.Dead;
            }
        };
        Board.prototype.get_cell_xy = function (row, col) {
            return this.play_area[row * this.board_size + col];
        };
        Board.prototype.set_cell = function (cell_number, new_state, allow_override) {
            if (allow_override === void 0) { allow_override = false; }
            if (new_state == Cell.Dead && this.play_area[cell_number] == Cell.Dead) {
                throw new Error("Cannot kill a dead cell " + cell_number + " = " + Math.floor(cell_number / this.board_size) + " : " + cell_number % this.board_size);
            }
            else if ((new_state == Cell.AlivePlayer0 || new_state == Cell.AlivePlayer1) && this.play_area[cell_number] != Cell.Dead && !allow_override) {
                throw new Error("Cannot spawn on occupied cell " + Math.floor(cell_number / this.board_size) + " : " + cell_number % this.board_size);
            }
            this.play_area[cell_number] = new_state;
        };
        Board.prototype.set_cell_xy = function (row, col, new_state) {
            var cell_number = row * this.board_size + col;
            this.set_cell(cell_number, new_state, false);
        };
        Board.prototype.get_neighborhood = function (row, col) {
            var alive_player_1_count = 0;
            var alive_player_2_count = 0;
            for (var row_delta = -1; row_delta < 2; row_delta++) {
                var c_row = row + row_delta;
                if (c_row < 0 || c_row >= this.board_size) {
                    continue;
                }
                for (var col_delta = -1; col_delta < 2; col_delta++) {
                    if (row_delta == 0 && col_delta == 0) {
                        continue;
                    }
                    var c_col = col + col_delta;
                    if (c_col < 0 || c_col >= this.board_size) {
                        continue;
                    }
                    switch (this.play_area[c_row * this.board_size + c_col]) {
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
        };
        return Board;
    }());

    var Replay = /** @class */ (function () {
        function Replay(max_first_player_placements, max_second_player_placements, has_placement_limit, max_round_placements, board_size, birth_rules) {
            this.max_first_player_placements = max_first_player_placements;
            this.max_second_player_placements = max_second_player_placements;
            this.has_placement_limit = has_placement_limit;
            this.max_round_placements = max_round_placements;
            this.board_size = board_size;
            this.birth_rules = birth_rules;
            this.replay_steps = [];
        }
        return Replay;
    }());
    var ReplayStepType;
    (function (ReplayStepType) {
        ReplayStepType[ReplayStepType["Placement"] = 0] = "Placement";
        ReplayStepType[ReplayStepType["Run"] = 1] = "Run";
        ReplayStepType[ReplayStepType["End"] = 2] = "End";
    })(ReplayStepType || (ReplayStepType = {}));
    var ReplayStep = /** @class */ (function () {
        function ReplayStep(replay_step_type, board_delta, current_player, left_to_place, score, left_to_place_this_round) {
            this.replay_step_type = replay_step_type;
            this.board_delta = board_delta;
            this.current_player = current_player;
            this.left_to_place = left_to_place;
            this.score = score;
            this.left_to_place_this_round = left_to_place_this_round;
        }
        return ReplayStep;
    }());

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
        GameState[GameState["Replay"] = 4] = "Replay";
    })(GameState || (GameState = {}));
    var BirthRules;
    (function (BirthRules) {
        BirthRules[BirthRules["Normal"] = 0] = "Normal";
        BirthRules[BirthRules["ThreePlusOne"] = 1] = "ThreePlusOne";
        BirthRules[BirthRules["Both"] = 2] = "Both";
        BirthRules[BirthRules["P2Life"] = 3] = "P2Life";
    })(BirthRules || (BirthRules = {}));
    var Game = /** @class */ (function () {
        function Game() {
            this.current_player = 0;
            this.left_to_place = [0, 0];
            this.score = [0, 0];
            this.game_state = GameState.InActive;
            this.prev_player_placed = true;
            this.current_player_placed = false;
            this.has_placement_limit = false;
            this.left_to_place_this_round = [0, 0];
            this.max_first_player_placements = 20;
            this.max_second_player_placements = 21;
            this.max_round_placements = 0;
            this.board_size = 10;
            this.birth_rules = BirthRules.Normal;
            this.get_cell_delta = this.get_cell_delta_normal;
            this.board = new Board(this.board_size);
            this.init_game();
        }
        Game.prototype.set_config = function (max_first_player_placements, max_second_player_placements, max_round_placements, board_size, birth_rules) {
            this.max_first_player_placements = max_first_player_placements;
            this.max_second_player_placements = max_second_player_placements;
            this.max_round_placements = max_round_placements;
            this.has_placement_limit = this.max_round_placements > 0;
            this.board_size = board_size;
            this.board = new Board(board_size);
            this.birth_rules = birth_rules;
            if (birth_rules == BirthRules.Normal) {
                this.get_cell_delta = this.get_cell_delta_normal;
            }
            else if (birth_rules == BirthRules.ThreePlusOne) {
                this.get_cell_delta = this.get_cell_delta_threeplusone;
            }
            else if (birth_rules == BirthRules.Both) {
                this.get_cell_delta = this.get_cell_delta_both;
            }
            else if (birth_rules == BirthRules.P2Life) {
                this.get_cell_delta = this.get_cell_delta_p2life;
            }
        };
        Game.prototype.init_game = function () {
            // Reset play area and history
            this.board.reset_play_area();
            this.old_states = [];
            this.left_to_place = [this.max_first_player_placements, this.max_first_player_placements];
            this.score = [0, 0];
            // Choose startring player at random
            this.current_player = Math.random() > 0.5 ? 0 : 1;
            // Other player gets another placement
            this.left_to_place[1 - this.current_player] = this.max_second_player_placements;
            this.replay = new Replay(this.max_first_player_placements, this.max_second_player_placements, this.has_placement_limit, this.max_round_placements, this.board_size, this.birth_rules);
            this.go_to_placement();
        };
        Game.prototype.get_board_size = function () {
            return this.board_size;
        };
        Game.prototype.get_current_player = function () {
            return this.current_player;
        };
        Game.prototype.get_placements_left = function () {
            return this.left_to_place;
        };
        Game.prototype.get_game_state = function () {
            return this.game_state;
        };
        Game.prototype.get_placements_left_for_current_player = function () {
            var placements_left = this.left_to_place[this.current_player];
            if (this.has_placement_limit && this.left_to_place_this_round[this.current_player] < this.left_to_place[this.current_player]) {
                placements_left = this.left_to_place_this_round[this.current_player];
            }
            return placements_left;
        };
        Game.prototype.game_step = function () {
            var _this = this;
            var board_delta = this.get_board_delta();
            var old_state = Object.assign([], this.board.play_area);
            var old_score = Object.assign([], this.score);
            this.old_states.push({ board: old_state, score: old_score });
            board_delta.forEach(function (new_state, idx) {
                switch (new_state) {
                    case CellDelta.NoChange: break;
                    case CellDelta.Die:
                        _this.board.set_cell(idx, Cell.Dead, false);
                        break;
                    case CellDelta.SpawnPlayer0:
                        _this.board.set_cell(idx, Cell.AlivePlayer0, true);
                        break;
                    case CellDelta.SpawnPlayer1:
                        _this.board.set_cell(idx, Cell.AlivePlayer1, true);
                        break;
                }
            });
            this.calculate_score();
            this.replay.replay_steps.push(new ReplayStep(ReplayStepType.Run, board_delta, this.current_player, __spreadArrays(this.left_to_place), __spreadArrays(this.score), __spreadArrays(this.left_to_place_this_round)));
            console.log("Comparing states");
            // If board is empty and one player can't place, end game
            if ((this.left_to_place[0] == 0 && this.score[0] == 0) || (this.left_to_place[1] == 0 && this.score[1] == 0)) {
                this.go_to_end_game();
            }
            // Pause game if board has only one color or is in a loop
            if (this.score[0] == 0 || this.score[1] == 0 || this.check_for_repeating_game_state()) {
                console.log("Match found");
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
        };
        Game.prototype.compare_states = function (state1, state2) {
            if (state1.score[0] != state2.score[0] || state1.score[1] != state2.score[1]) {
                return false;
            }
            for (var i = 0; i < this.board_size * this.board_size; i++) {
                if (state1.board[i] != state2.board[i]) {
                    return false;
                }
            }
            return true;
        };
        Game.prototype.check_for_repeating_game_state = function () {
            var _this = this;
            var current_game_state = { board: this.board.play_area, score: this.score };
            return this.old_states.some(function (old_state) { return _this.compare_states(current_game_state, old_state); });
        };
        Game.prototype.get_cell_delta_normal = function (row, col) {
            var neighborhood = this.board.get_neighborhood(row, col);
            var current_cell_alive = this.board.get_cell_xy(row, col) != Cell.Dead;
            switch (neighborhood.total) {
                case 2: return CellDelta.NoChange;
                case 3: return current_cell_alive ?
                    CellDelta.NoChange :
                    neighborhood.alive_player_1_count > neighborhood.alive_player_2_count ?
                        CellDelta.SpawnPlayer0 : CellDelta.SpawnPlayer1;
                default: return current_cell_alive ? CellDelta.Die : CellDelta.NoChange;
            }
        };
        Game.prototype.get_cell_delta_threeplusone = function (row, col) {
            var neighborhood = this.board.get_neighborhood(row, col);
            var current_cell_alive = this.board.get_cell_xy(row, col) != Cell.Dead;
            switch (neighborhood.total) {
                case 2: return CellDelta.NoChange;
                case 3: return CellDelta.NoChange;
                case 4: return current_cell_alive || neighborhood.alive_player_1_count == 0 || neighborhood.alive_player_2_count == 0 ?
                    CellDelta.NoChange :
                    neighborhood.alive_player_1_count > neighborhood.alive_player_2_count ? CellDelta.SpawnPlayer0 :
                        neighborhood.alive_player_1_count < neighborhood.alive_player_2_count ? CellDelta.SpawnPlayer1 :
                            CellDelta.NoChange;
                default: return current_cell_alive ? CellDelta.Die : CellDelta.NoChange;
            }
        };
        Game.prototype.get_cell_delta_both = function (row, col) {
            var neighborhood = this.board.get_neighborhood(row, col);
            var current_cell_alive = this.board.get_cell_xy(row, col) != Cell.Dead;
            switch (neighborhood.total) {
                case 2: return CellDelta.NoChange;
                case 3: return current_cell_alive ?
                    CellDelta.NoChange :
                    neighborhood.alive_player_1_count > neighborhood.alive_player_2_count ?
                        CellDelta.SpawnPlayer0 : CellDelta.SpawnPlayer1;
                case 4: return current_cell_alive || neighborhood.alive_player_1_count == 0 || neighborhood.alive_player_2_count == 0 ?
                    CellDelta.NoChange :
                    neighborhood.alive_player_1_count > neighborhood.alive_player_2_count ? CellDelta.SpawnPlayer0 :
                        neighborhood.alive_player_1_count < neighborhood.alive_player_2_count ? CellDelta.SpawnPlayer1 :
                            CellDelta.NoChange;
                default: return current_cell_alive ? CellDelta.Die : CellDelta.NoChange;
            }
        };
        Game.prototype.get_cell_delta_p2life = function (row, col) {
            var neighborhood = this.board.get_neighborhood(row, col);
            var current_cell = this.board.get_cell_xy(row, col);
            var current_cell_alive = current_cell != Cell.Dead;
            if (current_cell_alive) {
                var diff = Math.abs(neighborhood.alive_player_1_count - neighborhood.alive_player_2_count);
                if (diff == 2 || diff == 3) {
                    return CellDelta.NoChange;
                }
                else if (diff == 1) {
                    if ((current_cell == Cell.AlivePlayer0 && neighborhood.alive_player_1_count >= 2) ||
                        (current_cell == Cell.AlivePlayer1 && neighborhood.alive_player_2_count >= 2)) {
                        return CellDelta.NoChange;
                    }
                    else {
                        return CellDelta.Die;
                    }
                }
                else {
                    return CellDelta.Die;
                }
            }
            // Spawn rules
            else {
                if (neighborhood.alive_player_1_count == 3 && neighborhood.alive_player_2_count != 3) {
                    return CellDelta.SpawnPlayer0;
                }
                else if (neighborhood.alive_player_2_count == 3 && neighborhood.alive_player_1_count != 3) {
                    return CellDelta.SpawnPlayer1;
                }
                else if (neighborhood.alive_player_1_count == 3 && neighborhood.alive_player_2_count == 3) {
                    var rand = Math.random();
                    return rand <= 0.5 ? CellDelta.SpawnPlayer0 : CellDelta.SpawnPlayer1;
                }
                else {
                    return CellDelta.NoChange;
                }
            }
        };
        Game.prototype.get_board_delta = function () {
            var play_area_delta = new Array();
            for (var c_row = 0; c_row < this.board_size; c_row++) {
                for (var c_col = 0; c_col < this.board_size; c_col++) {
                    play_area_delta.push(this.get_cell_delta(c_row, c_col));
                }
            }
            return play_area_delta;
        };
        Game.prototype.go_to_placement = function () {
            console.log("State = placement");
            if (this.left_to_place[0] == 0 && this.left_to_place[1] == 0) {
                this.go_to_end_game();
            }
            else {
                this.game_state = GameState.Place;
                this.prev_player_placed = true;
                this.current_player_placed = false;
                this.undo_list = new Array();
                if (this.has_placement_limit) {
                    this.left_to_place_this_round = [this.max_round_placements, this.max_round_placements];
                }
            }
        };
        Game.prototype.go_to_run = function () {
            console.log("State = run");
            this.game_state = GameState.Run;
        };
        Game.prototype.go_to_end_game = function () {
            console.log("State = end");
            this.game_state = GameState.End;
            this.replay.replay_steps.push(new ReplayStep(ReplayStepType.End, null, this.current_player, __spreadArrays(this.left_to_place), __spreadArrays(this.score), __spreadArrays(this.left_to_place_this_round)));
        };
        Game.prototype.go_to_replay = function () {
            console.log("State = replay");
            this.game_state = GameState.Replay;
        };
        Game.prototype.can_place_at_xy = function (row, col) {
            return this.game_state == GameState.Place &&
                this.board.get_cell_xy(row, col) == Cell.Dead &&
                this.left_to_place[this.current_player] > 0 &&
                (!this.has_placement_limit || this.left_to_place_this_round[this.current_player] > 0);
        };
        Game.prototype.can_undo_at_xy = function (row, col) {
            return this.undo_list.some(function (_a) {
                var r = _a[0], c = _a[1];
                return r == row && c == col;
            });
        };
        Game.prototype.place_at_xy = function (row, col) {
            this.left_to_place[this.current_player] -= 1;
            if (this.has_placement_limit) {
                this.left_to_place_this_round[this.current_player] -= 1;
            }
            this.current_player_placed = true;
            this.board.set_cell_xy(row, col, this.current_player == 0 ? Cell.AlivePlayer0 : Cell.AlivePlayer1);
            this.undo_list.push([row, col]);
        };
        Game.prototype.undo_at_xy = function (row, col) {
            this.left_to_place[this.current_player] += 1;
            if (this.has_placement_limit) {
                this.left_to_place_this_round[this.current_player] += 1;
            }
            this.board.set_cell_xy(row, col, Cell.Dead);
            this.undo_list = this.undo_list.filter(function (_a) {
                var r = _a[0], c = _a[1];
                return r !== row || c !== col;
            });
        };
        Game.prototype.convert_undolist_to_board_delta = function () {
            var _this = this;
            var delta = [];
            for (var i = 0; i < this.board_size * this.board_size; i++) {
                delta.push(CellDelta.NoChange);
            }
            this.undo_list.forEach(function (_a) {
                var row = _a[0], col = _a[1];
                delta[row * _this.board_size + col] = _this.current_player == 0 ? CellDelta.SpawnPlayer0 : CellDelta.SpawnPlayer1;
            });
            return delta;
        };
        Game.prototype.pass_player = function () {
            this.replay.replay_steps.push(new ReplayStep(ReplayStepType.Placement, this.convert_undolist_to_board_delta(), this.current_player, __spreadArrays(this.left_to_place), __spreadArrays(this.score), __spreadArrays(this.left_to_place_this_round)));
            this.undo_list = new Array();
            if (!this.current_player_placed && !this.prev_player_placed) {
                this.calculate_score();
                if (this.score[0] == 0 || this.score[1] == 0) {
                    this.go_to_end_game();
                }
                else {
                    this.go_to_run();
                }
            }
            else {
                this.prev_player_placed = this.current_player_placed;
                this.current_player = 1 - this.current_player;
                this.current_player_placed = false;
                if (this.left_to_place[this.current_player] == 0 || (this.has_placement_limit && this.left_to_place_this_round[this.current_player] == 0)) {
                    this.go_to_run();
                }
            }
        };
        Game.prototype.calculate_score = function () {
            var score = [0, 0];
            for (var i = 0; i < this.board_size * this.board_size; i++) {
                if (this.board.play_area[i] == Cell.AlivePlayer0) {
                    score[0]++;
                }
                else if (this.board.play_area[i] == Cell.AlivePlayer1) {
                    score[1]++;
                }
            }
            this.score = score;
            return score;
        };
        return Game;
    }());

    var UI = /** @class */ (function () {
        function UI(game) {
            this.game = game;
            this.draw_replay_box();
        }
        UI.prototype.new_game = function () {
            this.game.init_game();
            this.board_size = this.game.get_board_size();
            this.set_current_player_title(this.game.get_current_player());
            this.set_current_placements_left(this.game.get_placements_left(), this.game.has_placement_limit, this.game.left_to_place_this_round);
            this.set_current_score(this.game.calculate_score());
            this.create_board();
            this.setup_buttons();
        };
        UI.prototype.create_board = function () {
            var _this = this;
            var board = document.getElementById("playboard");
            board.innerHTML = '';
            var _loop_1 = function (row) {
                var dom_row = document.createElement("div");
                dom_row.style.display = "flex";
                dom_row.style.flexDirection = "row";
                var _loop_2 = function (col) {
                    var dom_col = document.createElement("div");
                    dom_col.classList.add("board_cell");
                    dom_col.classList.add("_" + this_1.board_size + "X" + this_1.board_size);
                    dom_col.id = row + "-" + col;
                    dom_col.onclick = function () { return _this.cell_clicked(row, col); };
                    dom_row.appendChild(dom_col);
                };
                for (var col = 0; col < this_1.board_size; col++) {
                    _loop_2(col);
                }
                board.appendChild(dom_row);
            };
            var this_1 = this;
            for (var row = 0; row < this.board_size; row++) {
                _loop_1(row);
            }
        };
        UI.prototype.setup_buttons = function () {
            var _this = this;
            var pass_btn = document.getElementById("pass_player_button");
            pass_btn.onclick = function () { return _this.pass_player(); };
            pass_btn.style.display = 'block';
            pass_btn.removeAttribute("disabled");
            var new_game_btn = document.getElementById("new_game_button");
            new_game_btn.onclick = function () { return _this.new_game(); };
            new_game_btn.style.display = 'none';
            var win_div = document.getElementById("winner");
            win_div.innerHTML = '';
            win_div.classList.remove('player_0');
            win_div.classList.remove('player_1');
            win_div.parentElement.style.display = "none";
            var instructions_toggle = document.getElementById("instructions_toggle");
            instructions_toggle.onclick = function () {
                var instructions = document.getElementById('instructions');
                if (instructions.style.display == "none") {
                    instructions.style.display = "block";
                }
                else {
                    instructions.style.display = "none";
                }
            };
            var configuration_toggle = document.getElementById("configuration_toggle");
            configuration_toggle.onclick = function () {
                var configuration = document.getElementById('configuration');
                if (configuration.style.display == "none") {
                    configuration.style.display = "block";
                }
                else {
                    configuration.style.display = "none";
                }
            };
            var save_config = document.getElementById("save_config");
            save_config.onclick = function () { return _this.save_config(); };
            var random_place_div = document.getElementById('random_place_div');
            random_place_div.style.display = "block";
            var random_place_button = document.getElementById("random_place_button");
            random_place_button.removeAttribute("disabled");
            random_place_button.onclick = function () { return _this.random_placement(); };
            var replay_toggle = document.getElementById("replay_toggle");
            replay_toggle.onclick = function () {
                var configuration = document.getElementById('replay');
                if (configuration.style.display == "none") {
                    configuration.style.display = "block";
                }
                else {
                    configuration.style.display = "none";
                }
            };
            var run_replay = document.getElementById("run_replay");
            run_replay.onclick = function () { return _this.load_and_run_replay(); };
            var save_replay = document.getElementById("save_replay_button");
            save_replay.onclick = function () { return _this.save_replay(); };
        };
        UI.prototype.select_birth_rules = function (birth_rules_str) {
            switch (birth_rules_str) {
                case "normal": return BirthRules.Normal;
                case "three_plus_one": return BirthRules.ThreePlusOne;
                case "both": return BirthRules.Both;
                case "p2life": return BirthRules.P2Life;
                default: return BirthRules.Normal;
            }
        };
        UI.prototype.save_config = function () {
            var max_first_player_placements = document.getElementById("max_first_player_placements").value;
            var max_second_player_placements = document.getElementById("max_second_player_placements").value;
            var max_round_placements = document.getElementById("max_round_placements").value;
            var board_size = document.getElementById("board_size").value;
            var birth_rules = document.getElementById("birth_rules").value;
            this.game.set_config(parseInt(max_first_player_placements), parseInt(max_second_player_placements), parseInt(max_round_placements), parseInt(board_size), this.select_birth_rules(birth_rules));
            this.new_game();
        };
        UI.prototype.cell_clicked = function (row, col) {
            console.log("Clicked " + row + " : " + col);
            if (this.game.can_place_at_xy(row, col)) {
                this.game.place_at_xy(row, col);
                var current_player = this.game.get_current_player();
                this.change_color_at_xy(row, col, "selected_player_" + current_player);
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
        };
        UI.prototype.change_color_at_xy = function (row, col, css_class) {
            var cell = document.getElementById(row + "-" + col);
            cell.classList.remove("active_player_0");
            cell.classList.remove("active_player_1");
            cell.classList.remove("selected_player_0");
            cell.classList.remove("selected_player_1");
            if (css_class) {
                cell.classList.add(css_class);
            }
        };
        UI.prototype.fix_selections = function () {
            var _this = this;
            var current_player = this.game.get_current_player();
            var placement_list = this.game.undo_list;
            placement_list.forEach(function (_a) {
                var row = _a[0], col = _a[1];
                _this.change_color_at_xy(row, col, "active_player_" + current_player);
            });
        };
        UI.prototype.change_colors_many = function (diff, pattern) {
            if (pattern === void 0) { pattern = "active_player"; }
            for (var row = 0; row < this.board_size; row++) {
                for (var col = 0; col < this.board_size; col++) {
                    var delta = diff[row * this.board_size + col];
                    if (delta == CellDelta.NoChange) {
                        continue;
                    }
                    this.change_color_at_xy(row, col, delta == CellDelta.Die ? null : delta == CellDelta.SpawnPlayer0 ? pattern + "_0" : pattern + "_1");
                }
            }
        };
        UI.prototype.pass_player = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
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
                    return [2 /*return*/];
                });
            });
        };
        UI.prototype.sleep = function (ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        };
        UI.prototype.run_game = function () {
            return __awaiter(this, void 0, void 0, function () {
                var board_delta;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.game.get_game_state() == GameState.Run)) return [3 /*break*/, 2];
                            console.log("Running game loop");
                            board_delta = this.game.game_step();
                            this.change_colors_many(board_delta);
                            this.set_current_score(this.game.calculate_score());
                            return [4 /*yield*/, this.sleep(500)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 0];
                        case 2:
                            console.log("Ending game loop");
                            if (this.game.get_game_state() == GameState.Place) {
                                document.getElementById("pass_player_button").removeAttribute("disabled");
                                document.getElementById("random_place_button").removeAttribute("disabled");
                                this.set_current_player_title(this.game.get_current_player());
                                this.set_current_placements_left(this.game.get_placements_left(), this.game.has_placement_limit, this.game.left_to_place_this_round);
                            }
                            else if (this.game.get_game_state() == GameState.End) {
                                this.end_game();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        UI.prototype.end_game = function () {
            document.getElementById("pass_player_button").style.display = "none";
            document.getElementById("random_place_div").style.display = "none";
            document.getElementById("new_game_button").style.display = "block";
            document.getElementById("save_replay_button").style.display = "block";
            var score = this.game.score;
            var placements_left = this.game.get_placements_left();
            this.set_winner(score);
        };
        UI.prototype.set_current_player_title = function (current_player) {
            var current_player_title = document.getElementById("current_player");
            current_player_title.innerHTML = current_player == 0 ? 'Red' : 'Blue';
            current_player_title.classList.remove('player_0');
            current_player_title.classList.remove('player_1');
            current_player_title.classList.add("player_" + current_player);
        };
        UI.prototype.set_current_placements_left = function (placements_left, has_placement_limit, left_to_place_this_round) {
            document.getElementById("player_0_placements").innerHTML = placements_left[0].toString();
            document.getElementById("player_1_placements").innerHTML = placements_left[1].toString();
            if (has_placement_limit) {
                document.getElementById("player_0_placements").innerHTML += " (" + left_to_place_this_round[0].toString() + ")";
                document.getElementById("player_1_placements").innerHTML += " (" + left_to_place_this_round[1].toString() + ")";
            }
        };
        UI.prototype.set_current_score = function (score) {
            document.getElementById("player_0_score").innerHTML = score[0].toString();
            document.getElementById("player_1_score").innerHTML = score[1].toString();
        };
        UI.prototype.set_winner = function (score) {
            var win_div = document.getElementById("winner");
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
        };
        UI.prototype.random_placement = function () {
            var number_to_place = parseInt(document.getElementById("random_place_input").value);
            var max_can_place = this.game.get_placements_left_for_current_player();
            if (number_to_place > max_can_place) {
                number_to_place = max_can_place;
            }
            while (number_to_place > 0) {
                var x = Math.floor(Math.random() * 1000) % this.board_size;
                var y = Math.floor(Math.random() * 1000) % this.board_size;
                if (this.game.can_place_at_xy(x, y)) {
                    this.cell_clicked(x, y);
                    number_to_place--;
                }
            }
        };
        UI.prototype.load_and_run_replay = function () {
            return __awaiter(this, void 0, void 0, function () {
                var selected_replay, replay_str;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            selected_replay = document.getElementById('replays_avaliable').value;
                            replay_str = localStorage.getItem(selected_replay);
                            if (!replay_str) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.run_replay(JSON.parse(replay_str))];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        UI.prototype.fix_placement_to_active = function () {
            for (var player = 0; player < 2; player++) {
                var elements = document.getElementsByClassName("selected_player_" + player);
                while (elements.length) {
                    elements[0].classList.add("active_player_" + player);
                    elements[0].classList.remove("selected_player_" + player);
                }
            }
        };
        UI.prototype.run_replay = function (replay) {
            return __awaiter(this, void 0, void 0, function () {
                var win_div, _a, _b, _i, index, replay_step, board_delta;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.game.set_config(replay.max_first_player_placements, replay.max_second_player_placements, replay.max_round_placements, replay.board_size, replay.birth_rules);
                            this.game.init_game();
                            this.game.go_to_replay();
                            this.board_size = this.game.get_board_size();
                            this.set_current_score(this.game.calculate_score());
                            this.create_board();
                            document.getElementById("pass_player_button").style.display = "none";
                            document.getElementById("random_place_div").style.display = "none";
                            win_div = document.getElementById("winner");
                            win_div.innerHTML = '';
                            win_div.classList.remove('player_0');
                            win_div.classList.remove('player_1');
                            win_div.parentElement.style.display = "none";
                            _a = [];
                            for (_b in replay.replay_steps)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 9];
                            index = _a[_i];
                            replay_step = replay.replay_steps[index];
                            if (!(replay_step.replay_step_type !== ReplayStepType.End)) return [3 /*break*/, 7];
                            console.log("Running replay");
                            this.set_current_placements_left(replay_step.left_to_place, replay.has_placement_limit, replay_step.left_to_place_this_round);
                            this.set_current_player_title(replay_step.current_player);
                            board_delta = replay_step.board_delta;
                            if (!(replay_step.replay_step_type == ReplayStepType.Run)) return [3 /*break*/, 3];
                            this.change_colors_many(board_delta);
                            this.set_current_score(replay_step.score);
                            return [4 /*yield*/, this.sleep(500)];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 6];
                        case 3:
                            if (!(replay_step.replay_step_type == ReplayStepType.Placement)) return [3 /*break*/, 6];
                            // Show selection color
                            this.change_colors_many(board_delta, "selected_player");
                            this.set_current_score(replay_step.score);
                            return [4 /*yield*/, this.sleep(300)
                                // Fix selection colors to normal
                            ];
                        case 4:
                            _c.sent();
                            // Fix selection colors to normal
                            this.fix_placement_to_active();
                            return [4 /*yield*/, this.sleep(250)];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            this.set_winner(replay_step.score);
                            _c.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 1];
                        case 9:
                            document.getElementById("new_game_button").style.display = "block";
                            return [2 /*return*/];
                    }
                });
            });
        };
        UI.prototype.get_max_replay_number = function () {
            var last_replay_number = 0;
            var last_replay_str = localStorage.getItem('last_replay_number');
            if (last_replay_str) {
                last_replay_number = parseInt(last_replay_str);
            }
            return last_replay_number;
        };
        UI.prototype.save_replay = function () {
            var next_replay_number = this.get_max_replay_number() + 1;
            localStorage.setItem('last_replay_number', next_replay_number.toString());
            localStorage.setItem("replay_" + next_replay_number, JSON.stringify(this.game.replay));
            document.getElementById("save_replay_button").style.display = "none";
            this.draw_replay_box();
        };
        UI.prototype.draw_replay_box = function () {
            var max_replay_number = this.get_max_replay_number();
            var select_box = document.getElementById('replays_avaliable');
            while (select_box.options.length > 0) {
                select_box.options.remove(0);
            }
            for (var i = 1; i <= max_replay_number; i++) {
                var replay_json = localStorage.getItem("replay_" + i);
                if (replay_json) {
                    var replay = JSON.parse(replay_json);
                    var score = replay.replay_steps.find(function (step) { return step.replay_step_type == ReplayStepType.End; }).score;
                    var new_replay_option = new Option("#" + i + ", Red: " + score[0] + ", Blue: " + score[1], "replay_" + i);
                    select_box.add(new_replay_option);
                }
            }
        };
        return UI;
    }());

    var game = new Game();
    var ui = new UI(game);
    ui.new_game();

})));
//# sourceMappingURL=bundle.js.map

export enum Cell {
    Dead,
    AlivePlayer0,
    AlivePlayer1
}

class GetNeighborhoodResult {
    constructor (public alive_player_1_count: number = 0, public alive_player_2_count: number = 0) {}
    get total():number {return this.alive_player_1_count + this.alive_player_2_count }
}

export class Board {
    play_area:Cell[];
    
    constructor(public board_size: number = 10) {
        this.reset_play_area();       
    }    

    reset_play_area() {
        this.play_area = new Array<Cell>(this.board_size * this.board_size);
        this.play_area.fill(Cell.Dead);
    }

    get_cell_xy(row: number, col: number) {
        return this.play_area[row * this.board_size + col]
    }

    set_cell(cell_number: number, new_state: Cell, allow_override: boolean = false) {

        if (new_state == Cell.Dead && this.play_area[cell_number] == Cell.Dead) {
            throw new Error(`Cannot kill a dead cell ${cell_number} = ${Math.floor(cell_number/this.board_size)} : ${cell_number%this.board_size}`);
        }
        else if ((new_state == Cell.AlivePlayer0 || new_state == Cell.AlivePlayer1)  && this.play_area[cell_number] != Cell.Dead && !allow_override) {
            throw new Error(`Cannot spawn on occupied cell ${Math.floor(cell_number/this.board_size)} : ${cell_number%this.board_size}`)
        }

        this.play_area[cell_number] = new_state;
    }

    set_cell_xy(row: number, col:number, new_state: Cell) {
        let cell_number = row * this.board_size + col;
        this.set_cell(cell_number, new_state, false);
    }

    get_neighborhood(row:number, col:number): GetNeighborhoodResult {
        let alive_player_1_count = 0
        let alive_player_2_count = 0

        for (let row_delta = -1; row_delta < 2; row_delta ++) {
            let c_row = row + row_delta
            if (c_row < 0 || c_row >= this.board_size) {
                continue
            }

            for (let col_delta = -1; col_delta < 2; col_delta ++) {
                if (row_delta == 0 && col_delta == 0) {
                    continue
                }                

                let c_col = col + col_delta
                if (c_col < 0 || c_col >= this.board_size) {
                    continue
                }

                switch(this.play_area[c_row * this.board_size + c_col]) {
                    case Cell.Dead: /* do nothing */ ; break;
                    case Cell.AlivePlayer0: alive_player_1_count++; break;
                    case Cell.AlivePlayer1: alive_player_2_count++; break;
                }
            }
        }
        
        return new GetNeighborhoodResult(alive_player_1_count, alive_player_2_count);
    }

}
import { CellDelta, BirthRules } from './game'

export class Replay {
    replay_steps: ReplayStep[] = [];
    constructor(
        public max_first_player_placements: number,
        public max_second_player_placements: number,
        public has_placement_limit: boolean,
        public max_round_placements: number,
        public board_size: number,
        public birth_rules: BirthRules
    ) {}
}

export enum ReplayStepType {
    Placement,
    Run,
    End
}

export class ReplayStep {
    constructor(public replay_step_type: ReplayStepType, public board_delta: CellDelta[], public current_player: number,
                public left_to_place: number[], public score: number[], public left_to_place_this_round: number[]) 
                {

                }
}
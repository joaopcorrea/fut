import { Player } from "../player/player";

export interface Team {
    players: Player[],
    benchPlayers: Player[],
    startingPlayerId: number,
    secondStartingPlayerId: number
}


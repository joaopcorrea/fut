import { Stats } from "./stats";

export interface Player {
  id: number;
  name: string;
  number: number;
  initialX: number;
  initialY: number;
  x: number;
  y: number;
  stats: Stats;
  position: Position;
}

export enum Position {
  GK = 1,
  FB = 2,
  WB = 3,
  CB = 4,
  CDM = 5,
  CM = 6,
  CAM = 7,
  SM = 8,
  WIN = 9,
  SF = 10,
  CF = 11,
  ST = 12
}
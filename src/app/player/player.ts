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
  GOL,
  ZAG,
  MC,
  ATA
}
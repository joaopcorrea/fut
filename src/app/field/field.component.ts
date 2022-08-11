import { Component, ElementRef, OnInit } from '@angular/core';
import { IPlayer } from '../player/iplayer';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  homeTeam: IPlayer[] = [];
  awayTeam: IPlayer[] = [];
  players: IPlayer[] = [];
  playerWithBall = 1;

  constructor() { }

  ngOnInit(): void {
    this.homeTeam = [
      {
        id: 1,
        name: 'C. Ronaldo',
        number: 7,
        x: 30,
        y: 65
      },
      {
        id: 2,
        name: 'Messi',
        number: 10,
        x: 20,
        y: 35
      }
    ];

    this.awayTeam=[
      {
        id: 3,
        name: 'Neymar',
        number: 10,
        x: 60,
        y: 70
      },
      {
        id: 4,
        name: 'Mbappé',
        number: 7,
        x: 45,
        y: 10
      },
    ]
  }

  run() {
    let isHomeTeam: boolean = false;

    let player = this.homeTeam.find(p => p.id == this.playerWithBall);
    if (player) isHomeTeam = true;
    else this.awayTeam.find(p => p.id == this.playerWithBall);

    let playersInRange: IPlayer[] = [];
    if (isHomeTeam) {
      this.awayTeam.map(p => {
        if (p.x >= player!.x -5 && p.x <= player!.x + 5 &&
            p.y >= player!.y - 5 && p.y <= player!.y + 5)
          playersInRange.push(p);
      });
    } else {
      this.homeTeam.map(p => {
        if (p.x >= player!.x -5 && p.x <= player!.x + 5 &&
            p.y >= player!.y - 5 && p.y <= player!.y + 5)
          playersInRange.push(p);
      });
    }

    if (!playersInRange.length) {
      player!.x++;
      console.log(`${player?.name} avança!`);
    } else {
      console.log('Jogadores por perto: ');
      playersInRange.forEach(p => console.log(p));
    }
    
  }

  chooseAction(player: IPlayer) {

  }
}

enum action {
  kick,
  pass,
  advance
}
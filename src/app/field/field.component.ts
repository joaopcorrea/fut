import { Component, ElementRef, OnInit } from '@angular/core';
import { IPlayer } from '../player/iplayer';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  timer: any;
  isRunning: boolean = false;

  homeTeam: IPlayer[] = [];
  awayTeam: IPlayer[] = [];
  players: IPlayer[] = [];
  playerWithBall = 10;

  homeTeamScore = 0;
  awayTeamScore = 0;

  constructor() { }

  ngOnInit(): void {
    this.homeTeam = [
      {
        id: 1,
        name: 'Keylor Navas',
        number: 1,
        x: 0,
        y: 50
      },
      {
        id: 2,
        name: 'Sergio Ramos',
        number: 2,
        x: 10,
        y: 30
      },
      {
        id: 3,
        name: 'Marquinhos',
        number: 5,
        x: 10,
        y: 70
      },
      {
        id: 4,
        name: 'Marco Verratti',
        number: 4,
        x: 15,
        y: 10
      },
      {
        id: 5,
        name: 'Gerard Piqué',
        number: 6,
        x: 15,
        y: 90
      },
      {
        id: 6,
        name: 'Fábio M.',
        number: 16,
        x: 25,
        y: 40
      },
      {
        id: 7,
        name: 'Linetty',
        number: 77,
        x: 25,
        y: 60
      },
      {
        id: 8,
        name: 'O. Dembelé',
        number: 9,
        x: 35,
        y: 20
      },
      {
        id: 9,
        name: 'Lewandowsk',
        number: 11,
        x: 35,
        y: 80
      },
      {
        id: 10,
        name: 'C. Ronaldo',
        number: 7,
        x: 45,
        y: 40
      },
      {
        id: 11,
        name: 'Messi',
        number: 10,
        x: 45,
        y: 60
      }
    ];

    this.awayTeam=[
      {
        id: 12,
        name: 'Alisson',
        number: 1,
        x: 100,
        y: 50
      },
      {
        id: 13,
        name: 'Salah',
        number: 20,
        x: 90,
        y: 30
      },
      {
        id: 14,
        name: 'R. Firmino',
        number: 11,
        x: 90,
        y: 50
      },
      {
        id: 15,
        name: 'Marcelo',
        number: 4,
        x: 90,
        y: 70
      },
      {
        id: 16,
        name: 'Mané',
        number: 15,
        x: 80,
        y: 10
      },
      {
        id: 17,
        name: 'Witsel',
        number: 28,
        x: 80,
        y: 90
      },
      {
        id: 18,
        name: 'Hazard',
        number: 12,
        x: 70,
        y: 30
      },
      {
        id: 19,
        name: 'Neymar',
        number: 10,
        x: 70,
        y: 70
      },
      {
        id: 20,
        name: 'Mbappé',
        number: 7,
        x: 65,
        y: 50
      },
      {
        id: 21,
        name: 'Ibrahimovic',
        number: 11,
        x: 55,
        y: 35
      },
      {
        id: 22,
        name: 'Haaland',
        number: 9,
        x: 55,
        y: 65
      },
    ]
  }

  simulate() {
    let teamSide: TeamSide = TeamSide.AWAY;

    let player = this.homeTeam.find(p => p.id == this.playerWithBall) as IPlayer;
    if (player) teamSide = TeamSide.HOME;
    else player = this.awayTeam.find(p => p.id == this.playerWithBall) as IPlayer;

    let teamList = teamSide == TeamSide.HOME ? this.homeTeam : this.awayTeam;
    let playersInRangeToPass = this.getPlayersInRange(teamList, player,
      -20, 20, -20, 20);

    let action: Action = this.chooseAction(player, teamSide, playersInRangeToPass);

    if (action == Action.ADVANCE) {
      this.advance(player, teamSide);
    } else if (action == Action.PASS) {
      this.pass(player, teamSide, playersInRangeToPass);
    } else if (action == Action.KICK) {

    }
  }

  advance(player: IPlayer, teamSide: TeamSide) {
    let playersInRange: IPlayer[] = [];
    if (teamSide == TeamSide.HOME) {
      playersInRange = this.getPlayersInRange(this.awayTeam, player,
        0, 5, -5, 5)
    } else {
      playersInRange = this.getPlayersInRange(this.homeTeam, player,
        -5, 0, -5, 5)
    }

    if (!playersInRange.length) {
      this.runForward(player, teamSide);
    } else {
      console.log('Jogadores por perto: ');
      playersInRange.forEach(p => console.log(p));

      this.dribble(player, playersInRange);
    }
  }

  runForward(player: IPlayer, teamSide: TeamSide) {
    player!.x += teamSide == TeamSide.HOME ? 5 : -5;
    console.log(`${player?.name} avança!`);
  }

  dribble(player: IPlayer, playersInRange: IPlayer[]) {
    let playerDribbled = playersInRange[this.getRndInteger(0, playersInRange.length - 1)]
    
    console.log(`${player.name} está tentando driblar ${playerDribbled.name}`);
    
    let tempX = player?.x;
    let tempY = player?.y;
    
    player.x = playerDribbled.x;
    player.y = playerDribbled.y;
    
    playerDribbled.x = tempX;
    playerDribbled.y = tempY;
    
    let random = Math.random();
    if (random >= .5) {
      this.playerWithBall = playerDribbled.id;
      console.log('o marcador está esperto, acertou o bote na hora');
    } else {
      console.log('que lindo drible!');
    }
  }

  pass(player: IPlayer, teamSide: TeamSide, playersInRange: IPlayer[]) {
    let playerToPass = playersInRange[this.getRndInteger(0, playersInRange.length-1)];
    this.playerWithBall = playerToPass.id;

    console.log(`${player.name} tocou a bola para ${playerToPass.name}`);
  }

  getPlayersInRange(list: IPlayer[], player: IPlayer, 
      minX: number, maxX: number, 
      minY: number, maxY: number) {
    return list.filter(p => p.id != player.id && 
      p.x >= player.x + minX && p.x <= player.x + maxX &&
      p.y >= player.y + minY && p.y <= player.y + maxY);
  }

  chooseAction(player: IPlayer, teamSide: TeamSide, playersInRangeToPass: IPlayer[]) {
    if (!playersInRangeToPass.length)
      return 1;
    else
      return this.getRndInteger(1, 2);
  }

  getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  runClick() {
    if (this.isRunning) {
      clearInterval(this.timer);
      this.timer = null;
      this.isRunning = false;
    } else {
      this.isRunning = true;

      this.timer = setInterval(() => {
        this.simulate();
      }, 500);
    }
  }
}

enum TeamSide {
  HOME,
  AWAY
}

enum Action {
  ADVANCE = 1,
  PASS = 2,
  KICK = 3,
}
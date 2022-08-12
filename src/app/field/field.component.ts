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
  
  playerWithBall = 0;
  teamWithBall: TeamSide = TeamSide.HOME;

  homeTeamScore = 0;
  awayTeamScore = 0;


  private moveUnits = 3;

  constructor() { }

  ngOnInit(): void {
    this.homeTeam = [
      {
        id: 1,
        name: 'Keylor Navas',
        number: 1,
        initialX: 0,
        initialY: 50,
        x: 0,
        y: 50
      },
      {
        id: 2,
        name: 'Sergio Ramos',
        number: 2,
        initialX: 10,
        initialY: 30,
        x: 10,
        y: 30
      },
      {
        id: 3,
        name: 'Marquinhos',
        number: 5,
        initialX: 10,
        initialY: 70,
        x: 10,
        y: 70
      },
      {
        id: 4,
        name: 'Marco Verratti',
        number: 4,
        initialX: 15,
        initialY: 10,
        x: 15,
        y: 10
      },
      {
        id: 5,
        name: 'Gerard Piqué',
        number: 6,
        initialX: 15,
        initialY: 90,
        x: 15,
        y: 90
      },
      {
        id: 6,
        name: 'Fábio M.',
        number: 16,
        initialX: 25,
        initialY: 40,
        x: 25,
        y: 40
      },
      {
        id: 7,
        name: 'Linetty',
        number: 77,
        initialX: 25,
        initialY: 60,
        x: 25,
        y: 60
      },
      {
        id: 8,
        name: 'O. Dembelé',
        number: 9,
        initialX: 35,
        initialY: 20,
        x: 35,
        y: 20
      },
      {
        id: 9,
        name: 'Lewandowsk',
        number: 11,
        initialX: 35,
        initialY: 80,
        x: 35,
        y: 80
      },
      {
        id: 10,
        name: 'C. Ronaldo',
        number: 7,
        initialX: 45,
        initialY: 40,
        x: 45,
        y: 40
      },
      {
        id: 11,
        name: 'Messi',
        number: 10,
        initialX: 45,
        initialY: 60,
        x: 45,
        y: 60
      }
    ];

    this.awayTeam=[
      {
        id: 12,
        name: 'Alisson',
        number: 1,
        initialX: 100,
        initialY: 50,
        x: 100,
        y: 50
      },
      {
        id: 13,
        name: 'Salah',
        number: 20,
        initialX: 90,
        initialY: 30,
        x: 90,
        y: 30
      },
      {
        id: 14,
        name: 'R. Firmino',
        number: 11,
        initialX: 90,
        initialY: 50,
        x: 90,
        y: 50
      },
      {
        id: 15,
        name: 'Marcelo',
        number: 4,
        initialX: 90,
        initialY: 70,
        x: 90,
        y: 70
      },
      {
        id: 16,
        name: 'Mané',
        number: 15,
        initialX: 80,
        initialY: 10,
        x: 80,
        y: 10
      },
      {
        id: 17,
        name: 'Witsel',
        number: 28,
        initialX: 80,
        initialY: 90,
        x: 80,
        y: 90
      },
      {
        id: 18,
        name: 'Hazard',
        number: 12,
        initialX: 70,
        initialY: 30,
        x: 70,
        y: 30
      },
      {
        id: 19,
        name: 'Neymar',
        number: 10,
        initialX: 70,
        initialY: 70,
        x: 70,
        y: 70
      },
      {
        id: 20,
        name: 'Mbappé',
        number: 7,
        initialX: 65,
        initialY: 50,
        x: 65,
        y: 50
      },
      {
        id: 21,
        name: 'Ibrahimovic',
        number: 11,
        initialX: 55,
        initialY: 35,
        x: 55,
        y: 35
      },
      {
        id: 22,
        name: 'Haaland',
        number: 9,
        initialX: 55,
        initialY: 65,
        x: 55,
        y: 65
      },
    ]
  }

  simulateGame() {
    this.homeTeam.forEach(player => {
      this.simulatePlayer(player, TeamSide.HOME)
    });

    this.awayTeam.forEach(player => {
      this.simulatePlayer(player, TeamSide.AWAY)
    });
  }

  restartGame() {
    if (this.teamWithBall == TeamSide.HOME) 
      this.playerWithBall = 10;
    else
      this.playerWithBall = 20;

    this.homeTeam.forEach(player => {
      player.x = player.initialX;
      player.y = player.initialY;
    });

    this.awayTeam.forEach(player => {
      player.x = player.initialX;
      player.y = player.initialY;
    });
  }

  simulatePlayer(player: IPlayer, teamSide: TeamSide) {
    let teamList = teamSide == TeamSide.HOME ? this.homeTeam : this.awayTeam;
    let playersInRangeToPass = this.getPlayersInRange(teamList, player,
      -20, 20, -20, 20);

    let action: Action = this.chooseAction(player, teamSide, playersInRangeToPass);

    if (action == Action.ADVANCE) {
      this.advance(player, teamSide);
    } else if (action == Action.PASS) {
      this.pass(player, teamSide, playersInRangeToPass);
    } else if (action == Action.KICK) {
      this.kick(player, teamSide);
    } else if (action == Action.RETREAT) {
      this.runBackward(player, teamSide);
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

    if (!playersInRange.length || this.playerWithBall != player.id) {
      this.runForward(player, teamSide);
    } else {
      console.log('Jogadores por perto: ');
      playersInRange.forEach(p => console.log(p));

      this.dribble(player, playersInRange);
    }
  }

  runForward(player: IPlayer, teamSide: TeamSide) {
    player.x += this.moveUnits * (teamSide == TeamSide.HOME ? 1 : -1);
    player.y += this.getRndInteger(-this.moveUnits, this.moveUnits);

    if (player.x < 0) player.x = 0;
    if (player.x > 100) player.x = 100;
    if (player.y < 0) player.y = 0;
    if (player.y > 100) player.y = 100;

    console.log(`${player?.name} avança!`);
  }

  runBackward(player: IPlayer, teamSide: TeamSide) {
    if (player.x <= player.initialX - this.moveUnits ||
        player.x >= player.initialX + this.moveUnits) {
      player.x -= this.moveUnits * (teamSide == TeamSide.HOME ? 1 : -1);
    }

    if (player.y <= player.initialY - this.moveUnits ||
        player.y >= player.initialY + this.moveUnits) {
      player.y -= this.getRndInteger(-this.moveUnits, this.moveUnits);
    }

    if (player.x < 0) player.x = 0;
    if (player.x > 100) player.x = 100;
    if (player.y < 0) player.y = 0;
    if (player.y > 100) player.y = 100;

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

      this.teamWithBall = this.teamWithBall == 
        TeamSide.HOME ? TeamSide.AWAY : TeamSide.HOME;
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

  kick(player: IPlayer, teamSide: TeamSide) {
    console.log(`${player.name} chutou a bola para o gol`);
    console.log('gooooooool');

    if (teamSide == TeamSide.HOME) {
      this.homeTeamScore++;
      this.teamWithBall = TeamSide.AWAY;
    } else {
      this.awayTeamScore++;
      this.teamWithBall = TeamSide.HOME;
    }

    this.restartGame();
  }

  chooseAction(player: IPlayer, teamSide: TeamSide, playersInRangeToPass: IPlayer[]) {
    if (this.playerWithBall != player.id) {
      if (this.teamWithBall == teamSide)
        return Action.ADVANCE;
      else
        return Action.RETREAT;
    }
    
    let minXToKick = 0;
    let maxXToKick = 0;
    let minYToKick = 0;
    let maxYToKick = 0;
    
    minYToKick = 35;
    maxYToKick = 65;

    if (teamSide == TeamSide.HOME) {
      minXToKick = 90;
      maxXToKick = 100;
    } else {
      minXToKick = 0;
      maxXToKick = 10;
    }
    
    if (player.x >= minXToKick && player.x <= maxXToKick &&
        player.y >= minYToKick && player.y <= maxYToKick) {
      return Action.KICK;
    }
    else if (!playersInRangeToPass.length)
      return Action.ADVANCE;
    else
      return this.getRndInteger(1, 2);
  }

  getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  runClick() {
    if (this.teamWithBall == TeamSide.HOME) 
      this.playerWithBall = 10;
    else
      this.playerWithBall = 20;

    if (this.isRunning) {
      clearInterval(this.timer);
      this.timer = null;
      this.isRunning = false;
    } else {
      this.isRunning = true;

      this.timer = setInterval(() => {
        this.simulateGame();
      }, 100);
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
  RETREAT = 4,
}
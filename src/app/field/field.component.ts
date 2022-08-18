import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Ball } from '../ball/ball';
import { IPlayer } from '../player/iplayer';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  animations: [
    trigger('moveState', [
      state('move', 
        style({
          left: '{{ x }}%',
          top: '{{ y }}%'
        }),
        { params: { x: '', y: '' } }
      ),
      state('stop',
        style({
          left: '{{ x }}%',
          top: '{{ y }}%'
        }),
        { params: { x: '', y: '' } }
      ),
      transition('* <=> *', animate('{{ ms }}ms'))
    ])
  ]
})
export class FieldComponent implements OnInit {
  
  public animationState = 'stop';

  gameMinutes = 0;
  gameSeconds = 0;

  ball: Ball = { x: 50.5, y: 50 };
  stopBallPosition = false;

  simulationTimer: any;
  gameTimer: any;
  isRunning: boolean = false;

  homeTeam: IPlayer[] = [];
  awayTeam: IPlayer[] = [];
  players: IPlayer[] = [];
  
  playerWithBall = 0;
  teamWithBall: TeamSide = TeamSide.HOME;

  playerScored = {} as IPlayer;

  homeGoalKeeper = 1;
  awayGoalKeeper = 12;

  homeStartingPlayer = 10;
  homeSecondStartingPlayer = 11;

  awayStartingPlayer = 21;
  awaySecondStartingPlayer = 22;

  homeTeamScore = 0;
  awayTeamScore = 0;


  private moveUnits = 3;
  public msToSimulate = 300;

  private isGoalKick = false;
  private goalKickSide: GoalKickSide = GoalKickSide.DOWN;
  private isGoal = false;

  showGoalNotification = false;
  hideGoalNotification = false;

  teamsSwapped = false;

  constructor() { }

  showGoal() {
    setTimeout(() => {
      this.hideGoalNotification = false;
      this.showGoalNotification = true;

      setTimeout(() => {
        this.hideGoalNotification = true;
        this.showGoalNotification = false;
      }, this.msToSimulate * 8);
    }, this.msToSimulate);
  }

  animationDone() {
    setTimeout(() => {
      this.animationState = 'stop';
    });
  }

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
        initialY: 30,
        x: 45,
        y: 30
      },
      {
        id: 11,
        name: 'Messi',
        number: 10,
        initialX: 45,
        initialY: 70,
        x: 45,
        y: 70
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
        initialY: 30,
        x: 55,
        y: 30
      },
      {
        id: 22,
        name: 'Haaland',
        number: 9,
        initialX: 55,
        initialY: 70,
        x: 55,
        y: 70
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

    this.animationState = 'move';

    if (this.isGoal) {
      this.scoreGoal(this.teamWithBall);
      this.isGoal = false;
      return;
    } 
    else if (this.isGoalKick) {
      this.goalKick(this.teamWithBall);
      this.isGoalKick = false;
      return;
    }

    if (this.gameMinutes > 5 && !this.teamsSwapped) {
      this.swapTeams();
    }

    this.setBallPosition();
  }

  resetPlayerPositions() {
    this.homeTeam.forEach(player => {
      player.x = player.initialX;
      player.y = player.initialY;
    });

    this.awayTeam.forEach(player => {
      player.x = player.initialX;
      player.y = player.initialY;
    });

    this.animationState = 'move';
  }

  swapPlayersPositions() {
    this.homeTeam.forEach(player => {
      player.initialX = 50 - player.initialX + 50;
      player.initialY = 50 - player.initialY + 50;
    });

    this.awayTeam.forEach(player => {
      player.initialX = 50 - player.initialX + 50;
      player.initialY = 50 - player.initialY + 50;
    });
  }

  swapTeams() {
    this.stopSimulationTimer();

    let tempTeam = this.homeTeam;
    this.homeTeam = this.awayTeam;
    this.awayTeam = tempTeam;

    let tempGoalKeeper = this.homeGoalKeeper;
    this.homeGoalKeeper = this.awayGoalKeeper;
    this.awayGoalKeeper = tempGoalKeeper;

    let tempStartingPlayer = this.homeStartingPlayer;
    this.homeStartingPlayer = this.awayStartingPlayer;
    this.awayStartingPlayer = tempStartingPlayer;
    
    let tempSecondStartingPlayer  = this.homeSecondStartingPlayer;
    this.homeSecondStartingPlayer = this.awaySecondStartingPlayer;
    this.awaySecondStartingPlayer = tempSecondStartingPlayer;

    this.teamWithBall = TeamSide.AWAY;
    this.playerWithBall = this.awayStartingPlayer;
    
    this.teamsSwapped = true;

    this.homeTeam.forEach(p => {
      p.x = 20;
      p.y = 110;
    });

    this.awayTeam.forEach(p => {
      p.x = 70;
      p.y = 110;
    });

    this.ball = {x: 110, y: 50};

    this.animationState = 'move';

    setTimeout(() => {
      this.swapPlayersPositions();
      this.resetPlayerPositions();
      this.ball = {x: 50.5, y: 50};

      setTimeout(() => {
        this.startSimulationTimer();  
      }, this.msToSimulate * 5);

    }, this.msToSimulate * 10);
  }

  stopSimulationTimer() {
    this.stopGameTimer();
    clearInterval(this.simulationTimer);
    this.simulationTimer = null;
    this.isRunning = false;
  }

  startSimulationTimer() {
    this.startGameTimer();
    this.isRunning = true;

    this.animationState = 'move';
    setTimeout(() => {
      this.animationState = 'stop';
    }, this.msToSimulate);
    
    this.simulationTimer = setInterval(() => {
      this.simulateGame();
    }, this.msToSimulate);
  }

  stopGameTimer() {
    clearInterval(this.gameTimer);
  }

  startGameTimer() {
    this.gameTimer = setInterval(() => {
      if (this.gameSeconds == 59) {
        this.gameMinutes++;
        this.gameSeconds = 0;
      } else {
        this.gameSeconds++;
      }
    }, this.msToSimulate / 10);
  }

  setBallPosition() {
    if (this.stopBallPosition) {
      this.stopBallPosition = false;
      return;
    }
    
    const isHomeTeam = this.teamWithBall == TeamSide.HOME;
    let player: IPlayer;
    if (isHomeTeam)
      player = this.homeTeam.find(p => p.id == this.playerWithBall) as IPlayer;
    else 
      player = this.awayTeam.find(p => p.id == this.playerWithBall) as IPlayer;

    this.ball.x = player.x + (isHomeTeam ? 2 : -1);
    this.ball.y = player.y + 2.5;
  }

  goalKick(lastTeamSide: TeamSide) {
    this.stopSimulationTimer();

    console.log('kick: tiro de meta');

    setTimeout(() => {
      let gk: IPlayer;

      this.resetPlayerPositions();

      if (lastTeamSide == TeamSide.HOME) {
        this.playerWithBall = this.awayGoalKeeper;
        this.teamWithBall = TeamSide.AWAY;
        this.ball = {
          x: 99,
          y: this.goalKickSide == GoalKickSide.UP ? 40 : 62
        }

        gk = this.awayTeam.find(p => p.id == this.awayGoalKeeper) as IPlayer;
        gk.x = 102;
        gk.y = this.goalKickSide == GoalKickSide.UP ? 40 : 62;
      } else {
        this.playerWithBall = this.homeGoalKeeper;
        this.teamWithBall = TeamSide.HOME;
        this.ball = {
          x: 3,
          y: this.goalKickSide == GoalKickSide.UP ? 40 : 62
        }

        gk = this.homeTeam.find(p => p.id == this.homeGoalKeeper) as IPlayer;
        gk.x = -2;
        gk.y = this.goalKickSide == GoalKickSide.UP ? 40 : 62;
      }

      setTimeout(() => {
        this.startSimulationTimer();
      }, this.msToSimulate * 2);

    }, this.msToSimulate * 5);
  }

  scoreGoal(teamScored: TeamSide) {
    this.stopSimulationTimer();

    this.showGoal();

    setTimeout(() => {
      this.resetPlayerPositions();

      if (teamScored == TeamSide.HOME) {
        this.homeTeamScore++;
        this.playerWithBall = this.awayStartingPlayer;
        this.teamWithBall = TeamSide.AWAY;

        this.ball = { x: 50.5, y: 50 };

        let player = this.awayTeam.find(p => p.id == this.awayStartingPlayer) as IPlayer;
        player.x = 52;
        player.y = 45;

        player = this.awayTeam.find(p => p.id == this.awaySecondStartingPlayer) as IPlayer;
        player.x = 52;
        player.y = 55;
      } else {
        this.awayTeamScore++;
        this.playerWithBall = this.homeStartingPlayer;
        this.teamWithBall = TeamSide.HOME;

        this.ball = { x: 50.5, y: 50 };

        let player = this.homeTeam.find(p => p.id == this.homeStartingPlayer) as IPlayer;
        player.x = 47;
        player.y = 45

        player = this.homeTeam.find(p => p.id == this.homeSecondStartingPlayer) as IPlayer;
        player.x = 47;
        player.y = 55;
      }

      setTimeout(() => {
        this.startSimulationTimer();
      }, this.msToSimulate * 4);

    }, this.msToSimulate * 10);
  }

  kick(player: IPlayer, teamSide: TeamSide) {
    console.log(`kick: ${player.name} chutou a bola para o gol`);
    
    //verifica se acertou gol
    switch (this.getRndInteger(1, 2))
    {
      // se errou, verifica qual lado errou
      case 1:
        console.log('kick: errou o chute');

        this.ball = { 
          x: teamSide == TeamSide.HOME ? 
            this.getRndInteger(110, 115) : 
            this.getRndInteger(-12, -7),

          y: this.getRndInteger(20,80)
        }

        this.goalKickSide =
          this.ball.y > 50 ? GoalKickSide.DOWN : GoalKickSide.UP;
        
        this.isGoalKick = true;
        break;

      // se acertou, verifica se o goleiro pegou a bola
      case 2:
        console.log('kick: acertou o chute');
        if (this.getRndInteger(1, 2) == 1) {
          console.log('kick: goleiro pegou');

          if (teamSide == TeamSide.HOME) {
            this.playerWithBall = this.awayGoalKeeper;
            this.teamWithBall = TeamSide.AWAY;
          } else {
            this.playerWithBall = this.homeGoalKeeper;
            this.teamWithBall = TeamSide.HOME;
          }
        } else {
          console.log('kick: gooooooool');

          this.playerScored = player;

          this.ball = {
            x: teamSide == TeamSide.HOME ? 105 : -3,
            y: 50.5
          }

          this.isGoal = true;
        }
        break;
    }
  }

  getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  runClick() {
    if (!this.playerWithBall) {
      if (this.teamWithBall == TeamSide.HOME) 
        this.playerWithBall = 10;
      else
        this.playerWithBall = 20;
    }

    if (this.isRunning) {
      this.stopSimulationTimer();
    } else {
      this.isRunning = true;
      setTimeout(() => {
        this.startSimulationTimer();
      }, this.msToSimulate);
    }
  }

  decreaseGameSpeed() {
    // this.msToSimulate *= 1.5;
  }

  increaseGameSpeed() {
    // this.msToSimulate *= 0.5;
  }

  simulatePlayer(player: IPlayer, teamSide: TeamSide) {    
    let teamList = teamSide == TeamSide.HOME ? this.homeTeam : this.awayTeam;
    let playersInRangeToPass = this.getPlayersInRange(teamList, player,
      -20, 20, -20, 20);

    let action: Action = this.chooseAction(player, teamSide, playersInRangeToPass);

    switch(action) {
      case Action.ADVANCE:
        this.advance(player, teamSide);
        break;

      case Action.PASS:
        this.pass(player, teamSide, playersInRangeToPass);
        break;

      case Action.KICK:
        this.kick(player, teamSide);
        break;

      case Action.RETREAT:
        this.runBackward(player, teamSide);
        break;
    }

    this.animationState = 'move';
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

enum GoalKickSide {
  DOWN,
  UP
}
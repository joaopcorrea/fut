import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { access } from 'fs';
import { isatty } from 'tty';
import { Ball } from '../ball/ball';
import { Player, Position } from '../player/player';

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
  
  private awayGoalKeeper: Player = {} as Player;
  private awaySecondStartingPlayer = 22;
  private awayStartingPlayer = 21;
  private awayTeamSide: FieldSide = FieldSide.RIGHT;
  
  private gameTimer: any;
  private goalKickSide: GoalKickSide = GoalKickSide.DOWN;

  private homeGoalKeeper: Player = {} as Player;
  private homeSecondStartingPlayer = 11;
  private homeStartingPlayer = 10;
  private homeTeamSide: FieldSide = FieldSide.LEFT;

  private idPlayerWithBall = 0;
  private isGoalKick = false;
  private isGoal = false;

  private moveUnits = 3;

  private sideWithBall: FieldSide = FieldSide.LEFT;
  private simulationTimer: any;
  private stopBallPosition = false;

  private teamsSwapped = false;

  
  public animationState = 'stop';
  public awayTeam: Player[] = [];
  public awayTeamScore = 0;

  public ball: Ball = { x: 50.5, y: 50 };
  
  public gameMinutes = 0;
  public gameSeconds = 0;

  public hideGoalNotification = false;
  public homeTeam: Player[] = [];
  public homeTeamScore = 0;

  public isRunning: boolean = false;

  public msToSimulate = 300;

  public playerScored = {} as Player;

  public showGoalNotification = false;


  constructor() { }

  //#region Angular

  ngOnInit(): void {
    this.homeTeam = [
      {
        id: 1,
        name: 'Keylor Navas',
        number: 1,
        initialX: 0,
        initialY: 50,
        x: 0,
        y: 50,
        stats: {},
        position: Position.GOL
      },
      {
        id: 2,
        name: 'Sergio Ramos',
        number: 2,
        initialX: 10,
        initialY: 30,
        x: 10,
        y: 30,
        stats: {},
        position: Position.ZAG
      },
      {
        id: 3,
        name: 'Marquinhos',
        number: 5,
        initialX: 10,
        initialY: 70,
        x: 10,
        y: 70,
        stats: {},
        position: Position.ZAG
      },
      {
        id: 4,
        name: 'Marco Verratti',
        number: 4,
        initialX: 15,
        initialY: 10,
        x: 15,
        y: 10,
        stats: {},
        position: Position.ZAG
      },
      {
        id: 5,
        name: 'Gerard Piqué',
        number: 6,
        initialX: 15,
        initialY: 90,
        x: 15,
        y: 90,
        stats: {},
        position: Position.ZAG
      },
      {
        id: 6,
        name: 'Fábio M.',
        number: 16,
        initialX: 25,
        initialY: 40,
        x: 25,
        y: 40,
        stats: {},
        position: Position.MC
      },
      {
        id: 7,
        name: 'Linetty',
        number: 77,
        initialX: 25,
        initialY: 60,
        x: 25,
        y: 60,
        stats: {},
        position: Position.MC
      },
      {
        id: 8,
        name: 'O. Dembelé',
        number: 9,
        initialX: 35,
        initialY: 20,
        x: 35,
        y: 20,
        stats: {},
        position: Position.MC
      },
      {
        id: 9,
        name: 'Lewandowsk',
        number: 11,
        initialX: 35,
        initialY: 80,
        x: 35,
        y: 80,
        stats: {},
        position: Position.MC
      },
      {
        id: 10,
        name: 'C. Ronaldo',
        number: 7,
        initialX: 45,
        initialY: 30,
        x: 45,
        y: 30,
        stats: {},
        position: Position.ATA
      },
      {
        id: 11,
        name: 'Messi',
        number: 10,
        initialX: 45,
        initialY: 70,
        x: 45,
        y: 70,
        stats: {},
        position: Position.ATA
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
        y: 50,
        stats: {},
        position: Position.GOL
      },
      {
        id: 13,
        name: 'Salah',
        number: 20,
        initialX: 90,
        initialY: 30,
        x: 90,
        y: 30,
        stats: {},
        position: Position.ZAG
      },
      {
        id: 14,
        name: 'R. Firmino',
        number: 11,
        initialX: 90,
        initialY: 50,
        x: 90,
        y: 50,
        stats: {},
        position: Position.ZAG
      },
      {
        id: 15,
        name: 'Marcelo',
        number: 4,
        initialX: 90,
        initialY: 70,
        x: 90,
        y: 70,
        stats: {},
        position: Position.ZAG
      },
      {
        id: 16,
        name: 'Mané',
        number: 15,
        initialX: 80,
        initialY: 10,
        x: 80,
        y: 10,
        stats: {},
        position: Position.MC
      },
      {
        id: 17,
        name: 'Witsel',
        number: 28,
        initialX: 80,
        initialY: 90,
        x: 80,
        y: 90,
        stats: {},
        position: Position.MC
      },
      {
        id: 18,
        name: 'Hazard',
        number: 12,
        initialX: 70,
        initialY: 30,
        x: 70,
        y: 30,
        stats: {},
        position: Position.MC
      },
      {
        id: 19,
        name: 'Neymar',
        number: 10,
        initialX: 70,
        initialY: 70,
        x: 70,
        y: 70,
        stats: {},
        position: Position.MC
      },
      {
        id: 20,
        name: 'Mbappé',
        number: 7,
        initialX: 65,
        initialY: 50,
        x: 65,
        y: 50,
        stats: {},
        position: Position.ATA
      },
      {
        id: 21,
        name: 'Ibrahimovic',
        number: 11,
        initialX: 55,
        initialY: 30,
        x: 55,
        y: 30,
        stats: {},
        position: Position.ATA
      },
      {
        id: 22,
        name: 'Haaland',
        number: 9,
        initialX: 55,
        initialY: 70,
        x: 55,
        y: 70,
        stats: {},
        position: Position.ATA
      },
    ];

    this.homeGoalKeeper = this.homeTeam.find(p => p.id == 1) as Player;
    this.awayGoalKeeper = this.awayTeam.find(p => p.id == 12) as Player;

    this.setBallPosition(
      this.homeTeam.find(p => p.id == this.homeStartingPlayer) as Player
    );
    this.resetPlayerPositions();
  }

  //#endregion

  //#region App Settings

  clickPlayButton() {
    this.startSimulationTimer();
  }

  clickPauseButton() {
    this.stopSimulationTimer();
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

  stopSimulationTimer() {
    this.stopGameTimer();
    clearInterval(this.simulationTimer);
    this.simulationTimer = null;
    this.isRunning = false;
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

  stopGameTimer() {
    clearInterval(this.gameTimer);
  }

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

  //#endregion

  //#region Game Functions

  simulateGame() {
    this.homeTeam.forEach(player => {
      this.simulatePlayer(player, this.homeTeamSide)
    });

    this.awayTeam.forEach(player => {
      this.simulatePlayer(player, this.awayTeamSide)
    });

    this.animationState = 'move';

    if (this.isGoal) {
      this.scoreGoal(this.sideWithBall);
      this.isGoal = false;
      return;
    } 
    else if (this.isGoalKick) {
      this.goalKick(this.sideWithBall);
      this.isGoalKick = false;
      return;
    }

    if (this.gameMinutes > 46 && !this.teamsSwapped) {
      this.swapTeams();
    }
  }

  resetPlayerPositions(startWithBall = true) {
    this.homeTeam.forEach(player => {
      if (player.id == this.homeStartingPlayer && 
          this.sideWithBall == this.homeTeamSide &&
          startWithBall) {
        player.x = this.homeTeamSide == FieldSide.LEFT ? 49 : 52;
        player.y = 46;

        this.setBallPosition(player);
      }
      else if (player.id == this.homeSecondStartingPlayer && 
              this.sideWithBall == this.homeTeamSide &&
              startWithBall) {
        player.x = this.homeTeamSide == FieldSide.LEFT ? 49 : 52;
        player.y = 55;
      }
      else {
        player.x = player.initialX;
        player.y = player.initialY;
      }
    });

    this.awayTeam.forEach(player => {
      if (player.id == this.awayStartingPlayer && 
          this.sideWithBall == this.awayTeamSide &&
          startWithBall) {
        player.x = this.awayTeamSide == FieldSide.LEFT ? 49 : 52;
        player.y = 46;
        
        this.setBallPosition(player);
      }
      else if (player.id == this.awaySecondStartingPlayer && 
              this.sideWithBall == this.awayTeamSide && 
              startWithBall) {
        player.x = this.awayTeamSide == FieldSide.LEFT ? 49 : 52;
        player.y = 55;
      }
      else {
        player.x = player.initialX;
        player.y = player.initialY;
      }
    });

    this.animationState = 'move';
  }

  setBallPosition(player: Player) {
    if (this.stopBallPosition) {
      this.stopBallPosition = false;
      return;
    }
    
    // const isHomeTeam = this.teamWithBall == TeamSide.HOME;
    // let player: Player;
    // if (isHomeTeam)
    //   player = this.homeTeam.find(p => p.id == this.playerWithBall) as Player;
    // else 
    //   player = this.awayTeam.find(p => p.id == this.playerWithBall) as Player;

    this.ball.x = player.x + 
      (this.sideWithBall == FieldSide.LEFT ? 2 : -1);
    this.ball.y = player.y + 2.5;

    this.idPlayerWithBall = player.id;
  }

  scoreGoal(sideScored: FieldSide) {
    this.stopSimulationTimer();

    this.showGoal();

    setTimeout(() => {
      if (sideScored == this.homeTeamSide) {
        this.homeTeamScore++;
      } else {
        this.awayTeamScore++;
      }

      this.changeSideWithBall();
      this.resetPlayerPositions();

      setTimeout(() => {
        this.startSimulationTimer();
      }, this.msToSimulate * 4);

    }, this.msToSimulate * 10);
  }

  goalKick(lastTeamSide: FieldSide) {
    this.stopSimulationTimer();

    setTimeout(() => {
      let gk: Player;

      this.resetPlayerPositions(false);

      let goalKeeper: Player;

      if (lastTeamSide == this.homeTeamSide) {
        goalKeeper = this.awayGoalKeeper;
        
      } 
      else {
        goalKeeper = this.homeGoalKeeper;
      }

      goalKeeper.x = 
        lastTeamSide == FieldSide.RIGHT ? 1 : 100;
      goalKeeper.y = 
        this.goalKickSide == GoalKickSide.UP ? 40 : 60

      this.changeSideWithBall();
      this.setBallPosition(goalKeeper);

      setTimeout(() => {
        this.startSimulationTimer();
      }, this.msToSimulate * 2);

    }, this.msToSimulate * 5);
  }

  changeSideWithBall() {
    this.sideWithBall = 
      this.sideWithBall == FieldSide.LEFT ?
        FieldSide.RIGHT :
        FieldSide.LEFT;
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

    this.homeTeamSide = FieldSide.RIGHT;
    this.awayTeamSide = FieldSide.LEFT;

    this.sideWithBall = FieldSide.LEFT;
    
    this.teamsSwapped = true;

    this.homeTeam.forEach(p => {
      p.x = 70;
      p.y = 110;
    });

    this.awayTeam.forEach(p => {
      p.x = 20;
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

  //#endregion

  //#region Player Actions

  simulatePlayer(player: Player, fieldSide: FieldSide) {    
    let action: Action = this.chooseAction(player, fieldSide);

    switch(action) {
      case Action.ADVANCE:
        this.advance(player, fieldSide);
      break;

      case Action.CHASE:
      break;
      
      case Action.CROSS:
      break;

      case Action.DRIBBLE:
        this.dribble(player);
      break;
      
      case Action.FORWARD_PASS:

      break;

      case Action.KICK:
        this.kick(player, fieldSide);
      break;
        
      case Action.MARK:
      break;

      case Action.PASS:
        this.pass(player, fieldSide);
      break;

      case Action.RETREAT:
        this.runBackward(player, fieldSide);
      break;

      case Action.STAY:
      break;

      case Action.TACKLE:
      break;
    }

    this.animationState = 'move';
  }

  

  chooseAction(player: Player, fieldSide: FieldSide) {
    let isAttacking = fieldSide == this.sideWithBall ? true : false;

    if (this.isPlayerWithBall(player.id)) {
      if (this.isPlayerCloseToGoal(player, fieldSide)) {
        return Action.KICK;
      }
      else if (this.isInFieldCorner(player, fieldSide)) {
        return Action.CROSS;
      }
      else {
        let opponentsInFront = this.getOpponentsInFront(player, fieldSide) as Player[];
        if (opponentsInFront.length) {
          return { action: Action.DRIBBLE, opponents: opponentsInFront };
          return Action.PASS;
        }
        else {
          let teammatesUpFront = this.getTeammatesUpFront(player, fieldSide) as Player[];
          if (teammatesUpFront.length) {
            return { action: Action.FORWARD_PASS, teammates: teammatesUpFront };
          }

          else {
            return Action.ADVANCE;
          }
        }        
      }
    }
    else if (isAttacking) {
      if (this.isInPositionLimit(player, fieldSide)) {
        return Action.STAY;
        return Action.RETREAT;
      }
      else {
        return Action.ADVANCE;
      }
    }
    else {
      if (this.opponentWithBallIsClose(player, fieldSide)) {
        if (this.isInRangeToTackle(player, fieldSide)) {
          return Action.TACKLE;
        }
        else {
          return Action.CHASE;
        }
      }
      else if (this.hasOpponentsClose(player, fieldSide)) {
        return Action.MARK;
      }
      else if (this.isInPositionLimit(player, fieldSide)) {
        return Action.STAY;
      }
      else {
        return Action.RETREAT;
      }
    }

    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;
    let playersInRangeToPass = this.getPlayersInRange(teamList, player,
      -20, 20, -20, 20);

    if (this.idPlayerWithBall != player.id) {
      if (this.sideWithBall == fieldSide)
        return Action.ADVANCE;
      else
        return Action.RETREAT;
    }
    
    
    else if (!playersInRangeToPass.length)
      return Action.ADVANCE;
    else
      return this.getRndInteger(1, 3) == 1 ? Action.PASS : Action.ADVANCE;
  }

  hasOpponentsClose(player: Player, fieldSide: FieldSide) {
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;

    let opponents = this.getPlayersInRange(againstTeamList, player, -10, 10, -10, 10);

    if (opponents.length)
      return true;
    else
      return false;
  }

  isInRangeToTackle(player: Player, fieldSide: FieldSide) {
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;

    let opponent = againstTeamList.find(p => p.id == this.idPlayerWithBall) as Player;

    if (opponent.x >= player.x - 5 && opponent.x <= player.x + 5 &&
        opponent.y >= player.y - 5 && opponent.y <= player.y + 5)
      return true;
    else 
      return false;
  }

  opponentWithBallIsClose(player: Player, fieldSide: FieldSide): boolean {
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;

    let opponent = againstTeamList.find(p => p.id == this.idPlayerWithBall) as Player;

    if (opponent.x >= player.x - 10 && opponent.x <= player.x + 10 &&
        opponent.y >= player.y - 10 && opponent.y <= player.y + 10)
      return true;
    else 
      return false;
  }

  isInPositionLimit(player: Player, fieldSide: FieldSide): boolean {
    let minX;
    let maxX;

    switch (player.position) {
      case Position.GOL:
        if (fieldSide == FieldSide.LEFT) {
          minX = 0;
          maxX = 17;
        }
        else {
          minX = 83;
          maxX = 100;
        }
        break;
      
      case Position.ZAG:
        if (fieldSide == FieldSide.LEFT) {
          minX = 0;
          maxX = 60;
        }
        else {
          minX = 40;
          maxX = 100;
        }
        break;

      case Position.MC:
        if (fieldSide == FieldSide.LEFT) {
          minX = 20;
          maxX = 80;
        }
        else {
          minX = 20;
          maxX = 80;
        }
        break;

      case Position.ATA:
        if (fieldSide == FieldSide.LEFT) {
          minX = 40;
          maxX = 100;
        }
        else {
          minX = 0;
          maxX = 60;
        }
        break;
    }

    if (player.x >= maxX - 5 || player.x <= minX + 5)
      return true;
    else
      return false;
  }
  
  haveTeammatesUpFront(player: Player, fieldSide: FieldSide): boolean {
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;

    let playersUpFront = 
      this.getPlayersInRange(teamList, player,
        fieldSide == FieldSide.LEFT ? 1 : -20,
        fieldSide == FieldSide.LEFT ? 20 : -1, 
        -20, 20);

    if (playersUpFront.length)
      return true;
    else
      return false;
  }

  getOpponentsInFront(player: Player, fieldSide: FieldSide) {
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;

    let playersInFront = 
      this.getPlayersInRange(againstTeamList, player,
        fieldSide == FieldSide.LEFT ? 1 : -5,
        fieldSide == FieldSide.LEFT ? 5 : -1, 
        -5, 5);


    return playersInFront;

    if (playersInFront.length)
      return true;
    else
      return false;
  }
  
  isInFieldCorner(player: Player, teamSide: FieldSide): boolean {
    let minTopX;
    let maxTopX;
    let minTopY;
    let maxTopY;

    let minBottomX;
    let maxBottomX;
    let minBottomY;
    let maxBottomY;

    if (teamSide == FieldSide.LEFT) {
      minTopX = 70;
      maxTopX = 100;
      minTopY = 0;
      maxTopY = 30;

      minBottomX = 70;
      maxBottomX = 100;
      minBottomY = 70;
      maxBottomY = 100;
    }
    else {
      minTopX = 0;
      maxTopX = 30;
      minTopY = 0;
      maxTopY = 30;

      minBottomX = 0;
      maxBottomX = 30;
      minBottomY = 70;
      maxBottomY = 100;
    }

    if (player.x >= minTopX && player.x <= maxTopX &&
        player.y >= minTopY && player.y <= maxTopY)
      return true;

    else if (player.x >= minBottomX && player.x <= maxBottomX &&
             player.y >= minBottomY && player.y <= maxBottomY)
      return true;
    
    else 
      return false;
  }

  advance(player: Player, fieldSide: FieldSide) {
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;

    let playersInRange = 
      this.getPlayersInRange(againstTeamList, player,
        fieldSide == FieldSide.LEFT ? 0 : -5,
        fieldSide == FieldSide.LEFT ? 5 : 0, 
        -5, 5);

    if (!playersInRange.length || this.idPlayerWithBall != player.id) {
      this.runForward(player, fieldSide);
    } else {
      this.dribble(player, playersInRange);
    }
  }

  dribble(player: Player, playersInRange: Player[]) {
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
      this.changeSideWithBall();
      this.setBallPosition(playerDribbled);
      console.log('o marcador está esperto, acertou o bote na hora');
    } else {
      console.log('que lindo drible!');
      this.setBallPosition(player);
    }
  }

  isPlayerCloseToGoal(player: Player, fieldSide: FieldSide) {
    let minXToKick;
    let maxXToKick;
    let minYToKick;
    let maxYToKick;

    if (fieldSide == FieldSide.LEFT) {
      minXToKick = 90;
      maxXToKick = 100;
    } else {
      minXToKick = 0;
      maxXToKick = 10;
    }

    minYToKick = 35;
    maxYToKick = 65;
    
    if (player.x >= minXToKick && player.x <= maxXToKick &&
        player.y >= minYToKick && player.y <= maxYToKick) {
      return true;
    }
    else {
      return false;
    }
  }

  isPlayerWithBall(playerId: number) {
    return this.idPlayerWithBall == playerId
  }

  kick(player: Player, fieldSide: FieldSide) {
    console.log(`kick: ${player.name} chutou a bola para o gol`);
    
    //verifica se acertou gol
    switch (this.getRndInteger(1, 2))
    {
      // se errou, verifica qual lado errou
      case 1:
        console.log('kick: errou o chute');

        this.ball = { 
          x: fieldSide == FieldSide.LEFT ? 
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

          let goalKeeper: Player = 
            fieldSide == this.homeTeamSide
            ? this.awayGoalKeeper
            : this.homeGoalKeeper;

          this.changeSideWithBall();
          this.setBallPosition(goalKeeper);
        } 
        else {
          console.log('kick: gooooooool');

          this.playerScored = player;

          this.ball = {
            x: fieldSide == FieldSide.LEFT ? 105 : -3,
            y: 50.5
          }

          this.isGoal = true;
        }
        break;
    }
  }

  pass(player: Player, fieldSide: FieldSide) {
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;

    let playersInRange = this.getPlayersInRange(teamList, player, 
      fieldSide == FieldSide.LEFT ? player.x - 20 : player.x,
      fieldSide == FieldSide.LEFT ? player.x : player.x + 20,
      player.y - 20, player.y + 20);

    let playerToPass = playersInRange[this.getRndInteger(0, playersInRange.length-1)];

    //TODO: verify if has any opponent near the playerToPass and verify if the pass occurs succesfully.

    this.setBallPosition(playerToPass);

    console.log(`${player.name} tocou a bola para ${playerToPass.name}`);
  }

  runForward(player: Player, fieldSide: FieldSide) {
    player.x += this.moveUnits * (fieldSide == FieldSide.LEFT ? 1 : -1);
    player.y += this.getRndInteger(-this.moveUnits, this.moveUnits);

    if (player.x < 0) player.x = 0;
    if (player.x > 100) player.x = 100;
    if (player.y < 0) player.y = 0;
    if (player.y > 100) player.y = 100;

    if (this.idPlayerWithBall == player.id)
      this.setBallPosition(player);
  }

  runBackward(player: Player, fieldSide: FieldSide) {
    if (player.x <= player.initialX - this.moveUnits ||
        player.x >= player.initialX + this.moveUnits) {
      player.x -= this.moveUnits * (fieldSide == FieldSide.LEFT ? 1 : -1);
    }

    if (player.y <= player.initialY - this.moveUnits ||
        player.y >= player.initialY + this.moveUnits) {
      player.y -= this.getRndInteger(-this.moveUnits, this.moveUnits);
    }

    if (player.x < 0) player.x = 0;
    if (player.x > 100) player.x = 100;
    if (player.y < 0) player.y = 0;
    if (player.y > 100) player.y = 100;
  }

  getPlayersInRange(list: Player[], player: Player, 
      minX: number, maxX: number, 
      minY: number, maxY: number) {
    return list.filter(p => p.id != player.id && 
      p.x >= player.x + minX && p.x <= player.x + maxX &&
      p.y >= player.y + minY && p.y <= player.y + maxY);
  }
  
  //#endregion

  //#region Utils

  getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  //#endregion

}

//#region Enum
enum Action {
  ADVANCE,
  CHASE,
  CROSS,
  DRIBBLE,
  FORWARD_PASS,
  KICK,
  MARK,
  PASS,
  RETREAT,
  STAY,
  TACKLE,
}

enum GoalKickSide {
  DOWN,
  UP
}

enum FieldSide {
  LEFT,
  RIGHT
}

//#endregion
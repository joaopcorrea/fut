import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
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

  public msToSimulate = 350;

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
        name: 'Gerard Piqu??',
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
        name: 'F??bio M.',
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
        name: 'O. Dembel??',
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
        name: 'Man??',
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
        name: 'Mbapp??',
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
    let action = this.chooseAction(player, fieldSide);

    switch(action.action) {
      case Action.ADVANCE:
        this.advance(player, fieldSide);
      break;

      case Action.CHASE:
        this.chase(player, fieldSide);
      break;

      case Action.DRIBBLE:
        this.dribble(player, action.opponents);
      break;

      case Action.KICK:
        this.kick(player, fieldSide);
      break;
        
      case Action.MARK:
        this.mark(player, fieldSide, action.opponents);
      break;

      case Action.PASS:
        this.pass(player, fieldSide, action.teammates);
      break;

      case Action.RETREAT:
        this.retreat(player, fieldSide);
      break;

      case Action.STAY:
      break;

      case Action.TACKLE:
        this.tackle(player, fieldSide);
      break;
    }

    this.animationState = 'move';
  }

  tackle(player: Player, fieldSide: FieldSide) {
    let againstTeamList = fieldSide == this.homeTeamSide ? 
      this.awayTeam : this.homeTeam;

    let opponent = againstTeamList
      .find(p => p.id == this.idPlayerWithBall) as Player;
    
    console.log(`${player.name} est?? tentando dar carrinho no ${opponent.name}`);
    
    if (fieldSide == FieldSide.LEFT)
      player.x += 3;
    else
      player.x -= 3;
    
    let random = Math.random();
    if (random >= .5) {
      this.changeSideWithBall();
      this.setBallPosition(player);
      console.log('carrinho lindo!');
    } else {
      console.log('errou o carrinho');
      this.setBallPosition(opponent);
    }
  }

  chase(player: Player, fieldSide: FieldSide) {
    let againstTeamList = fieldSide == this.homeTeamSide ? 
      this.awayTeam : this.homeTeam;

    let opponent = againstTeamList
      .find(p => p.id == this.idPlayerWithBall) as Player;

    if (opponent.x >= player.x - 3 && opponent.x <= player.x + 3 &&
        opponent.y >= player.y - 3 && opponent.y <= player.y + 3) {
      return;
    }

    let positions;
    
    if (fieldSide == FieldSide.LEFT) {
      positions = this.getMovePositions
        (player.x, player.y, opponent.x - 3, opponent.y); 
    }
    else {
      positions = this.getMovePositions
        (player.x, player.y, opponent.x + 3, opponent.y);
    }

    player.x += positions.x;
    player.y += positions.y;

    console.log(`${player.name} est?? perseguindo o ${opponent.name}`);
  }

  mark(player: Player, fieldSide: FieldSide, opponents: Player[] = []) {
    if (!opponents.length) {
      console.log('ERRO: n??o foi encontrado um oponente para marcar'); 
      return;
    }

    let opponent = this.getClosestPlayer(player, opponents) as Player;

    if (opponent.x >= player.x - 3 && opponent.x <= player.x + 3 &&
        opponent.y >= player.y - 3 && opponent.y <= player.y + 3) {
      return;
    }

    let positions = this.getMovePositions
      (player.x, player.y, 
        opponent.x  + fieldSide == FieldSide.LEFT ? -3 : 3, 
        opponent.y);

    player.x += positions.x;
    player.y += positions.y;

    console.log(`${player.name} est?? marcando o ${opponent.name}`);
  }

  getMovePositions(baseX: number, baseY: number, destX: number, destY: number) {
    let weightX = Math.abs(destX - baseX);
    let weightY = Math.abs(destY - baseY);

    if (weightX == 0 && weightY == 0) {
      return { x: 0, y: 0 };
    }

    let weightDistance = 1 / (weightX + weightY);

    let x = weightDistance * weightX * this.moveUnits;
    let y = weightDistance * weightY * this.moveUnits * 1.5; 

    if (destX < baseX) {
      x *= -1;
    }

    if (destY < baseY) {
      y *= -1;
    }
    
    return { x, y };
  }

  getClosestPlayer(playerBase: Player, playerList: Player[]): Player {
    let closest: { player: Player, distance: number }; 
    playerList
      .forEach(p => {
        let distance = Math.hypot(playerBase.x - p.x, playerBase.y - p.y);
        if (!closest)
          closest = { player: p, distance }
        else if (distance < closest.distance)
          closest.distance = distance;
      });

    return closest!.player;
  }

  chooseAction(player: Player, fieldSide: FieldSide): 
              { action: Action, opponents?: Player[], teammates?: Player[] } {
    let isAttacking = fieldSide == this.sideWithBall ? true : false;

    if (this.isPlayerWithBall(player.id)) {
      if (this.isPlayerCloseToGoal(player, fieldSide)) {
        let teammatesCloseFront = this.getTeammatesCloseFront(player, fieldSide) as Player[];
        if (teammatesCloseFront.length) {
          if (this.getRndInteger(1,10) >= 7) {
            return { action: Action.PASS, teammates: teammatesCloseFront };
          }
        }
        return { action: Action.KICK };
      }
      else if (this.isInFieldCorner(player, fieldSide)) {
        let teammatesInBox = this.getTeammatesInBox(player, fieldSide);
        if (teammatesInBox.length) {
          return { action: Action.PASS, teammates: teammatesInBox };
        }
      }

      let opponentsInFront = this.getOpponentsInFront(player, fieldSide) as Player[];
      if (opponentsInFront.length) {
        let teammatesCloseBehind = this.getTeammatesCloseBehind(player, fieldSide) as Player[];
        if (teammatesCloseBehind.length) {
          if (this.getRndInteger(1, 10) < 8) {
            return { action: Action.PASS, teammates: teammatesCloseBehind };
          }
        }
        else {
          let teammatesFarBehind = this.getTeammatesFarBehind(player, fieldSide) as Player[];
          if (teammatesFarBehind.length) {
            let rndPossibility = this.isPlayerInAttackingSide(player, fieldSide) ? 8 : 2;
            if (this.getRndInteger(1, 10) > rndPossibility) {
              return { action: Action.PASS, teammates: teammatesFarBehind };
            }
          }
        }
        return { action: Action.DRIBBLE, opponents: opponentsInFront };
      }
      else {
        let teammatesUpFront = this.getTeammatesUpFront(player, fieldSide) as Player[];
        if (teammatesUpFront.length) {
          return { action: Action.PASS, teammates: teammatesUpFront };
        }
        else {
          return { action: Action.ADVANCE };
        }
      }
    }
    else if (isAttacking) {
      if (this.isInFrontPosition(player, fieldSide)) {
        return { action: Action.RETREAT };
      }
      else {
        return { action: Action.ADVANCE };
      }
    }
    else {
      let distanceOpponentWithBall = this.getDistanceOpponentWithBall(player, fieldSide);
      if (distanceOpponentWithBall.isClose &&
          !distanceOpponentWithBall.isTeammateClose) {
        if (distanceOpponentWithBall.isInRangeToTackle) {
          return { action: Action.TACKLE };
        }
        else {
          return { action: Action.CHASE };
        }
      }
      else {
        let opponentsClose = this.getOpponentsClose(player, fieldSide);
        if (opponentsClose.length) {
          if (player.position != Position.ATA && player.position != Position.GOL)
            return { action: Action.MARK, opponents: opponentsClose };
        }

        if (this.isBehindPosition(player, fieldSide))
          return { action: Action.ADVANCE };
        else
          return { action: Action.RETREAT };

        // else if (this.isInPositionLimit(player, fieldSide)) {
        //   return { action: Action.STAY };
        // }
        // else {
          
        // }
      }
    }
  }

  getTeammatesInBox(player: Player, fieldSide: FieldSide) {
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;

    let minX;
    let maxX;
    let minY = 30;
    let maxY = 70;

    if (fieldSide == FieldSide.LEFT) {
      minX = 90;
      maxX = 100;
    }
    else {
      minX = 0;
      maxX = 10;
    }

    let teammates = 
      this.getPlayersInRange(teamList, player, minX, maxX, minY, maxY);

    return teammates;
  }

  isPlayerInAttackingSide(player: Player, fieldSide: FieldSide) {
    let minX = 0;
    let maxX = 50;

    if (fieldSide == FieldSide.LEFT) {
      minX = 51;
      maxX = 100;
    }

    return player.x >= minX && player.x <= maxX;
  }

  getTeammatesFarBehind(player: Player, fieldSide: FieldSide): Player[] {
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;

    let teammates = 
      this.getPlayersInRange(teamList, player,
        fieldSide == FieldSide.LEFT ? -40 : 0,
        fieldSide == FieldSide.LEFT ? 0 : 40, 
        -40, 40);

    return teammates;
  }

  getTeammatesCloseBehind(player: Player, fieldSide: FieldSide): Player[] {
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;

    let teammates = 
      this.getPlayersInRange(teamList, player,
        fieldSide == FieldSide.LEFT ? -20 : 0,
        fieldSide == FieldSide.LEFT ? 0 : 20, 
        -20, 20);

    return teammates;
  }

  getOpponentsClose(player: Player, fieldSide: FieldSide) {
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;

    let opponents = this.getPlayersInRange(againstTeamList, player, -10, 10, -10, 10);

    opponents = opponents.filter(o => {
      if (teamList.find(t => t.id != player.id &&
        t.x >= o.x - 3 && t.x <= o.x + 3 && 
        t.y >= o.y - 3 && t.y <= o.y + 3))
        return false;
      else
        return true;
    } );

    return opponents;
  }

  getDistanceOpponentWithBall(player: Player, fieldSide: FieldSide) {
    if (!this.idPlayerWithBall)
      return { isClose: false, isInRangeToTackle: false };
    
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam; 

    let opponent = againstTeamList.find(p => p.id == this.idPlayerWithBall) as Player;

    let isClose = false;
    let isInRangeToTackle = false;
    let isTeammateClose = false;

    if (opponent.x >= player.x - 20 && opponent.x <= player.x + 20 &&
        opponent.y >= player.y - 20 && opponent.y <= player.y + 20) 
    {    
      isClose = true;

      if (teamList.find(p => p.id != player.id &&
          p.x >= opponent.x - 3 && p.x <= opponent.x + 3 &&
          p.y >= opponent.y - 3 && p.y <= opponent.y + 3))
        isTeammateClose = true;

      let minX, maxX, minY, maxY;
      if (fieldSide == FieldSide.LEFT) {
        minX = player.x - 3;
        maxX = player.x + 3;
      }
      else {
        minX = player.x - 3;
        maxX = player.x + 3;
      }
      minY = player.y - 3;
      maxY = player.y + 3;

      if (opponent.x >= minX && opponent.x <= maxX &&
          opponent.y >= minY && opponent.y <= maxY)
        isInRangeToTackle = true;
    }

    return { isClose, isInRangeToTackle, isTeammateClose };
  }

  isBehindPosition(player: Player, fieldSide: FieldSide) {
    const position = this.getPlayerPosition(player, fieldSide);
    
    if (fieldSide == FieldSide.LEFT)
      return player.x < position.minX;
    else
      return player.x > position.maxX;
  }

  isInFrontPosition(player: Player, fieldSide: FieldSide) {
    const position = this.getPlayerPosition(player, fieldSide);
    
    if (fieldSide == FieldSide.LEFT)
      return player.x > position.maxX;
    else
      return player.x < position.minX;
  }

  getPlayerPosition(player: Player, fieldSide: FieldSide) {
    let minX;
    let maxX;

    switch (player.position) {
      case Position.GOL:
        if (fieldSide == FieldSide.LEFT) {
          minX = 0;
          maxX = 5;
        }
        else {
          minX = 95;
          maxX = 100;
        }
        break;
      
      case Position.ZAG:
        if (fieldSide == FieldSide.LEFT) {
          minX = this.ball.x - 30;
          maxX = this.ball.x - 30;
        }
        else {
          minX = this.ball.x + 30;
          maxX = this.ball.x + 30;
        }
        break;

      case Position.MC:
        if (fieldSide == FieldSide.LEFT) {
          minX = this.ball.x - 20;
          maxX = this.ball.x ;
        }
        else {
          minX = this.ball.x;
          maxX = this.ball.x + 20;
        }
        break;

      case Position.ATA:
        if (fieldSide == FieldSide.LEFT) {
          minX = this.ball.x + 10;
          maxX = this.ball.x + 20;
        }
        else {
          minX = this.ball.x - 20;
          maxX = this.ball.x - 10;
        }
        break;
    }

    if (minX < 0) minX = 0;
    if (maxX > 100) maxX = 100;

    return { minX, maxX };
  }

  getTeammatesCloseFront(player: Player, fieldSide: FieldSide) {
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;

    let playersCloseFront = 
      this.getPlayersInRange(teamList, player,
        fieldSide == FieldSide.LEFT ? 3 : -20,
        fieldSide == FieldSide.LEFT ? 20 : -3, 
        -20, 20);

    return playersCloseFront;
  }
  
  getTeammatesUpFront(player: Player, fieldSide: FieldSide) {
    let teamList = fieldSide == this.homeTeamSide ? this.homeTeam : this.awayTeam;

    let playersUpFront = 
      this.getPlayersInRange(teamList, player,
        fieldSide == FieldSide.LEFT ? 1 : -20,
        fieldSide == FieldSide.LEFT ? 20 : -1, 
        -30, 30);

    return playersUpFront;
  }

  getOpponentsInFront(player: Player, fieldSide: FieldSide) {
    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;

    let playersInFront = 
      this.getPlayersInRange(againstTeamList, player,
        fieldSide == FieldSide.LEFT ? 1 : -5,
        fieldSide == FieldSide.LEFT ? 5 : -1, 
        -5, 5);

    return playersInFront;
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
      minTopX = 90;
      maxTopX = 100;
      minTopY = 0;
      maxTopY = 20;

      minBottomX = 90;
      maxBottomX = 100;
      minBottomY = 80;
      maxBottomY = 100;
    }
    else {
      minTopX = 0;
      maxTopX = 10;
      minTopY = 0;
      maxTopY = 20;

      minBottomX = 0;
      maxBottomX = 10;
      minBottomY = 80;
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
    if (this.isPlayerInArea(player, fieldSide)) {
      let position = this.getMovePositions(player.x, player.y, 
        fieldSide == FieldSide.LEFT ? 100 : 0, 50);

      player.x += position.x;
      player.y += position.y;
    }
    else {
      let moveY = this.getRndInteger(0, this.moveUnits * 5) / 10;
      let moveX = this.moveUnits - moveY;
      moveY *= 1.5;
      if (fieldSide == FieldSide.RIGHT) moveX *= -1;
      if (this.getRndInteger(1,2) == 1) moveY *= -1;

      player.x += moveX;
      player.y += moveY;
    }

    if (player.x < 0) player.x = 0;
    if (player.x > 100) player.x = 100;
    if (player.y < 0) player.y = 0;
    if (player.y > 100) player.y = 100;

    if (this.idPlayerWithBall == player.id)
      this.setBallPosition(player);
  }

  isPlayerInArea(player: Player, fieldSide: FieldSide) {
    let minX;
    let maxX;
    // let minY = 15;
    // let maxY = 85;
    let minY = 0;
    let maxY = 100;

    if (fieldSide == FieldSide.LEFT) {
      minX = 80;
      maxX = 100;
    }
    else {
      minX = 0;
      maxX = 20;
    }
    
    return player.x >= minX && player.x <= maxX &&
           player.y >= minY && player.y <= maxY
  }

  dribble(player: Player, opponentsInRange: Player[] = []) {
    if (!opponentsInRange.length) {
      console.log('ERRO: n??o foi encontrado um oponente para driblar'); 
      return;
    }

    let opponent = opponentsInRange[this.getRndInteger(0, opponentsInRange.length - 1)]
    
    console.log(`${player.name} est?? tentando driblar ${opponent.name}`);
    
    let tempX = player?.x;
    let tempY = player?.y;
    
    player.x = opponent.x;
    player.y = opponent.y;
    
    opponent.x = tempX;
    opponent.y = tempY;
    
    let random = Math.random();
    if (random >= .5) {
      this.changeSideWithBall();
      this.setBallPosition(opponent);
      console.log('o marcador est?? esperto, acertou o bote na hora');
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
      minXToKick = 85;
      maxXToKick = 100;
    } else {
      minXToKick = 0;
      maxXToKick = 15;
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
    switch (this.getRndInteger(1, 3))
    {
      // se errou, verifica qual lado errou
      case 1:
        console.log('kick: errou o chute');

        this.idPlayerWithBall = 0;

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
      case 3:
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

          this.idPlayerWithBall = 0;

          this.playerScored = player;

          this.ball = {
            x: fieldSide == FieldSide.LEFT ? 105 : -3,
            y: 50.5
          }

          this.isGoal = true;
        }
        break;
    }

    this.animationState = 'move';  
  }

  pass(player: Player, fieldSide: FieldSide, teammates: Player[] = []) {
    if (!teammates.length) {
      console.log('ERRO: n??o foi encontrado um companheiro para tocar'); 
      return;
    }
    
    let teammate = teammates[this.getRndInteger(0, teammates.length-1)];

    let againstTeamList = fieldSide == this.homeTeamSide ? this.awayTeam : this.homeTeam;
    let opponentsClose = this.getPlayersInRange(againstTeamList, teammate, -5, 5, -5, 5);
    if (opponentsClose.length) {
      if (this.getRndInteger(1, 10) >= 8) {
        let opponent = opponentsClose[this.getRndInteger(0, opponentsClose.length-1)];
        this.changeSideWithBall();
        this.setBallPosition(opponent);
        console.log(`${player.name} errou o toque e ${opponent.name} pegou a bola`);
        return;
      }
    }

    this.setBallPosition(teammate);
    console.log(`${player.name} tocou a bola para ${teammate.name}`);

    this.animationState = 'move';  
  }

  retreat(player: Player, fieldSide: FieldSide) {
    const playerPosition = this.getPlayerPosition(player, fieldSide);

    const position = this.getMovePositions(player.x, player.y, 
      player.initialX,
      player.initialY);

    player.x += position.x;
    player.y += position.y;

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
  DRIBBLE,
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
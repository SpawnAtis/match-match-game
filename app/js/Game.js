import GameField from './GameField';

class Game {
  constructor() {
    this.gameField = null;
    this.settings = { gameField: null }; // в дальнейшем можно добавлять настройки игры
  }

  start() {
    const difficultysInf = document.querySelector('.difficultys__item--active').dataset;
    this.settings.gameField = {
      width: difficultysInf.countOfColumns,
      height: difficultysInf.countOfRows,
      cardShortName: document.querySelector('.shirts__item--active').dataset.shirtName,
    };

    this.createGameField();
    this.gameField.generateCardsStyles();
  }

  createGameField() {
    const gameFieldDOM = document.createElement('div');
    gameFieldDOM.className = 'game_field';
    gameFieldDOM.style.setProperty('--count-of-columns', this.settings.gameField.width);

    document.querySelector('.game-lobby').appendChild(gameFieldDOM);
    this.gameField = new GameField(this.settings.gameField);
    this.gameField.fill();
  }

  restart() {
    const gameLobbyDOM = document.querySelector('.game-lobby');
    gameLobbyDOM.innerHTML = '';
    if (this.gameField.gameTimer) {
      this.gameField.gameTimer.stop();
      this.gameField.gameTimer.reset();
    }
    this.createGameField();
  }

  static updateScoreList() {}
}

export default Game;

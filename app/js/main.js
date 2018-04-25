import whenReady from './whenReady';
import GameEventsInterface from './GameEventsInterface';
import Game from './Game';

const getGameElements = () => {
  const elements = {
    authorizationField: document
      .getElementById('authorization_doc')
      .import.querySelector('.authorization-field'), // поле авторизации
    gameRulesModalWindow: document
      .getElementById('game_rules_modal_doc')
      .import.querySelector('.modal_window--game_rules'), // модальное окно правил игры
    winnerModalWindow: document
      .getElementById('winner_modal_doc')
      .import.querySelector('.modal_window--winner'), // модальное окно победителя
    userProfile: document.querySelector('.header__user_profile'), // меню-профиль пользователя
    exitGameBtn: document.querySelector('.exit_game_button'), // кнопка закрытия игры
    gameRulesBtn: document.querySelector('.game_rules_button'), // кнопка открытия правил игры
    shirtsList: document.querySelector('.shirts'), // выбор рубашек карт
    difficultysList: document.querySelector('.difficultys'), // выбор сложности игры
    scoreTable: document.querySelector('.score_table'), // таблица результатов
  };
  return elements;
};

const main = () => {
  const game = new Game();
  const gameInterfaceEvents = new GameEventsInterface(getGameElements(), game);

  gameInterfaceEvents.initGameRulesModalWindow();
  gameInterfaceEvents.initWinnerModalWindow();
  gameInterfaceEvents.initScoreList();
  // if user has already authorized
  if (localStorage.getItem('user')) {
    gameInterfaceEvents.showUserProfile();
    game.start();
  } else {
    gameInterfaceEvents.showAuthorizationField(); // показать поле авторизации
    document.querySelector('.form-authorization').addEventListener('submit', () => {
      // только после того как пользователь валидно заполнит форму и нажмёт "Start",
      // начнётся инициализаци игры
      const promise = new Promise(resolve => {
        gameInterfaceEvents.signIn();
        resolve('Vse ok');
      });
      promise.then(result => {
        console.log(`Fulfilled: ${result}`); // result - аргумент resolve
        game.start();
      });
    });
  }
};

whenReady(main);
// document.getElementById('exitGameBtn').addEventListener('click', gameElements.closeGame);

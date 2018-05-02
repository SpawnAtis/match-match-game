class GameInterfaceEvents {
  constructor(elements, game) {
    ({
      authorizationField: this.authorizationField,
      gameRulesModalWindow: this.gameRulesModalWindow,
      winnerModalWindow: this.winnerModalWindow,
      userProfile: this.userProfile,
      exitGameBtn: this.exitGameBtn,
      gameRulesBtn: this.gameRulesBtn,
      shirtsList: this.shirtsList,
      difficultysList: this.difficultysList,
      scoreTable: this.scoreTable,
    } = elements);
    this.game = game;

    this.showWinnerModalWindow = this.showWinnerModalWindow.bind(this);
    this.signIn = this.signIn.bind(this);
    this.selectUserProfileOptions = this.selectUserProfileOptions.bind(this);

    this.selectGameOptions = this.selectGameOptions.bind(this);
    this.shirtsList.addEventListener('click', this.selectGameOptions);
    this.difficultysList.addEventListener('click', this.selectGameOptions);

    this.userProfile
      .querySelector('.user_profile_menu')
      .addEventListener('click', this.selectUserProfileOptions);
  }

  selectGameOptions(event) {
    const { target } = event;
    const difficultysItemClassName = `.${this.difficultysList.className}__item`;
    const shirtsItemClassName = `.${this.shirtsList.className}__item  `;
    const selectedItem =
      target.closest(difficultysItemClassName) || target.closest(shirtsItemClassName);

    if (selectedItem) {
      const gameOptionName = selectedItem.parentNode.className;
      const activeItemStyleName = `${gameOptionName}__item--active`;

      const currentActiveItem = selectedItem.parentNode.querySelector(`.${activeItemStyleName}`);
      currentActiveItem.classList.remove(activeItemStyleName);
      selectedItem.classList.add(activeItemStyleName);

      // если игра уже запущена - меняем настройки игры
      if (document.querySelector('.game_field') !== null) {
        this.changeGameSettings(gameOptionName);
      }
    }
  }

  changeGameSettings(gameOptionName) {
    const responsibleItemDOM = document.querySelector(`.${gameOptionName}__item--active`);
    switch (gameOptionName) {
      case 'difficultys':
        this.game.settings.gameField.width = responsibleItemDOM.dataset.countOfColumns;
        this.game.settings.gameField.height = responsibleItemDOM.dataset.countOfRows;
        this.game.restart();
        break;
      case 'shirts':
        this.game.gameField.setShirtCard(responsibleItemDOM.dataset.shirtName);
        break;
      default:
        break;
    }
  }

  selectUserProfileOptions(event) {
    const { target } = event;
    const selectedOption = target.closest('.profile_menu_link');

    switch (selectedOption.dataset.action) {
      case 'signOut':
        this.signOut();
        break;
      default:
        break;
    }
  }

  saveUserCredentials() {
    const firstName = this.authorizationField.querySelector('.firstName-field').value;
    const secondName = this.authorizationField.querySelector('.secondName-field').value;
    const email = this.authorizationField.querySelector('.email-field').value;

    const user = {
      firstName,
      secondName,
      email,
    };
    localStorage.setItem('user', JSON.stringify(user));
  }

  showUserProfile() {
    const profileLinkUserFullName = this.userProfile.querySelector('.profile_link__user_fullName');
    const user = JSON.parse(localStorage.getItem('user'));
    profileLinkUserFullName.appendChild(document.createTextNode(`${user.firstName} ${user.secondName}`));
    this.userProfile.style.visibility = 'visible';
  }

  showAuthorizationField() {
    document.querySelector('.game-lobby').appendChild(this.authorizationField);
  }

  // closeGame() {
  //   window.open('', '_self').close();
  // }

  signIn() {
    // event.preventDefault(); // disable page refreshing
    this.saveUserCredentials();
    this.showUserProfile();
    this.authorizationField.remove();
  }

  signOut() {
    localStorage.removeItem('user');
    this.userProfile.querySelector('.profile_link__user_fullName').firstChild.remove();
    this.userProfile.style.visibility = 'hidden';
    this.game.gameField.gameTimer.hide();
    this.game.gameField.gameFieldDOM.remove();
    this.showAuthorizationField();
  }

  initScoreList() {
    const scoreList = JSON.parse(localStorage.getItem('scoreList'));
    if (scoreList) {
      for (let i = 0; i < scoreList.length; i++) {
        this.addGameResult.call(this.scoreTable, scoreList[i], i);
      }
    } else {
      localStorage.setItem('scoreList', JSON.stringify([]));
    }
  }

  addGameResult({ fullName, score, time }, number) {
    // this = scoreTableDOM
    const row = this.tBodies[0].insertRow(number);
    const cellFullName = row.insertCell(0);
    cellFullName.innerHTML = fullName;
    const cellScore = row.insertCell(1);
    cellScore.innerHTML = score;
    const cellTime = row.insertCell(2);
    cellTime.innerHTML = time;
  }

  updateScoreList(time) {
    const scoreTableDOM = document.querySelector('.score_table');

    const factors = {
      easy: 10,
      medium: 20,
      hard: 30,
      nightmare: 40,
    };
    const difficulty = document.querySelector('.difficultys__item--active').dataset.value;
    const x = factors[difficulty];
    const y = time.ms / 3600000;
    const score = ~~(x / y);

    const user = JSON.parse(localStorage.getItem('user'));
    const fullName = `${user.firstName} ${user.secondName}`;
    const scoreList = JSON.parse(localStorage.getItem('scoreList'));

    scoreList.push({ time: time.onOutput, score, fullName });
    scoreList.sort((a, b) => b.score - a.score);
    if (scoreList.length > 10) scoreList.pop();
    scoreTableDOM.tBodies[0].innerHTML = '';
    for (let i = 0; i < scoreList.length; i++) {
      this.addGameResult.call(scoreTableDOM, scoreList[i], i);
    }

    localStorage.setItem('scoreList', JSON.stringify(scoreList));
    return score;
  }

  initGameRulesModalWindow() {
    document.body.appendChild(this.gameRulesModalWindow);
    this.gameRulesBtn.addEventListener(
      'click',
      this.changeModalWindowState.bind(this.gameRulesModalWindow, {
        stateName: 'expand',
        flag: 'open',
      }),
    );
    this.gameRulesModalWindow.addEventListener(
      'click',
      this.changeModalWindowState.bind(this.gameRulesModalWindow, {
        stateName: 'collapse',
        flag: 'close',
      }),
    );
  }

  initWinnerModalWindow() {
    document.body.appendChild(this.winnerModalWindow);
    this.winnerModalWindow
      .querySelector('.play_again_btn')
      .addEventListener('click', this.playAgainBtnHandler.bind(this));
  }

  playAgainBtnHandler() {
    this.changeModalWindowState.call(this.winnerModalWindow, {
      stateName: 'runaway',
      flag: 'close',
    });
    this.game.restart();
  }

  showWinnerModalWindow(results) {
    const { score, time } = results;
    const modalWindow = document.querySelector('.modal_window--winner');
    modalWindow.querySelector('.results_time').innerHTML = time;
    modalWindow.querySelector('.results_score').innerHTML = score;
    this.changeModalWindowState.call(modalWindow, {
      stateName: 'run',
      flag: 'open',
    });
  }

  // stateName - название анимации(на открытие/закрытие), flag - открыть/закрыть
  changeModalWindowState({ stateName, flag }) {
    this.dataset.state = stateName;
    switch (flag) {
      case 'open':
        document.body.classList.add('modal-active');
        break;
      case 'close':
        document.body.classList.remove('modal-active');
        break;
      default:
        break;
    }
  }

  winningHandler(time) {
    const score = this.updateScoreList(time);
    setTimeout(() => {
      this.showWinnerModalWindow({ time: time.onOutput, score });
    }, 1500);
  }
}

export default GameInterfaceEvents;

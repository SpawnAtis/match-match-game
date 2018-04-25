import Card from './Card';
import Timer from '../common/blocks/timer/Timer';
import GameEventsInterface from './GameEventsInterface';

class GameField {
  constructor({ cardShortName, width, height }) {
    this.gameFieldDOM = document.querySelector('.game_field');
    this.cardShortName = cardShortName;
    this.countOfCards = width * height;
    this.cardTocompare = undefined; // карта ,с которой сраниваются кликнутые
    this.gameTimer = new Timer(document.querySelector('.timer'), 40);
    // стили карт
    this.imgs = [
      'brint',
      'curry',
      'davis',
      'duncan',
      'granger',
      'griffin',
      'harden',
      'iguodala',
      'irving',
      'jordan',
      'mello',
      'nowitzky',
      'rose',
      'wade',
      'wall',
    ];
  }

  fill() {
    this.setShirtCard(this.cardShortName);

    const cardPattern = document.createElement('div');
    cardPattern.className = 'game_field__card';
    cardPattern.dataset.animationStyle = 'none';

    const randomValues = this.generateRandomValues();
    randomValues.forEach(unickNumber => {
      // создаём элементы для каждой пары карточек и  применяем к ним стиль
      // индекс стиля в массиссиве indexOf(style) = unickNumber
      const cardDOM = cardPattern.cloneNode(true);
      cardDOM.classList.add(`card_${this.imgs[unickNumber]}`);
      this.gameFieldDOM.appendChild(cardDOM);
    });

    // вешаем обработчик кликов на grid-контейнер с карточками
    this.clickOnCard = this.clickOnCard.bind(this);
    this.clickOnCard.isItfirstClick = true; // при первом клике запуститься таймер
    this.gameFieldDOM.addEventListener('click', this.clickOnCard);
  }

  compare(selectedCardDOM) {
    // стиль, который отвечает за url с картинкой
    const selectedCardStyleClass = selectedCardDOM.classList[1];
    // получаем стиль картинки
    const selectedCardStyle = selectedCardStyleClass.slice(selectedCardStyleClass.indexOf('_') + 1);
    const selectedCard = new Card(this.imgs.indexOf(selectedCardStyle), selectedCardDOM);

    switch (this.cardTocompare) {
      case undefined: // открыли первую карту
        this.cardTocompare = selectedCard;
        selectedCard.show();
        break;
      default:
        // вторую
        if (
          this.cardTocompare.value === selectedCard.value &&
          this.cardTocompare.cardDOM !== selectedCard.cardDOM
        ) {
          // если карты совпадают
          this.countOfCards += -2;
          selectedCard.remove(true); // показываем и удаляем
          this.cardTocompare.remove(false); // просто удаляем
        } else if (this.cardTocompare.value !== selectedCard.value) {
          // не совпадают
          selectedCard.hide(true); // показываем и прячем карту
          this.cardTocompare.hide(false); // просто прячем
        } else {
          selectedCard.hide(false); // кликнули 2 раза по одной и той же карте
        }
        this.cardTocompare = undefined;
        break;
    }

    // win
    if (!this.countOfCards) {
      this.gameTimer.stop();
      // Game.updateScoreList();
      let result = {};
      GameEventsInterface.prototype.showWinnerModalWindow(result);
    }
  }

  runGameTimer() {
    this.gameTimer.timerDOM.style.visibility = 'visible';
    this.gameTimer.start();
  }

  clickOnCard(event) {
    if (this.clickOnCard.isItfirstClick) {
      this.runGameTimer();
      this.clickOnCard.isItfirstClick = false;
    }
    const { target } = event;
    const isContains = target.classList.contains('game_field__card');
    if (!isContains) return;
    this.compare(target);
  }

  // заполняет массив парными значениями и рандомит их
  generateRandomValues() {
    const values = Array.from({ length: this.countOfCards }, (v, k) => Math.floor(k / 2)).sort(
      () => Math.random() - 0.5
    );
    return values;
  }

  // генерация стилей, которые содержат css перменную со значением юрла до изображения
  generateCardsStyles() {
    const style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);

    this.imgs.forEach((item, index) => {
      const rule = `--card-front: url('../resources/img/cards-fronts/${item}.jpg');`;
      style.sheet.insertRule(`.card_${item} {${rule}}`, index);
    });
  }

  setShirtCard(shirtName) {
    this.gameFieldDOM.style.setProperty(
      '--card-shirt',
      `url("../resources/img/shirts/${shirtName}.png")`
    );
  }
}

export default GameField;

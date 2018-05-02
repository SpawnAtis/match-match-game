class Card {
  constructor(value, cardDOM) {
    this.value = value; // уникальное значение карточки
    this.cardDOM = cardDOM;
  }

  flip() {
    this.setAnimation('flip');
  }

  showAndHide() {
    setTimeout(() => {
      this.setAnimation('flip');
    }, 500);
    this.setAnimation('flip');
  }

  remove(firstShow) {
    if (firstShow) {
      // если нужно показать и удалить
      setTimeout(() => {
        this.setAnimation('getOut');
      }, 500);
      this.setAnimation('flip');
    } else this.setAnimation('getOut'); // если нужно только удалить
  }

  setAnimation(animation) {
    this.offsetWidth = undefined;
    this.cardDOM.classList.toggle(animation);
  }
}

export default Card;

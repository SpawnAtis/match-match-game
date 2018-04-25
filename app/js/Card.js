class Card {
  constructor(value, cardDOM) {
    this.value = value; // уникальное значение карточки
    this.cardDOM = cardDOM;
  }

  show() {
    this.setAnimation('flipIn');
  }

  hide(firstShow) {
    let time;
    if (firstShow) {
      // если нужно показать и спрятать
      this.setAnimation('flipInOut');
      time = 2000; // 2000
    } else {
      // если нужно только спрятать
      this.setAnimation('flipOut');
      time = 1000; // 1000
    }
    setTimeout(() => {
      // таймаут нужен, чтобы дать завершиться перевороту
      this.cardDOM.dataset.animationStyle = 'none';
    }, time);
  }

  remove(firstShow) {
    if (firstShow) {
      // если нужно показать и удалить
      this.setAnimation('showAndRemove');
    } else this.setAnimation('getOut'); // если нужно только удалить
    // this.cardDOM.onclick = () => {};
  }

  setAnimation(animationName) {
    this.cardDOM.dataset.animationStyle = 'none';
    if (animationName === 'showAndRemove') this.cardDOM.style.visibility = 'hidden';
    void this.offsetWidth;
    this.cardDOM.dataset.animationStyle = animationName;
  }
}

export default Card;

class Timer {
  constructor(timerDOM, delay) {
    this.timerDOM = timerDOM;
    this.delay = delay;
    this.isOn = false;
    this.time = 0;
    this.interval = null;
    this.offset = null;
  }

  start() {
    if (!this.isOn) {
      this.timerDOM.style.visibility = 'visible';
      this.interval = setInterval(() => this.update(), this.delay);
      this.offset = Date.now();
      this.isOn = true;
    }
  }

  stop() {
    if (this.isOn) {
      clearInterval(this.interval);
      this.interval = null;
      this.isOn = false;
    }
  }

  hide() {
    this.stop();
    this.reset();
    this.timerDOM.style.visibility = 'hidden';
  }

  reset() {
    this.time = 0;
    this.update();
  }

  delta() {
    const now = Date.now();
    const timePassed = now - this.offset;
    this.offset = now;
    return timePassed;
  }

  update() {
    if (this.isOn) this.time += this.delta();
    const formattedTime = this.timeFormater();
    this.timerDOM.textContent = formattedTime;
  }

  timeFormater() {
    const time = new Date(this.time);
    let minutes = time.getMinutes().toString();
    let seconds = time.getSeconds().toString();
    let milliseconds = time.getMilliseconds().toString();

    if (minutes.length < 2) {
      minutes = `0${minutes}`;
    }

    if (seconds.length < 2) {
      seconds = `0${seconds}`;
    }

    while (milliseconds.length < 3) {
      milliseconds = `0${milliseconds}`;
    }

    return `${minutes} : ${seconds} . ${milliseconds}`;
  }
}

export default Timer;

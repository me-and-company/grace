class ClickDummy {
  constructor(element) {
    this.$element = element;

    this._counter = 0;
    Object.defineProperty(this, 'dummyCounter', {
      value: 10,
      writable: true,
    });

    this.bindEvents();
  }


  // GETTER
  get counter() {
    return this._counter;
  }


  // SETTER
  set counter(number) {
    console.log(number);
    this._counter = number;
  }


  // METHODS
  clicked() {
    this.changeBackgroundColor();
    this.counter += 1;
    this.dummyCounter += 1;
  }

  changeBackgroundColor() {
    const bgColor = this.$element.getAttribute('data-bgcolor');
    this.$element.style.backgroundColor = bgColor;
  }

  bindEvents() {
    this.$element.addEventListener('click', this.clicked.bind(this));
  }
}

document.querySelectorAll('.dummy').forEach((item) => {
  const clickDummy = new ClickDummy(item);
  setTimeout(() => {
    console.log(clickDummy.counter);
    console.log(clickDummy.dummyCounter);
  }, 3000);
});

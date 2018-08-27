
class TemplateClass {
  constructor(element, ...options) {
    this.defaults = {
      // set your default options here
      defaultoption: '',
    };

    this.element = element;
    this.options = Object.assign({}, this.defaults, ...options);

    this.init();
  }

  init() {
    // init everything needed and call methods
    this.bindEvents();
  }

  // your methods here

  bindEvents() {
    // add event listeners
    this.element.addEventListener('click');
  }
}

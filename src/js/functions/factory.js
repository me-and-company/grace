function graceProduce(selector, Subject, ...params) {
  if (typeof selector === 'string' && typeof Subject === 'function') {
    [].slice.call(document.querySelectorAll(selector)).forEach((el) => {
      return new Subject(el, ...params);
    });
  }
}

function graceCreate(selector, Subject, ...params) {
  return new Subject(document.querySelectorAll(selector), ...params);
}

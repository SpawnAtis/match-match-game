// минута наркомании....))
const whenReady = (() => {
  let funcs = [];
  let ready = false;

  const handler = (e) => {
    // Если обработчик уже вызывался, просто вернуть управление
    if (ready) return;

    // Если это событие readystatechange и состояние получило значение,
    // отличное от "complete", значит, документ пока не готов
    if (e.type === 'readystatechange' && document.readyState !== 'complete') return;

    // Вызвать все зарегистрированные функции.
    // каждый раз проверяется значение
    // свойство funcs.length, на случай если одна из вызванных функций
    // зарегистрирует дополнительные функции.
    for (let i = 0; i < funcs.length; i++) funcs[i].call(document);

    // Теперь можно установить флаг ready в значение true и забыть
    // о зарегистрированных функциях
    ready = true;
    funcs = null;
  };

  // Зарегистрировать обработчик handler для всех ожидаемых событий
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false);
    document.addEventListener('readystatechange', handler, false);
    window.addEventListener('load', handler, false); // т.к. load вызывается после readystatechange ( когда readyState = complete)
  } else if (document.attachEvent) {
    // Если IE
    document.attachEvent('onreadystatechange', handler);
    window.attachEvent('onload', handler);
  }

  const onReady = (f) => {
    if (ready) {
      f.call(document); // Вызвать функцию, если документ готов
    } else funcs.push(f); // Иначе добавить ее в очередь, чтобы вызвать позже
  };

  return onReady;
})();

export default whenReady;

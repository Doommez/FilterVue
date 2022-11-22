import {onBeforeUnmount} from 'vue';

export const useClickOutside = () => {
  const listeners = [];

  const getListenerIndex = (key) => {
    const indexListener = listeners.findIndex((listener) => listener.key === key);
    if (indexListener === -1) {
      return true;
    }
    return indexListener;
  };

  const destroyClickOutsideListener = (key) => {
    const listenerIndex = getListenerIndex(key);
    if (!listenerIndex || listenerIndex === 0) {
      const listener = listeners[listenerIndex];
      document.removeEventListener('click', listener.handler);
      listeners.splice(listenerIndex, 1);
    }
  };

  const createClickOutsideListener = ({key, node, callback}) => {
    const listenerIndex = getListenerIndex(key);
    if (listenerIndex || getListenerIndex(key) !== 0) {
      const listener = {
        key,
        node,
        callback,
        handler: (e) => {
          if (!node.contains(e.target)) {
            callback();
            destroyClickOutsideListener(key);
          }
        },
      };
      document.addEventListener('click', listener.handler);
      listeners.push(listener);
    }
  };



  onBeforeUnmount(() => {
    listeners.forEach((listener) => {
      destroyClickOutsideListener(listener.key);
    });
  });


  return {
    createClickOutsideListener,
    destroyClickOutsideListener,
  };
};

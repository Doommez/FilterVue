import {onBeforeUnmount} from 'vue';


export const useClickOutside = () => {
  const listeners = [];
  // const listInstance = {
  //   node,
  //   callback,
  //   handler,
  //   key,
  // };
  // [{lisener}, {listner}, {listner}];

  // const clickOutside = (node, callback, e) => {
  //   if (!node.contains(e.target)) {
  //     callback();
  //   }
  // };

  // const init = (node, callback, key) => {
  //   if (listeners.indexOf(key) === -1) {
  //     console.log(node, callback, key);
  //     listeners.push({
  //       key,
  //       node,
  //       callback,
  //       handler: (e) => {
  //         console.log(e);
  //         if (!node.contains(e.target)) {
  //           e.stopPropagation();
  //           callback();
  //         }
  //       },
  //     });
  //   }
  // };

  const getListenerIndex = (key) => {
    const indexListener = listeners.findIndex((listener) => listener.key === key);
    if (indexListener === -1) {
      return true;
    }
    return indexListener;
  };

  const clickOutside = (key, node, callback) => {
    if (getListenerIndex(key) || getListenerIndex(key) !== 0) {
      console.log(key, node, callback, getListenerIndex(key));
      const listener = {
        key,
        node,
        callback,
        handler: (e) => {
          if (!node.contains(e.target)) {
            callback();
          }
        },
      };
      document.addEventListener('click', listener.handler);
      listeners.push(listener);
    }
  };

  const destroyListener = (key) => {
    const indexListener = getListenerIndex(key);
    if (indexListener !== -1 || indexListener === 0) {
      const listener = listeners[indexListener];
      document.removeEventListener('click', listener.handler);
      listeners.splice(indexListener, 1);
    }
  };

  const removeListeners = () => {
    onBeforeUnmount(() => {
      listeners.forEach((listener) => {
        destroyListener(listener.key);
      });
    });
  };


  return {
    clickOutside,
    destroyListener,
    removeListeners,
  };
};

//
// export const useClickOutside = () => {
//   const listeners = [];
//   let key = null;
//   let handler = null;
//
//   const clickOutside = (fieldInSide, callback, e) => {
//     console.log(e);
//     if (fieldInSide) {
//       console.log('aaaa');
//       if (!fieldInSide.contains(e.target)) {
//         callback();
//       }
//     }
//   };
//
//   const createListener = (node, callback, keyUser) => {
//     key = keyUser;
//     if (listeners.indexOf(key) === -1) {
//       handler = clickOutside.bind(null, fieldInSide, callback);
//       document.addEventListener('click', handler);
//       listeners.push(key);
//     }
//     console.log('createlis', listeners);
//   };
//
//   const destroyListener = (fieldInSide, callback, key) => {
//     console.log(listeners);
//     if (listeners.indexOf(key) !== -1) {
//       document.removeEventListener('click', handler);
//       listeners.splice(listeners.indexOf(key), 1);
//     }
//     console.log('destroy', listeners);
//   };
//
//   const addListener = (fieldInSide, callback, key) => {
//     onMounted(() => {
//       createListener(fieldInSide, callback, key);
//     });
//   };
//
//   const removeListener = (fieldInSide, callback, key) => {
//     onBeforeUnmount(() => {
//       destroyListener(fieldInSide, callback, key);
//     });
//   };
//
//   return {
//     addListener,
//     removeListener,
//     listeners,
//     destroyListener,
//     createListener,
//   };
// };


export const UseClickOutside = (cleaningElement) => {
  let valueClickOnField = null;

  const getClickFilter = (e) => valueClickOnField = e.currentTarget;

  const addListener = (field, callback) => {
    console.log(field);
    document.addEventListener('click', callback);
    field.addEventListener('click', getClickFilter);
  };
  const removeListener = (field, callback) => {
    document.removeEventListener('click', callback);
    field.removeEventListener('click', getClickFilter);
  };
  return {
    addListener,
    removeListener,
  };
};


export const debounce = (callback, waitTimeMS) => {
  setTimeout(() => {
    callback();
  }, waitTimeMS);
};

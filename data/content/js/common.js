module.exports = function(selector){
  return [].slice.apply(document.querySelectorAll(selector));
};
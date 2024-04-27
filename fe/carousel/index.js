import Touch from 'touch-and-mouse';
/**
 * Moves the carousel by a specified amount.
 * @param {HTMLDivElement} carouselOuter - The outer container of the carousel.
 * @param {number} x - The amount to move the carousel by x.
 */
function carouselByX(carouselOuter, x) {
    // Set the new scrollLeft value
    carouselOuter.scrollLeft -= x;
}

/**
 * Moves the carousel by a specified amount.
 * @param {HTMLDivElement} carouselOuter - The outer container of the carousel.
 * @param {number} y - The amount to move the carousel by y.
 */
function carouselByY(carouselOuter, y){
    // Set the new scrollTop value
    carouselOuter.scrollTop -= y;
}

/**
 * Initializes the carousel functionality for the specified selector.
 * @param {string} selector - The CSS selector for the carousel elements.
 */

function initCarousel(selector){
  /**
   * Represents a collection of carousel elements.
   * @type {NodeListOf<HTMLDivElement>}
   */
  const carouselsOuter = document.querySelectorAll(selector);

  carouselsOuter.forEach(carouselOuter => {
    let touch  = new Touch(carouselOuter);
    touch.preventDefault = false;
    
    touch.onForce(({delta:{x, y}}) => {
      carouselByX(carouselOuter, x);
      carouselByY(carouselOuter, y);
    });
  })
}

export { initCarousel as default}
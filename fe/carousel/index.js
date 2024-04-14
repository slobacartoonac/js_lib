
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

  /**
   * Moves the carousel by a specified amount.
   * @param {HTMLDivElement} carouselOuter - The outer container of the carousel.
   * @param {number} x - The amount to move the carousel by x.
   */
  function carouselByX(carouselOuter, x) {
    const carouselInner = carouselOuter.children[0];
    // Get the current computed value of marginLeft
    const currentMarginLeft = parseInt(carouselInner.style.marginLeft) || 0;

    const paddingStyle = window.getComputedStyle(carouselOuter);
    const paddingLeft = parseFloat(paddingStyle.paddingLeft);
    const paddingRight = parseFloat(paddingStyle.paddingRight);

    // Add x to the current margin left
    const newMarginLeft = currentMarginLeft + x;
    if (newMarginLeft > 0) {
      return;
    }
    const toScroll = carouselOuter.offsetWidth -
      carouselInner.scrollWidth -
      paddingLeft -
      paddingRight;

    if (newMarginLeft < toScroll) {
      return;
    }
    
    // Set the new margin left as a string with 'px' unit
    carouselInner.style.marginLeft = `${newMarginLeft}px`;
  }
  /**
   * Moves the carousel by a specified amount.
   * @param {HTMLDivElement} carouselOuter - The outer container of the carousel.
   * @param {number} y - The amount to move the carousel by y.
   */

  function carouselByY(carouselOuter, y){
    const carouselInner = carouselOuter.children[0];
    // Get the current computed value of marginTop
    const currentMarginTop = parseInt(carouselInner.style.marginTop)||0;
    
    const paddingStyle = window.getComputedStyle(carouselOuter);
    const paddingTop = parseFloat(paddingStyle.paddingTop);
    const paddingBottom = parseFloat(paddingStyle.paddingBottom);
    
    // Add y to the current margin top
    const newMarginTop = currentMarginTop + y;
    if(newMarginTop > 0){
      return
    }
    const toScroll = carouselOuter.offsetHeight -
      carouselInner.scrollHeight -
      paddingTop -
      paddingBottom;
    
    if(newMarginTop < toScroll){
      return
    }
    
    // Set the new margin top as a string with 'px' unit
    carouselInner.style.marginTop = `${newMarginTop}px`;
  }


  carouselsOuter.forEach(carouselOuter => {
    let touch  = new Touch(carouselOuter);
    
    touch.onForce(({delta:{x, y}}) => {
      carouselByX(carouselOuter, x);
      carouselByY(carouselOuter, y);
    });
  })
}

export { initCarousel as default}
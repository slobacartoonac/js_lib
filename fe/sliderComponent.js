// Global variable to store the floating window reference
let globalFloatingWindow;

// Define a class for the floating window
class FloatingWindow extends HTMLElement {
  constructor() {
    super();

    // Ensure the floating window is created only once
    if (globalFloatingWindow) {
      throw new Error('.floating-window already created');
    }

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    const floatingWindow = document.createElement('div');
    floatingWindow.classList.add('floating-window');

    // Add styles to the shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      .floating-window {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 300px;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
    `;
    shadow.appendChild(style);

    // Add the floating window to the shadow root
    shadow.appendChild(floatingWindow);

    // Store the reference to the floating window
    globalFloatingWindow = floatingWindow;
    document.body.appendChild(this);
  }
}

class SliderComponent extends HTMLElement {
  constructor(config) {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    // Ensure the floating window is created
    if (!globalFloatingWindow) {
      new FloatingWindow();
    }

    // Add styles to the shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      .slider-container {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
      }
      .slider-label {
        width: 80px; /* Fixed width for all labels */
        margin-right: 10px;
        font-weight: bold;
        text-align: right; /* Align text to the right */
      }
      .slider {
        flex: 1;
        margin-right: 10px;
      }
      output {
        text-align: right;
        min-width: 20px;
      }
    `;
    shadow.appendChild(style);

    // Function to create a slider
    function createSlider({ label, id, defaultValue, oninput, min, max }) {
      const container = document.createElement('div');
      container.classList.add('slider-container');

      if (label) {
        const labelElem = document.createElement('label');
        labelElem.classList.add('slider-label');
        labelElem.setAttribute('for', id);
        labelElem.textContent = label;
        container.appendChild(labelElem);
      }

      const slider = document.createElement('input');
      slider.type = 'range';
      if (id) {
        slider.id = id;
      }
      slider.classList.add('slider');
      slider.min = min || '0';
      slider.max = max || '20';
      slider.value = defaultValue || 0;

      const output = document.createElement('output');
      output.textContent = defaultValue || 0;

      slider.oninput = function () {
        output.value = slider.value;
        oninput && oninput(slider.value);
      };

      container.appendChild(slider);
      container.appendChild(output);

      return container;
    }

    // Create controls based on configuration
    const control = createSlider(config);
    shadow.appendChild(control)

    // Append the control to the global floating window
    globalFloatingWindow.appendChild(this);
  }
}

// Define the new element
customElements.define('slider-component', SliderComponent);
customElements.define('floating-window', FloatingWindow);

// // Add a slider component with specific controls
// new SliderComponent({
//   label: 'task NO dsadad dasdaad',
//   id: 'slider2',
//   defaultValue: '6',
//   oninput: (val) => {
//     console.log(val);
//   },
// });
// new SliderComponent({
//   label: 'num tasks',
//   id: 'slider1',
//   defaultValue: '6',
//   oninput: (val) => {
//     console.log(val);
//   },
// });

export { SliderComponent };

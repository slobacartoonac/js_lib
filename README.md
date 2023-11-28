# js_lib

Js lib for varoues projects

## Content highlight

### Touch

FE JS lib that unifies touch and mouse events with good interface

```javascript
var touch = new Touch(targetHTMLElement, 20)
touch.throw_error = true
touch.onForce(({            // event move
            delta,          // delta move since last call
			direction,      // complete move since
			startPosition,  // start position in target element
			position,       // position in target element
			distance,       // direction magnitude number
			click,          // is event still inside dead zone
			isClick,        // is event still inside dead zone but better name
			mouseDown,      // is mouse input and whitch trigger
			zoom,           // pinch detection
			deltaZoom,      // delta pinch detection
			touchSecound,   // position of secound touch
			angle,          // angle between first and secound finger
			deltaAngle,     // angle since last call
			startTime,      // when touch started
			deltaTime,      // time since last call in ms
			isPrimary,      // primary mouse trigger or one touch
			debug,          // string of debugging
			centerPosition  // center between fingers
            }
            ) => {
})
touch.onStart((props)=>{    // event start
})
touch.onStop((props)=>{     // event end
}
touch.onClick((props)=>{    // event was click on end
}
touch.onUp((props)=>{       // event out of dead zone up
}
touch.onDown((props)=>{     // event out of dead zone down
}
touch.onLeft((props)=>{     // event out of dead zone left
}
touch.onRight((props)=>{    // event out of dead right up
}
```

### Vector

Vercatile fromat that unifies [x, y] and {x, y} formats with basic vector arithmetic.
Initialisation:
```javascript
let A = new Vector(0, 1)
let B = new Vector([0, 1])
let C = new Vector({x: 0, y: 1})
```

Usage:
```javascript
function distance12([aX, aY],[bX, bY]){};
const distance12Result = distance12(A, B);

function distanceXY({x: aX, y: aY}, {x: bX, y: bY}){};
const distanceXYResult = distanceXY(A, B);

function distance(aX, aY, bX, bY){};
const distanceResult = distance(...A, ...B);
```

### ECS

EC[S?] Library for manimulating entities, comes with bundle for Canvas graphis, phisics and much more.

Usage:
```javascript
function Transform(){}

let manager = new EntityManager()
let entity = manager.create()

let component = new Transform()
manager.asign(component, entity)

let transformList = manager.get(Transform, entity)      // [entity]

let listWithTransform = manager.getEnities(Transform)   // [component]

manager.remove(component, entity)
let emptyList = manager.get(Transform, entity)          // []

manager.destroy(entity)
manager.get(Transform, entity)                          // error no component found
```

### Math

Math for boxes, vectors, functions and view

## Usage

Best way to get yourself familiar with usage of this libraries is to look at [Test folder](tree/main/test)
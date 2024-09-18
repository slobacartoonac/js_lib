import { ShapeCircle } from '../../shapes/circle.js'
import { ShapeBox } from '../../shapes/box.js'
import { Physics } from './physics.js'
import { Transform } from './transform.js'

function CollisionEngine(manager) {
    this.manager = manager
}

CollisionEngine.prototype.compute = function () {
    let physicsEntities = this.manager.getEnities(Physics)
    for (var i = 0; i < physicsEntities.length; i++) {
        var entityA = physicsEntities[i]
        var shapeA = this.manager.get(ShapeCircle, entityA)[0]
        if(!shapeA) {
            continue
        }
        var transformA = this.manager.get(Transform, entityA)[0]
        var physicsA = this.manager.get(Physics, entityA)[0]

        for (var j = 0; j < physicsEntities.length; j++) {
            var entityB = physicsEntities[j]
            var shapeB = this.manager.get(ShapeBox, entityB)[0]
            if(!shapeB) {
                continue
            }
            var transformB = this.manager.get(Transform, entityB)[0]
            var physicsB = this.manager.get(Physics, entityB)[0]

            // Check for collision between circle and box
            if (circleBoxCollision(shapeA, transformA, shapeB, transformB)) {
                    // Handle collision response
                    collisionResponse(shapeA, transformA, physicsA, shapeB, transformB, physicsB)
            }
        }
    }
}
function circleBoxCollision(circle, circleTransform, box, boxTransform) {
    // Calculate the closest point on the box to the circle
    var minX = boxTransform.positions[0] - circle.radius
    var maxX = boxTransform.positions[0] + box.x + circle.radius
    
    var minY = boxTransform.positions[1] - circle.radius
    var maxY = boxTransform.positions[1] + box.y + circle.radius

    // Calculate the distance between the circle center and the closest point
    var distanceX = Math.max(minX - circleTransform.positions[0], circleTransform.positions[0] - maxX)
    var distanceY = Math.max(minY - circleTransform.positions[1], circleTransform.positions[1] - maxY)

    // Check if the distance is less than or equal to the circle radius
    return Math.max(distanceX, distanceY) < 0
}

function collisionResponse(circle, circleTransform, circlePhysics, box, boxTransform) {
    // Calculate the overlap between the circle and the box
    var minX = boxTransform.positions[0] - circle.radius
    var maxX = boxTransform.positions[0] + box.x + circle.radius
    
    var minY = boxTransform.positions[1] - circle.radius
    var maxY = boxTransform.positions[1] + box.y + circle.radius

    var overlapX = Math.max(minX - circleTransform.positions[0], circleTransform.positions[0] - maxX)
    var overlapY = Math.max(minY - circleTransform.positions[1], circleTransform.positions[1] - maxY)
    
    const EPSILON = 0.01
    // Determine the axis of least penetration
    if (overlapX > overlapY) {

        // Expell the circle from the box
        if (minX - circleTransform.positions[0] > circleTransform.positions[0] - maxX) {
            circleTransform.positions[0] = boxTransform.positions[0] - circle.radius - EPSILON
            circlePhysics.speeds[0] = -0.01 * Math.abs(circlePhysics.speeds[0])

        } else{
            circleTransform.positions[0] = boxTransform.positions[0] + box.x + circle.radius + EPSILON
            circlePhysics.speeds[0] = 0.01 * Math.abs(circlePhysics.speeds[0])
        }
    } else {
        // Expell the circle from the box
        if (minY - circleTransform.positions[1] > circleTransform.positions[1] - maxY) {
            circleTransform.positions[1] = boxTransform.positions[1] - circle.radius - EPSILON
            circlePhysics.speeds[1] = -0.01 * Math.abs(circlePhysics.speeds[1])
        } else {
            circleTransform.positions[1] = boxTransform.positions[1] + box.y + circle.radius + EPSILON
            circlePhysics.speeds[1] = 0.01 * Math.abs(circlePhysics.speeds[1])
        }
    }
}

export { CollisionEngine }
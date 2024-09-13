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
                // Check if the circle is moving towards the box
                var relativeVelocityX = physicsA.speeds[0] - physicsB.speeds[0]
                var relativeVelocityY = physicsA.speeds[1] - physicsB.speeds[1]
                var relativePositionX = transformA.positions[0] - transformB.positions[0] + shapeB.x / 2
                var relativePositionY = transformA.positions[1] - transformB.positions[1] + shapeB.y / 2
                var dotProduct = relativeVelocityX * relativePositionX + relativeVelocityY * relativePositionY

                if (dotProduct > 0) {
                    // Handle collision response
                    collisionResponse(shapeA, transformA, physicsA, shapeB, transformB, physicsB)
                }
            }
        }
    }
}
function circleBoxCollision(circle, circleTransform, box, boxTransform) {
    // Calculate the closest point on the box to the circle
    var closestX = clamp(circleTransform.positions[0], boxTransform.positions[0], boxTransform.positions[0] + box.x )
    var closestY = clamp(circleTransform.positions[1], boxTransform.positions[1], boxTransform.positions[1] + box.y )

    // Calculate the distance between the circle center and the closest point
    var distanceX = circleTransform.positions[0] - closestX
    var distanceY = circleTransform.positions[1] - closestY

    // Check if the distance is less than or equal to the circle radius
    return (distanceX * distanceX + distanceY * distanceY) <= (circle.radius * circle.radius)
}

function collisionResponse(circle, circleTransform, circlePhysics, box, boxTransform, boxPhysics) {
    // Calculate the overlap between the circle and the box
    var overlapX = Math.abs(circleTransform.positions[0] - boxTransform.positions[0]) - (box.x / 2)
    var overlapY = Math.abs(circleTransform.positions[1] - boxTransform.positions[1]) - (box.y / 2)

    // Determine the axis of least penetration
    if (overlapX < overlapY) {
        // Bounce the circle off the box horizontally
        circlePhysics.speeds[1] *= 0
        // Expell the circle from the box
        if (circleTransform.positions[0] < boxTransform.positions[0]) {
            circleTransform.positions[0] = boxTransform.positions[0] - circle.radius
        } else if (circleTransform.positions[0] > boxTransform.positions[0] + box.x) {
            circleTransform.positions[0] = boxTransform.positions[0] + box.x + circle.radius
        }
    } else {
        // Bounce the circle off the box vertically
        circlePhysics.speeds[1] *= 0
        // Expell the circle from the box
        if (circleTransform.positions[1] < boxTransform.positions[1]) {
            circleTransform.positions[1] = boxTransform.positions[1] - circle.radius
        } else if (circleTransform.positions[1] > boxTransform.positions[1] + box.y) {
            circleTransform.positions[1] = boxTransform.positions[1] + box.y + circle.radius
        }
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max))
}

export { CollisionEngine }
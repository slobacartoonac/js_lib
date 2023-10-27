function sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function pointInTriangle(pt, v1, v2, v3) {
    var b1 = sign(pt, v1, v2) < 0.0;
    var b2 = sign(pt, v2, v3) < 0.0;
    var b3 = sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
}

function dot(a, b) { return (a.x * b.x) + (a.y * b.y); }

function perpDot(a, b) { return (a.y * b.x) - (a.x * b.y); }

function lineCollision(A1, A2,
    B1, B2) {
    var a = { x: A2.x - A1.x, y: A2.y - A1.y };
    var b = { x: B2.x - B1.x, y: B2.y - B1.y };

    var f = perpDot(a, b);
    if (!f)      // lines are parallel
        return false;

    var c = { x: B2.x - A2.x, y: B2.y - A2.y };
    var aa = perpDot(a, c);
    var bb = perpDot(b, c);

    if (f < 0) {
        if (aa > 0) return false;
        if (bb > 0) return false;
        if (aa < f) return false;
        if (bb < f) return false;
    }
    else {
        if (aa < 0) return false;
        if (bb < 0) return false;
        if (aa > f) return false;
        if (bb > f) return false;
    }
    return true;
}

function lineCollisionPoint2(A, B,
    C, D, Ecalc = 0.001) {
   // Line AB represented as a1x + b1y = c1
   let a = B.y - A.y;
   let b = A.x - B.x;
   let c = a*(A.x) + b*(A.y);
   // Line CD represented as a2x + b2y = c2
   let a1 = D.y - C.y;
   let b1 = C.x - D.x;
   let c1 = a1*(C.x)+ b1*(C.y);
   let det = a*b1 - a1*b;
   if (det != 0){
      let x = (b1*c - b*c1)/det;
      let y = (a*c1 - a1*c)/det;
            // Check if the intersection point is within the bounds of line segment AB
            if (x + Ecalc >= Math.min(A.x, B.x) && x <= Math.max(A.x, B.x) + Ecalc &&
            y + Ecalc >= Math.min(A.y, B.y) && y <= Math.max(A.y, B.y) + Ecalc &&
          // Check if the intersection point is within the bounds of line segment CD
            x + Ecalc >= Math.min(C.x, D.x) && x <= Math.max(C.x, D.x) + Ecalc &&
            y + Ecalc >= Math.min(C.y, D.y) && y <= Math.max(C.y, D.y) + Ecalc) {
            return { x, y };
          }
   }
   return null
}


function interpolateVecs(vecA, vecB, over) {
    let left = 1 - over
    return { x: vecA.x * left + vecB.x * over, y: vecA.y * left + vecB.y * over }
}
function interpolate(vecA, vecB, over) {
    let left = 1 - over
    return vecA * left + vecB * over
}
function magnitude(aX, aY) {
    return Math.sqrt(aX * aX + aY * aY)
}

function distance(aX, aY, bX, bY) {
    return magnitude(aX - bX, aY - bY)
}

export {
    pointInTriangle,
    dot,
    perpDot,
    lineCollision,
    lineCollisionPoint2,
    sign,
    interpolateVecs,
    interpolate,
    distance,
    magnitude
}
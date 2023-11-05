class GridPoint {
  constructor(position){
    this.f = 0; //total cost function
    this.g = 0; //cost function
    this.h = 0; //heuristic estimated cost 
    this.parent = undefined; 
    this.position = position;
  }
    static fromPosition(pos){
      return new GridPoint(pos)
    }
}

export function search(startPositions, {
    getNeighbors,
    heuristic,
    maxPathLength,
    isGoal
}) {
  let openSet = startPositions.map(pos => {
    let point =  GridPoint.fromPosition(pos)
    point.h = heuristic(point.position)
    point.f = point.g + point.h;
    return point
  })
  
  let path = null
  let closedSet = []
  let best = - Infinity
  while (openSet.length > 0) {
    openSet.sort(({f:fA},{f:fB})=>{
        if(fB>fA){return -1}
        if(fA>fB){return 1}
        return 0
    })
    let current = openSet.shift();
    if(isGoal ? isGoal(current) : (current.h == 0)){
        path = current
        break;
    }
    let score = 1 / current.h;
    if (score > best) {
      best = score
      // console.log("Candidate!");
      // return the traced path
      path = current
    }
    //add current to closedSet
    closedSet.push(current);
    if(maxPathLength && current.g >= maxPathLength - 1){
      continue;
    }

    let neighbors = getNeighbors(current.position);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      let possibleG = current.g + 1;
      let possibleH = heuristic(neighbor)
      let possibleF = possibleG + possibleH;
      if (!closedSet.find(({position,h})=> neighbor === position && h < possibleH)) {
        let neighborPoint = GridPoint.fromPosition(neighbor)
        neighborPoint.g = possibleG;
        neighborPoint.h = possibleH;
        neighborPoint.f = possibleF;
        neighborPoint.parent = current;
        openSet.push(neighborPoint);
      }
    }
  }
  let res = []
  while(path){
    res.push(path.position)
    path = path.parent
  }
  return res;
}
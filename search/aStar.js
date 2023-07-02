class GridPoint {
  constructor(position){
    this.f = 0; //total cost function
    this.g = 0; //cost function from start to the current grid point
    this.h = 0; //heuristic estimated cost function from current grid point to the goal
    this.neighbors = []; // neighbors of the current grid point
    this.parent = undefined; // immediate source of the current grid point
    this.position = position;
  }
    static fromPosition(pos){
      return new GridPoint(pos)
    }
}

export function search(startPositions, {
    getScore,
    isGoal,
    getNeighbors,
    heuristic,
    maxPathLength
}) {
  let openSet = startPositions.map(pos => {
    return GridPoint.fromPosition(pos)
  })
  
  let path = null
  let closedSet = []
  let best = - Infinity
  while (openSet.length > 0) {
    //assumption lowest index is the first one to begin with
    openSet.sort(({f:fA},{f:fB})=>{
        if(fB>fA){return -1}
        if(fA>fB){return 1}
        return 0
    })
    let current = openSet.shift();
    if(isGoal ? isGoal(current) : current.h == 0){
        path = current
        break;
    }
    let score = getScore ? getScore(current) : 1 / current.h;
    if (score > best) {
      best = score
      console.log("Candidate!");
      // return the traced path
      path = current
    }
    //add current to closedSet
    closedSet.push(current.position);
    if(maxPathLength && current.g >= maxPathLength - 1){
      continue;
    }

    let neighbors = getNeighbors(current.position).map(GridPoint.fromPosition);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (!closedSet.includes(neighbor)) {
        let possibleG = current.g + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (possibleG >= neighbor.g) {
          continue;
        }
        neighbor.g = possibleG;
        neighbor.h = heuristic(neighbor.position)
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
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
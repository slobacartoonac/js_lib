type GetNeighborsFunction<T> = (position: T) => T[];
type HeuristicFunction<T> = (position: T) => number;
type IsGoalFunction<T> = (position: T) => boolean;

interface AStarOptions<T> {
  getNeighbors: GetNeighborsFunction<T>;
  heuristic: HeuristicFunction<T>;
  maxPathLength?: number;
  isGoal?: IsGoalFunction<T>;
  allowDeep?: boolean;
}

export function search<T>(
  startPositions: T[],
  options: AStarOptions<T>
): T[];

declare module "word-difference-calculator" {
  export type WeightFactors = {
    case?: number;
    position?: number;
    keyboardDistance?: number;
    length?: number;
  };

  export function computeWordDifference(
    word1: string,
    word2: string,
    weights?: WeightFactors
  ): number;

  export function getKeyboardDistance(letter1: string, letter2: string): number;

  export function findClosestIndexAndDif(
    firstString: string,
    secondString: string,
    firstIndex: number
  ): [number, number, number];
}
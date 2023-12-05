
export function computeWordDifference(word1, word2, weights) {
      const word1Length = word1.length;
      const word2Length = word2.length;
      const minLength = Math.min(word1Length, word2Length);
      const maxLength = Math.max(word1Length, word2Length);
      const caseWeight = weights?.case || 0.1
      const positionWeight = weights?.position || 1
      const keyboardDistanceWeight = weights?.keyboardDistance || 1
      const lengthWeight = weights?.length || 0.2
  
      let weightedDifference = (maxLength - minLength)*lengthWeight;
      let lastShift = 0
      for (let i = 0; i < minLength; i++) {
        const letter1 = word1[i] || '';
        const letter2 = word2[i] || '';
  
        if (letter1 !== letter2) {
          if (letter1.toLowerCase() === letter2.toLowerCase()) {
            weightedDifference += caseWeight; // case difference
            continue
          }
          const [close1, close2, dist] = findClosestIndexAndDif(word1, word2 ,i)
          let minPosDist = 1
          if(close1 > -1){
            let newShift = close1 - i
            if(close2 > -1){
              let newShift2 = close2 - i
              if(newShift2 == lastShift){
                newShift = newShift2
              }
            }
            if(lastShift !== newShift){
              minPosDist = 1 - 1/(dist/2+1)
              lastShift = newShift
            }
            else {
              minPosDist = 0
              continue
            }
          } else {
            lastShift = 0
          }
          weightedDifference += minPosDist * positionWeight; // letter position switch
          const keyboardDistance = getKeyboardDistance(word1[i], word2[i]); // letter keyboard distance
          const minKeyDist = 1 - 1/(keyboardDistance/2+ 1)
          weightedDifference += minKeyDist * keyboardDistanceWeight
        }
      }
    
      return weightedDifference / minLength;
    }
  
    
export function getKeyboardDistance(letter1, letter2) {
      const keyboardLayout = {
        // Define your keyboard layout here
        // Example layout for a standard QWERTY keyboard
        'q': { row: 1, col: 1 },
        'w': { row: 1, col: 2 },
        'e': { row: 1, col: 3 },
        'r': { row: 1, col: 4 },
        't': { row: 1, col: 5 },
        'y': { row: 1, col: 6 },
        'u': { row: 1, col: 7 },
        'i': { row: 1, col: 8 },
        'o': { row: 1, col: 9 },
        'p': { row: 1, col: 10 },
        'a': { row: 2, col: 1 },
        's': { row: 2, col: 2 },
        'd': { row: 2, col: 3 },
        'f': { row: 2, col: 4 },
        'g': { row: 2, col: 5 },
        'h': { row: 2, col: 6 },
        'j': { row: 2, col: 7 },
        'k': { row: 2, col: 8 },
        'l': { row: 2, col: 9 },
        'z': { row: 3, col: 1 },
        'x': { row: 3, col: 2 },
        'c': { row: 3, col: 3 },
        'v': { row: 3, col: 4 },
        'b': { row: 3, col: 5 },
        'n': { row: 3, col: 6 },
        'm': { row: 3, col: 7 },
      };
    
      const pos1 = keyboardLayout[letter1.toLowerCase()];
      const pos2 = keyboardLayout[letter2.toLowerCase()];
    
      if (pos1 && pos2) {
        const rowDirection = pos1.row - pos2.row;
        const rowDiff = Math.abs(rowDirection);
        const rowAdjust = rowDirection * 0.5;
        const colDiff = Math.abs(pos1.col + rowAdjust - pos2.col);
        return rowDiff + colDiff;
      }
    
      return 0;
    }
  
  
export function findClosestIndexAndDif(firstString, secondString, firstIndex) {
      const target = firstString[firstIndex];
      let minDiff = Infinity;
      let closestIndex = -1;
      let closestIndex1 = -1
    
      for (let i = 0; i < secondString.length; i++) {
        if (secondString[i].toLowerCase() === target.toLowerCase()) {
          const diff = Math.abs(firstIndex - i);
          if(diff == minDiff){
            closestIndex1 = i
          } else
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
            closestIndex1 = -1
          }
        }
      }
    
      return [closestIndex, closestIndex1, minDiff];
    }
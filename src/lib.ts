import * as tx from "@thi.ng/transducers";

export const columns = (board, ncol, nrow): [string | undefined] => {
  let cols = [...Array(ncol)].map(_ => [...Array(nrow)]);
  board.forEach(cell => {
    cols[cell.p[0]][cell.p[1]] = cell.letter
  });
  return(cols)
}

// export const cumulativeSum = (vals: [number]): [number] | [] =>  {
//   const sums = vals.reduce((cum: [number] | [], val: number) => {
//     let last = (cum.at(-1) | 0);
//     cum.push(last + val)
//     return(cum)
//   }, [])
//   return(sums)
// }

export const dropField = (board, ncol, nrow) => {
  const cols = columns(board, ncol, nrow)
  const undefined_counter = (acc,x)=> x !== undefined ? acc : acc+=1
  const drops = cols.map(col => tx.reductions(tx.reducer(() => 0, undefined_counter), col.reverse()).reverse().slice(-nrow))

  // const drops = cols.map((col) => {
  //   return(cumulativeSum(col.reverse().map((val) => {
  //     return(val !== undefined ? 0 : 1)
  //   })).reverse())
  // })
  return(drops)
}

export const newPoints = (board, ncol, nrow) => {
  const cols = columns(board, ncol, nrow)
  const replacementCounts = cols.map(col => col.map(val => val === undefined).reduce((sum, val) => sum+=val))
  const points = replacementCounts.map((count, col) => [...tx.range(0,count)].map(depth => [col,depth]))

  return(points)
}

export const calculateProbability = (obj) => {
  let total = obj.values.reduce((prev,curr)=> prev+curr,0)
  return(Object.fromEntries(obj.entries.map(([k, v]) => [k, v/total])))
}


export class LetterGenerator {
  letters: string[];
  cumulativeFrequencies: number[];
  cumulativeProbabilities: number[];

  static letterFrequency = {
    "a": 8.34, "b": 1.54, "c": 2.73, "d": 4.14, "e": 12.6, "f": 2.03, "g": 1.92, "h": 6.11, "i": 6.71,
    "j": 0.23, "k": 0.87, "l": 4.24, "m": 2.53, "n": 6.8, "o": 7.7, "p": 1.66, "q": 0.09, "r": 5.68,
    "s": 6.11, "t": 9.37, "u": 2.85, "v": 1.06, "w": 2.34, "x": 0.2, "y": 2.04, "z": 0.06
  }

  constructor() {
    this.letters = Object.keys(LetterGenerator.letterFrequency)
    this.cumulativeFrequencies = Object.values(LetterGenerator.letterFrequency).reduce((sums: number[], val: number): number[] => {
      const lastVal = sums.slice(-1)[0] | 0
      sums.push(val+lastVal)
      return(sums)
    }, [])
    const totalFrequency = this.cumulativeFrequencies.slice(-1)[0]
    this.cumulativeProbabilities = this.cumulativeFrequencies.map(val => val/totalFrequency)
  }

  generate() {
    const rnd = Math.random()
    const idx = this.cumulativeProbabilities.filter(val => rnd > val).length
    return(this.letters[idx])
  }
}
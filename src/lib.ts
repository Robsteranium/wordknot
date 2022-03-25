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
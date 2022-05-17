import { columns, dropField, newPoints } from './lib';


// AB
// CD
// EF
let boardBefore = [
  { p: [0,0], letter: "A" },
  { p: [1,0], letter: "B" },
  { p: [0,1], letter: "C" },
  { p: [1,1], letter: "D" },
  { p: [0,2], letter: "E" },
  { p: [1,2], letter: "F" }
]

// AB
// __
// _F
let boardAfter = [
  { p: [0,0], letter: "A" },
  { p: [1,0], letter: "B" },
  // { p: [0,1], letter: "C" },
  // { p: [1,1], letter: "D" },
  // { p: [0,2], letter: "E" },
  { p: [1,2], letter: "F" }
]


test('columns', () => {
  expect(columns(boardBefore, 2, 3)).toEqual(
    [
      ["A","C","E"],
      ["B","D","F"]
    ]
  )

  expect(columns(boardAfter, 2, 3)).toEqual(
    [
      ["A",undefined,undefined],
      ["B",undefined,"F"]
    ]
  )
})


test('dropField', () => {
  expect(dropField(boardAfter, 2, 3)).toEqual(expect.arrayContaining(
    [
      [2,1,0],
      [1,0,0]
    ])
  )
})

test('replacements', () => {
  //  expect(replacements(boardBefore)).toEqual([])
  //  let newPoints = replacements(boardAfter, 2, 3).map(({p})=>p)

  let points = newPoints(boardAfter, 2, 3)
  expect(points).toEqual(expect.arrayContaining(
    [
      [[0,0], [0,1]],
      [[1,0]]
    ]
  ))
})

// test('cumulativeSum', () => {
//   expect(cumulativeSum([1,2,3])).toEqual([1,3,6])
// })


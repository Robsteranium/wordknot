import { start } from "@thi.ng/hdom";
import { canvas } from "@thi.ng/hdom-canvas";
import { text, circle } from "@thi.ng/geom";
import * as tx from "@thi.ng/transducers";
import { equals2 } from "@thi.ng/vectors/equals"
import type { Vec } from "@thi.ng/vectors";

const W = 600;//document.body.clientWidth;
const H = W + 100;//document.body.clientHeight;

const board_length = 5;
const cell_width = W/board_length;
const circleRadiusProportion = 1/2;
const circleRadius = cell_width*circleRadiusProportion;

type Cell = {
  p: Vec;
  letter: String;
}

let knot: Cell[] = [];
let mouseDown = false;

const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

const randomLetter = () => {
  const n = (Math.random() * alphabet.length) | 0
  return(alphabet[n])
}

const generateBoard = (board_length) => {
  return([...tx.range2d(board_length,board_length) ].map(([x,y]) => {
    return({ p: [x,y], letter: randomLetter() })
  }))
}

let board: Cell[] = generateBoard(board_length);

const coordinates = ([x,y]) => {
  return([(0.5+x)*cell_width, (0.5+y)*cell_width])
}

const lastLetter = () => {
  return(knot[knot.length-1])
}

const letterColour = (cell) => {
  const index = knot.findIndex(letter => equals2(letter.p, cell.p));
  const hue = (index * 25) % 256;
  return(index == -1 ? 'lightgrey' : `hsl(${hue}, 100%, 50%)`)
}

const letters = (board) => {
  return(
    board.flatMap((cell) => {
      const position = coordinates(cell.p)
      const circleColour = letterColour(cell)
      return([
        circle(position, circleRadius, { fill: circleColour }),
        text(position, cell.letter, { 
          font: "80px Roboto Black", 
          fill: "black",
          baseline: "middle",
          align: "center"
        })
      ])
    })
  )
}

const currentCell = (p: Vec): Cell =>  {
  const x = p[0] / cell_width;
  const y = p[1] / cell_width;
  const circle_x = x - (x | 0) - 0.5;
  const circle_y = y - (y | 0) - 0.5;
  const radius = Math.sqrt(Math.pow(circle_x, 2) + Math.pow(circle_y, 2));
  const inCircle = radius < circleRadiusProportion;
  if (inCircle) {
    const cell = board.find(c => equals2(c.p, [x | 0, y | 0]))
    return(cell)
  }
}

const updateMouse = (e: MouseEvent) => {
  const cell = currentCell([e.offsetX, e.offsetY]);
  if(cell !== undefined && mouseDown && cell !== lastLetter()) {
    knot.push(cell)
  }
};

const word = (cells) => {
  const label = cells.map(c => c.letter).join('');
  return(text(
    [W/2,W+25],
    label,
    {
      font: "80px Roboto Black",
      fill: "black",
      align: "center",
      baseline: "top"
    }
  ))
}

const startKnot = () => {
  mouseDown = true;
  knot = []
};

const endKnot = () => {
  mouseDown = false;
  
  // remove word and drop down replacements
  board = board.filter(cell => !knot.some(letter => equals2(letter.p, cell.p)))
  knot = []
};

export const columns = (board) => {
  let cols = [...Array(board_length)].map(_ => [...Array(board_length)]);
  board.forEach(cell => {
    cols[cell.pos[1]][cell.pos[0]] = cell.letter
  });
  return(cols)
}

start(() => {
  return([canvas, {
    width: W,
    height: H ,
    onmousemove: updateMouse,
    onmousedown: startKnot,
    onmouseup: endKnot
  },
    ...letters(board),
    word(knot)
  ]);
});
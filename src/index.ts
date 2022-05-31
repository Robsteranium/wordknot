import { start } from "@thi.ng/hdom";
import { canvas } from "@thi.ng/hdom-canvas";
import { text, circle } from "@thi.ng/geom";
import * as tx from "@thi.ng/transducers";
import { equals2 } from "@thi.ng/vectors/equals"
import type { Vec } from "@thi.ng/vectors";
import { dropField, newPoints, LetterGenerator } from './lib';

const maxWidth = document.body.clientWidth;
const maxHeight = document.body.clientHeight;
const ratio = 4/3;
const [W,H] = maxHeight > maxWidth ? [maxWidth, maxWidth*ratio] : [maxHeight/ratio, maxHeight]

const board_length = 6;
const cell_width = W/board_length;
const circleRadiusProportion = 1/2;
const circleRadius = cell_width*circleRadiusProportion;

type Cell = {
  p: Vec;
  letter: String;
  target_p: Vec;
  velocity: Vec;
  resting: Boolean;
}

let knot: Cell[] = [];
let mouseDown = false;

const letterGenerator = new LetterGenerator;

const randomLetter = () => {
  return(letterGenerator.generate())
}

const generateBoard = (board_length) => {
  return([...tx.range2d(board_length, board_length)].map(([x,y]) => {
    return({
      p: [x,y],
      letter: randomLetter(),
      target_p: [x,y],
      velocity: [0,0],
      resting: true
    })
  }))
}

let board: Cell[] = generateBoard(board_length);

let points = 0;

let longest: String = "";

// Render

const coordinates = ([x,y]) => {
  return([(0.5+x)*cell_width, (0.5+y)*cell_width])
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
          font: `${cell_width/ratio}px Roboto`,
          fill: "black",
          baseline: "middle",
          align: "center"
        })
      ])
    })
  )
}

const word = (cells) => {
  const label = cells.map(c => c.letter).join('');
  return(text(
    [W/2,W+25],
    label,
    {
      font: "80px Roboto",
      fill: "black",
      align: "center",
      baseline: "top"
    }
  ))
}

const score = (points) => {
  return(
    text(
      [W/2,W+100],
      points,
      {
        font: "60px Roboto",
        fill: "grey",
        align: "center",
        baseline: "top"
      }
    )
  )
}

const longestWord = (word) => {
  return(
    text(
      [W/2, W+150],
      word,
      {
        font: "40px Roboto",
        fill: "grey",
        align: "center",
        baseline: "top"
      }
    )
  )
}

// Animation

let tick = 0;
let gravity = 0.02; // cells per tick, per tick
let restitution = 0.6;
let negligible_bounce_velocity = 0.01;

let letter = {
  p: [1,1],
  letter: randomLetter(),
  target_p: [1,3],
  velocity: [0,0],
  resting: false
}

const animate = () => {
  board.forEach(letter => {
    if (!letter.resting) {
      letter.velocity[1] += gravity
      letter.p[1] += letter.velocity[1]

      if(letter.p[1] >= letter.target_p[1]) { // has reached target
        letter.velocity[1] = letter.velocity[1] * -restitution;

        if(-letter.velocity[1] < negligible_bounce_velocity) {
          letter.resting = true
          letter.p = letter.target_p
        } else {
          letter.p[1] = letter.target_p[1] - 0.001; // lift so the letter bounces back
        }
      }
    }
  })
}

const step = () => {
  tick++
  animate()
}


// Gameplay

const removeKnot = (board, knot) => {
  return(board.filter(cell => !knot.some(letter => equals2(letter.p, cell.p))))
}

const replace = (board) => {
  return(
    newPoints(board, board_length, board_length).flatMap((col) => {
      let col_offset = Math.max(...col.map(p => p[1])) + 1
      return(col.map((p) => {
        return(
          {
            p: [p[0],p[1]-col_offset],
            letter: randomLetter(),
            target_p: p,
            velocity: [0,0],
            resting: false
          }
        )
      }))
    }
   )
  )
}

const drop = (board) => {
  const drops = dropField(board, board_length, board_length)
  const newBoard = board.map((cell) => {
    cell.target_p = [cell.p[0], cell.p[1] + drops[cell.p[0]][cell.p[1]]]
    cell.resting = cell.p === cell.target_p
    return(cell)
  })
  return(newBoard)
}

const wordChecker = (wordlist) => {
  return((word) => wordlist.indexOf('\n' + word + '\n') > 0)
}

const longerWord = (a, b) => {
  return(a.length >= b.length ? a : b)
}

// Interaction

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

const lastLetter = () => {
  return(knot[knot.length-1])
}

const updateMouse = (e: MouseEvent) => {
  const cell = currentCell([e.offsetX, e.offsetY]);
  if(cell !== undefined && mouseDown && cell !== lastLetter()) {
    knot.push(cell)
  }
};

const updateTouch = (e: TouchEvent) => {
  // https://github.com/w3c/touch-events/issues/62
  // https://stackoverflow.com/questions/17130940/retrieve-the-same-offsetx-on-touch-like-mouse-event
  const touch = e.targetTouches[0] // only care about one finger
  const target = e.target as HTMLElement;
  var canvasBounds = target.getBoundingClientRect();
  var x = touch.clientX - canvasBounds.x;
  var y = touch.clientY - canvasBounds.y;
  const cell = currentCell([x, y]);
  if(cell !== undefined && mouseDown && cell !== lastLetter()) {
    knot.push(cell)
  }
};

const startKnot = () => {
  mouseDown = true;
  knot = []
};

const knotEnder = (checkWord) => {
  return(function() {
    mouseDown = false;
  
    // remove word and drop down replacements
    const word = knot.map(c => c.letter).join('')
    if (checkWord(word)) {
      board = removeKnot(board, knot)
      longest = longerWord(word, longest)
      points += Math.pow(word.length,3)
    }
    board = drop(board)
    board = board.concat(replace(board))
    knot = []  
  })
};


// Mount

async function mount() {
  const words = await fetch('words.txt').then(response => response.text())
  const checkWord = wordChecker(words)
  const endKnot = knotEnder(checkWord)

  start(() => {
    return([canvas, {
      width: W,
      height: H,
      onmousemove: updateMouse,
      onmousedown: startKnot,
      onmouseup: endKnot,
      ontouchmove: updateTouch,
      ontouchstart: startKnot,
      ontouchend: endKnot,
    },
      step(),
      ...letters(board),
      word(knot),
      score(points),
      longestWord(longest)
      //text([50, 150], tick, { font: "80px Roboto Black", fill: "red"})
    ]);
  });
}

mount()
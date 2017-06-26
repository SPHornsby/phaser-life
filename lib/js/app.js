
window.onload = function() {

  const game = new Phaser.Game(500, 500, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update });

  let config = {
    dot_size: 10,
    grid_height: 100,
    grid_width: 100,
    desiredFps: 5
  }

  let dots
  let board = [ 
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
    [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 1, 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 1, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] 
  ]


  function preload () {
  }
  
  function create () {
    // game update rate
    game.time.desiredFps = config.desiredFps

    // dots
    dots = game.add.group()

    // controls
    cursors = game.input.keyboard.createCursorKeys();

    // initial state
    createBoard()
    drawBoard()
  }

  function update () {

    clearBoard()
    updateBoard()
    drawBoard()
    if (cursors.up.justDown) {
      // clearBoard()
      // updateBoard()
      // drawBoard()
      // console.log(board)
    }
  }

  // helpers
  const createBoard = () => {
    const createdBoard = []
    for (let i = 0; i < config.grid_width; i++) {
      let row = []
      for (let j = 0; j< config.grid_height; j++) {
        row.push(getRandom())
      }
      createdBoard.push(row)
      board = createdBoard
    }
  }
  const getRandom = () => {
    if(Math.random() > 0.9) return 1
    return 0
  }
  const updateBoard = () => {
    let current = board
    
    const checkSurrounding = (cell) => {
      let width = config.grid_width
      let height = config.grid_height
      let surroundingAlive = 0
      const row = cell[0]
      const column = cell[1]
      const rowStart = row - 1 < 0 ? row : row -1
      const rowEnd = row + 2 > width? width : row +2
      const columnStart = column - 1 < 0 ? column : column -1
      const columnEnd = column + 2 > height? height : column +2
      for (let i = rowStart; i < rowEnd; i++) {
        for (let j = columnStart; j < columnEnd; j++) {
          if (i === row && j === column) {
          } else {
            surroundingAlive += board[i][j]
          }
          
        }
      }
      return surroundingAlive
    }
    const getScore = (cell) => {
      let surrounding = checkSurrounding(cell)
      const row = cell[0]
      const column = cell[1]
      if (board[row][column] === 1 && (surrounding === 2 || surrounding === 3)) {
        return 1
      }
      if (surrounding <= 2) {
        return 0
      }

      if (surrounding === 3 && board[row][column] === 0) {
        return 1
      }
      if (surrounding > 3) {
        return 0
      }
      return 1
    }
    // for each cell, check the 8 (best case) surrounding cells
    let newBoard = []
    let width = config.grid_width
    let height = config.grid_height

    for (let i = 0; i < height; i++) {
      let row = []
      for (let j = 0; j< width; j++) {
        let cell = [i,j]
        const newScore = getScore(cell)
        row.push(getScore(cell))
      }
      newBoard.push(row)
    }
    board = newBoard
  }
  const drawBoard = () => {
    let width = config.grid_width
    let height = config.grid_height
    for(let i = 0; i < height; i++) {
      for(let j = 0; j < width; j++) {
        if (board[i][j] === 1) {
          drawDot(i,j)
        }
      }
    }
  }
  const drawDot = (i,j) => {
    let size = config.dot_size
    let dot = game.add.graphics (j*size, i*size);
    dot.beginFill(0x00FF00, 1);
    dot.drawRect(0,0,size,size);
    dots.addChild(dot)
  }
  const clearBoard = () => {
    dots.destroy(true, true)
  }
};

/* Variáveis */

const playBtn = document.querySelector("#play");
const restartBtn = document.querySelector("#restart");
const fieldSize = 800;
const numberOfCellsInRow = 50;
var framesPerSecond = 8;
var actualGrid = [];

/* Gerar Grid Aleatório (primeiro estágio das células) */

const getRandomGrid = () => {
  const grid = new Array(numberOfCellsInRow);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(numberOfCellsInRow);
    for (let j = 0; j < grid.length; j++) {
      grid[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return grid;
};

/* Next generation (próximo estágio das células) */

const getNextGeneration = (grid) => {
    actualGrid = grid;
    const nextGrid = new Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
        nextGrid[i] = new Array(grid.length);
        for (let j = 0; j < nextGrid[i].length; j++) {
        const value = grid[i][j];
        const neighbors = countNeighbors(grid, i, j);
        if (value === 0 && neighbors === 3) {
            nextGrid[i][j] = 1;
        } else if (
            (value === 1) &&
            (neighbors < 2 || neighbors > 3)
        ) {
            nextGrid[i][j] = 0;
        } else {
            nextGrid[i][j] = value;
        }
        }
    }
    return nextGrid;
};

/* Contar células vizinhas (para aplicar as regras do jogo da vida) */

const countNeighbors = (grid, x, y) => {
  let sum = 0;
  const numberOfRows = grid.length;
  const numberOfCols = grid[0].length;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const row = (x + i + numberOfRows) % numberOfRows;
      const col = (y + j + numberOfCols) % numberOfCols;
      sum += grid[row][col];
    }
  }
  sum -= grid[x][y];
  return sum;
};

/* Parte visual */

const cellStrokeColor = '#aaa';
const cellSize = fieldSize / numberOfCellsInRow;

const drawGrid = (ctx, grid) => {
  ctx.strokeStyle = cellStrokeColor
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const value = grid[i][j];
      if (value) {
        ctx.fillRect(
          i * cellSize,
          j * cellSize,
          cellSize,
          cellSize,
        );
      }
      ctx.strokeRect(
        i * cellSize,
        j * cellSize,
        cellSize,
        cellSize,
      );
    }
  }
};

/* Mostrar proximo estágio */

const generation = (ctx, grid) => {
  ctx.clearRect(0, 0, fieldSize, fieldSize);
  drawGrid(ctx, grid);
  const gridOfNextGeneration = getNextGeneration(grid);
  if(framesPerSecond > 0){
    setTimeout(() => {
        requestAnimationFrame(() => generation(ctx, gridOfNextGeneration))
      }, 1000 / framesPerSecond);
  }
};

/* Executar funções ao carregar a janela */

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const grid = getRandomGrid();
  generation(ctx, grid);
};

/* Botões */

playOrPause = function(){
    if(framesPerSecond > 0){
        framesPerSecond = 0;
    }else {
        framesPerSecond = 8;
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        generation(ctx, actualGrid);
    }
};

playBtn.addEventListener("click", (event) => {
    playOrPause();
});

const restart = function() {
    framesPerSecond = 8;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, fieldSize, fieldSize);
    const grid = getRandomGrid();
    generation(ctx, grid);
};

restartBtn.addEventListener("click", (event) => {
    restart();
    playOrPause();
    setTimeout(() => {
        playOrPause();
    }, 1000);
});
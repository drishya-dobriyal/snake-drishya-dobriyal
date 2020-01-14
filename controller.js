const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function (grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function () {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const handleKeyPress = game => {
  game.turnSnake();
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), 'snake');
};

const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(SOUTH), 'ghost');
};

const setup = (game) => {
  attachEventListeners(game);
  createGrids();

  const { snake, ghostSnake, currentFood, score } = { ...game }
  drawSnake(snake.location, snake.species);
  drawSnake(ghostSnake.location, ghostSnake.species);
  drawFood(currentFood.position);
  scoreBoard(score);
};

const randomNum = (num) => Math.floor(Math.random() * num);

const eraseTail = function (previousTail, snakeSpecies) {
  let [colId, rowId] = previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snakeSpecies);
};

const drawSnake = function (snakeLocation, snakeSpecies) {
  snakeLocation.forEach(function ([colId, rowId]) {
    const cell = getCell(colId, rowId);
    cell.classList.add(snakeSpecies);
  });
};

const drawFood = function (currentFoodPosition) {
  let [colId, rowId] = currentFoodPosition;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const eraseFood = function (previousFoodPosition) {
  let [colId, rowId] = previousFoodPosition;
  const cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const scoreBoard = function (score) {
  document.getElementById('score').innerHTML = `SCORE : ${score}`;
};

const onGameComplete = score => {
  document.body.innerHTML =
    `<p class='finalDisplay'>Game Over <br><br>total score ${score}<p>`;
}

const updateScreen = function (currentStatus) {
  if (currentStatus.playerOut) {
    return onGameComplete(currentStatus.totalScore);
  }
  const {
    previousFoodPosition,
    currentFoodPosition,
    snakeTail,
    ghostSnakeTail,
    snakeSpecies,
    ghostSnakeSpecies,
    score,
    snakePosition,
    ghostSnakePosition
  } = { ...currentStatus };
  eraseFood(previousFoodPosition)
  drawFood(currentFoodPosition);

  eraseTail(snakeTail, snakeSpecies);
  drawSnake(snakePosition, snakeSpecies);
  eraseTail(ghostSnakeTail, ghostSnakeSpecies);
  drawSnake(ghostSnakePosition, ghostSnakeSpecies);

  scoreBoard(score);
};

const update = function (game, onGameComplete) {
  game.updatePosition();
  if (game.isPlayerOut(game.snake)) {
    const currentStatus = { playerOut: true, totalScore: game.score }
    updateScreen(currentStatus);
    clearInterval(onGameComplete);
    return;
  }
  updateScreen(game.getCurrentStatus());
}

const main = function () {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(randomNum(NUM_OF_COLS), randomNum(NUM_OF_ROWS));
  const scoreCard = new ScoreCard();
  const game = new Game(snake, ghostSnake, food, scoreCard);
  setup(game);

  const onGameComplete = setInterval(() => {
    update(game, onGameComplete);
  }, 200);

  setInterval(() => { game.randomlyTurnSnake(game.ghostSnake) }, 500);
};

window.onload = main;
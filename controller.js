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
  drawSnake(snake);
  drawSnake(ghostSnake);
  drawFood(currentFood);
  scoreBoard(score);
};

const randomNum = (num) => Math.floor(Math.random() * num);

const eraseTail = function (snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function (snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function (food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const eraseFood = function (food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const scoreBoard = function (score) {
  document.getElementById('score').innerHTML = `SCORE : ${score}`;
};

const randomlyTurnSnake = snake => {
  let x = Math.random() * 100;
  if (x > 50) {
    snake.turnLeft();
  }
};

const onGameComplete = score => {
  document.body.innerHTML =
    `<p class='finalDisplay'>Game Over <br><br>total score ${score}<p>`;
}

const updateScreen = function (currentStatus) {
  if (currentStatus.playerOut) {
    return onGameComplete(currentStatus.totalScore);
  }
  const { previousFood, currentFood, snake, ghostSnake, score } = { ...currentStatus };

  eraseFood(previousFood)
  drawFood(currentFood);

  eraseTail(snake);
  drawSnake(snake);
  eraseTail(ghostSnake);
  drawSnake(ghostSnake);

  scoreBoard(score);
};

const update = function (game) {
  game.updatePosition();
  if (game.isPlayerOut(game.snake)) {
    const currentStatus = { playerOut: true, totalScore: game.score }
    updateScreen(currentStatus);
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

  setInterval(() => {
    update(game);
  }, 200);

  setInterval(() => { randomlyTurnSnake(ghostSnake) }, 500);
};

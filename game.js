class Game {
  constructor(snake, ghostSnake, food, scoreCard) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.currentFood = food;
    this.previousFood = new Food(0, 0);
    this.score = 0;
    this.scoreCard = scoreCard;
  }

  isFoodEaten() {
    const [snakeColumnId, snakeRowId] = this.snake.getHeadPosition();
    const [foodColumnId, foodRowId] = this.currentFood.position;
    return (snakeRowId === foodRowId && snakeColumnId === foodColumnId);
  }

  score() {
    return this.score;
  }

  afterFoodEaten() {
    this.previousFood = this.currentFood;
    this.currentFood = new Food(randomNum(NUM_OF_COLS), randomNum(NUM_OF_ROWS));
    this.scoreCard.updatePoints();
    this.snake.grow();
  }

  updatePosition() {
    if (this.isFoodEaten()) {
      this.afterFoodEaten();
    }
    if (!this.isSnakeInRange(this.ghostSnake)) {
      this.ghostSnake.turnLeft();
    }
    this.snake.move();
    this.ghostSnake.move();
  }

  getCurrentStatus() {
    return {
      snake: this.snake,
      ghostSnake: this.ghostSnake,
      previousFood: this.previousFood,
      currentFood: this.currentFood,
      score: this.scoreCard.getPoints()
    }
  }

  turnSnake() {
    this.snake.turnLeft();
  }

  isSnakeInRange(snake) {
    const [snakeColumnId, snakeRowId] = snake.getHeadPosition();
    const isColumnInRange = 99 >= snakeColumnId && 0 <= snakeColumnId;
    const isRowInRange = 59 >= snakeRowId && 0 <= snakeRowId;
    return isColumnInRange && isRowInRange;
  }

  isPlayerOut() {
    return !this.isSnakeInRange(this.snake) || this.snake.hasTouchItself();
  }
};

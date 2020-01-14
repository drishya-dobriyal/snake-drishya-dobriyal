class Game {
  constructor(snake, ghostSnake, food) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.currentFood = food;
    this.previousFood = new Food(0, 0);
    this.score = 0;
  }
  isFoodEaten() {
    const [snakeColumnId, snakeRowId] = this.snake.getHeadPosition();
    const [foodColumnId, foodRowId] = this.currentFood.position;
    return (snakeRowId === foodRowId && snakeColumnId === foodColumnId);
  }
  score() {
    return this.score;
  }
  updatePosition() {
    if (this.isFoodEaten()) {
      this.previousFood = this.currentFood;
      this.currentFood = new Food(randomNum(NUM_OF_COLS), randomNum(NUM_OF_ROWS));
      this.score = this.score + 1;
      this.snake.grow();
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
      score: this.score
    }
  }
  turnSnake() {
    this.snake.turnLeft();
  }
  isSnakeInRange() {
    const [snakeColumnId, snakeRowId] = this.snake.getHeadPosition();
    const isColumnInRange = 0 <= snakeColumnId && 99 >= snakeColumnId;
    const isRowInRange = 0 <= snakeRowId && 59 >= snakeRowId;
    return isColumnInRange && isRowInRange;
  }
  isPlayerOut() {
    return !this.isSnakeInRange() || this.snake.hasTouchItself();
  }
};

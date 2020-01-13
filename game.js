class Game {
  constructor(snake, ghostSnake, food) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.currentFood = food;
    this.previousFood = new Food(0, 0);
    this.score = 0;
  }
  isPositionEqual() {
    const [snakeColumnId, snakeRowId] = this.snake.getHeadPosition();
    const [foodColumnId, foodRowId] = this.currentFood.position;
    return (snakeRowId === foodRowId && snakeColumnId === foodColumnId);
  }
  hasSnakeEatenFood() {
    if (this.isPositionEqual()) {
      this.previousFood = this.currentFood;
      this.currentFood = new Food(randomNum(NUM_OF_COLS), randomNum(NUM_OF_ROWS));
      return true
    }
    return false
  }
  score() {
    return this.score
  }
  updatePosition() {
    this.score = this.score + 1;
    this.snake.grow();
  }
}

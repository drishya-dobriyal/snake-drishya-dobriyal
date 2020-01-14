class ScoreCard {
  constructor() {
    this.points = 0;
  }
  updatePoints() {
    this.points += 1;
  }
  getPoints() {
    return this.points;
  }
};

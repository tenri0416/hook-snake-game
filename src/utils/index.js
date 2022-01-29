
//えさ
export const FoodPosition = (number, excludes) => {
  while (true) {
    const t = Math.floor(Math.random() * (number - 1 - 1)) + 1;
    const y = Math.floor(Math.random() * (number - 1 - 1)) + 1;
    const conflict = excludes.some(item => item.t === t && item.y === y);
    if (!conflict) {
      return { t, y }
    }
  }
}



export const filedMake = (number, snake) => {
  const fileds = []
  for (let i = 0; i < number; i++) {
    const cols = new Array(number).fill('')
    fileds.push(cols)
  }
  fileds[snake.y][snake.t] = 'snake'

  const food = FoodPosition(number, [snake])
  fileds[food.y][food.t] = "food"
  return fileds

}

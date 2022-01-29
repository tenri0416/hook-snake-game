import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './conponents/Navigation'
import { Field } from "./conponents/Field"
import { Button } from "./conponents/Button"
import { ManipulationPanel } from "./conponents/ManipulationPanel"
import { filedMake, FoodPosition } from "./utils"



const nowPosition = { t: 17, y: 17 }
const filedMakeValue = filedMake(35, nowPosition)

const Interval100 = 100
const defaultDifficulty = 3

const Difficulty = [1000, 500, 100, 50, 10]
let time = undefined

const delteTime = () => {
  if (!time) {
    //timeの中がundefined以外の場合処理を止める
    return
  }
  clearInterval(time)
}
setInterval(() => {

})
//ゲーム状態
const GameSituations = Object.freeze({
  init: 'init',
  playnow: 'playnow',
  stop: 'stop',
  gameover: 'gameover'
})
//方向
const Directions = Object.freeze({
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down'
})
//反対方向
const OppositeDirection = Object.freeze({
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up'
})
//操作
const Control = Object.freeze({
  up: { t: 0, y: -1 },
  right: { t: 1, y: 0 },
  left: { t: -1, y: 0 },
  down: { t: 0, y: 1 }
})

//キーボード
const DirectionKeys = Object.freeze({
  37: Directions.left,
  38: Directions.up,
  39: Directions.right,
  40: Directions.down,
})

const Jage = (number, position) => {
  if (position.t < 0 || position.y < 0) {
    return true
  }
  if (position.t > number - 1 || position.y > number - 1) {
    return true

  }
  return false
}

const isEatingMyself = (fields, position) => {
  return fields[position.t][position.y] === 'snake'
}

function App() {
  const [fields, setFields] = useState(filedMakeValue)
  const [body, setBody] = useState([])
  const [tick, setTick] = useState(0)
  const [start, setStart] = useState('init')
  const [direction, setDirection] = useState(Directions.up)
  const [difficulty, setDifficulty] = useState(defaultDifficulty)




  useEffect(() => {
    setBody([nowPosition])

    //ゲーム中の時間を管理する
    const interval = Difficulty[difficulty - 1]
    time = setInterval(() => {
      setTick(tick => tick + 1)

    }, interval)
    return delteTime
  }, [difficulty])

  useEffect(() => {

    if (body.length === 0 || start !== GameSituations.playnow) {
      return
    }
    const canContinue = handleControl()
    if (!canContinue) {
      setStart(GameSituations.gameover)
    }

  }, [tick])

  //ストップする関数
  const onStop = () => setStart(GameSituations.stop)

  //スタート関数
  const startNow = () => setStart(GameSituations.playnow)

  //リスタート
  const onRestart = () => {
    time = setInterval(() => {
      setTick(tick => tick + 1)
    }, Interval100)
    setStart(GameSituations.init)
    setBody([nowPosition])
    setDirection(Directions.up)
    setFields(filedMake(35, nowPosition))
  }

  //コントロールする関数
  const handleControl = () => {
    const { t, y } = body[0]
    const control = Control[direction]
    const newPosition = {
      t: t + control.t,
      y: y + control.y,
    }
    if (Jage(fields.length, newPosition) || isEatingMyself(fields, newPosition)) {
      delteTime()
      return false
    }
    const newBody = [...body]
    if (fields[newPosition.y][newPosition.t] !== 'food') {
      const removeingTrack = newBody.pop()
      fields[removeingTrack.y][removeingTrack.t] = ""
    } else {
      const food = FoodPosition(fields.length, [...newBody, newPosition])
      fields[food.y][food.t] = 'food'
    }

    //ヘビがいなくなった場所を空欄に塗り替える
    fields[newPosition.y][newPosition.t] = 'snake'
    newBody.unshift(newPosition)
    setBody(newBody)
    setFields(fields)
    return true
    //
  }

  const ChangeDirections = useCallback((newdirection) => {
    if (start !== GameSituations.playnow) {

      return direction
    }
    //ゲームのルール上進行方向と真逆への移動をさせないため
    if (OppositeDirection[direction] === newdirection) {
      return
    }
    setDirection(newdirection)
  }, [direction, start])

  const onChangeDifficulty = useCallback((difficulty) => {
    if (start !== GameSituations.init) {
      return
    }
    if (difficulty < 1 || difficulty > Difficulty.length) {
      return
    }
    setDifficulty(difficulty)
  }, [start, difficulty])

  //キーボードで動かす関数
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newdirection = DirectionKeys[e.keyCode]
      if (!newdirection) {
        return
      }
      ChangeDirections(newdirection)
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown)

  }, [ChangeDirections])


  return (

    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        <Navigation length={body.length} difficulty={difficulty} onChangeDifficulty={onChangeDifficulty} />
      </header>
      <main className="main">
        <Field fields={fields} />
        <button onClick={handleControl}>進む</button>
      </main>
      <footer className="footer">

        <Button start={start} startNow={startNow} onRestart={onRestart} onStop={onStop} />
        <ManipulationPanel ChangeDirections={ChangeDirections} />
      </footer>
    </div>


  )
}
export default App

import { React, useEffect, useState } from "react";
import "./App.css";
import Dice from "./components/Dice";
import { nanoid } from "nanoid";

import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [roll, setRoll] = useState(1);
  const [tenzies, setTenzies] = useState(false);
  const [count, setCount] = useState(0);

  // >>>>>>>>>>>>>>>>>>generate first 10 dice>>>>>>>>>>>>>>>>>>>>>>>>>

  function generateDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  //  >>>>>>>>>>>>>>timer to count how long it takes to finish game>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    const timer = () => {
      setCount(count + 1000);
    };

    if (tenzies) {
      return;
    }
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [count]);

  const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    //ES6 interpolated literals/template literals
    //If seconds is less than 10 put a zero in front.

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  let time = millisToMinutesAndSeconds(count);

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>generate best time and save it local store as well as take it from local>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  if (tenzies) {
    let previousBest = localStorage.getItem("bestTime");

    if (!previousBest) {
      localStorage.setItem("bestTime", count);
    }else{
      if(previousBest > count){
        localStorage.setItem("bestTime", count);
      }
    }
  }

  let localBest = localStorage.getItem("bestTime");

  let bestScore = millisToMinutesAndSeconds(localBest);

  // >>>>>>>>>>>>>>>>>>>>>>dice for new round>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateDice());
    }
    return newDice;
  }

  function allAreEqual(dice) {
    const result = dice.every((element) => {
      if (element === dice[0]) {
        return true;
      }
    });

    return result;
  }

  useEffect(() => {
    // dice.every((dice) => dice.isHeld === true) &&

    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allValueSame = dice.every((die) => die.value === firstValue);

    if (allHeld && allValueSame) {
      setTenzies(true);
      console.log("woon");
    }
  }, [dice]);

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  console.log(allNewDice());

  const diceElements = dice.map((item) => (
    <Dice
      value={item.value}
      key={item.id}
      isHeld={item.isHeld}
      onClick={() => holdDice(item.id)}
    />
  ));
  const refreshPage = () => {
    window.location.reload();
  };
  function rollDice() {
    if (!tenzies) {
      setDice((dice) =>
        dice.map((die) => {
          return die.isHeld ? die : generateDice();
        })
      );
      setRoll(roll + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice);
      setRoll(0);
      refreshPage();
    }
  }

  return (
    <div className="App">
      {tenzies && <Confetti />}
      <div className="board">
        <h1 className="tenzies">Tenzies</h1>
        <p className="text">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="diceContainer">{diceElements}</div>
        <button className="button" onClick={rollDice}>
          {tenzies ? "next Round" : "Roll"}
        </button>
        <div className="roll">Roll {roll}</div>
        <div className="roll">
          {tenzies ? "you complated it in" : ""} {time}
        </div>
        <div className="roll">your best score is {bestScore}</div>
      </div>
    </div>
  );
}

export default App;

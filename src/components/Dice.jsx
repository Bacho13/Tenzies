import React from "react";
import "../assets/css/dice.css";

function Dice(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  return (
    <div className="dice" style={styles} onClick={props.onClick}>
      <h1 className="number">{props.value}</h1>
    </div>
  );
}

export default Dice;

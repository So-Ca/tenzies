import React from "react"

function Die(props){
  const style = {
    backgroundColor: props.isHeld ? "#2372a0" : "transparent",
    color: props.isHeld ? "#ffffff" : "#000000"
  }
  return(
    <div onClick={props.function} style={style} className="die-face">
      <h1 className="dice-num">{props.value}</h1>
    </div>
  )
}

export default Die
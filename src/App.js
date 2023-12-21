import React, {useState, useEffect} from "react"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Die from "./components/Die"

function App(){

  const [numbers, setNumber] = useState( allNewDice() )
  const [tenzies, setTenzies] = useState( false )
  const [rolls, setRolls] = useState( 0 )
  const [startTime, setStartTime] = useState( 0 )
  const [endTime, setEndTime] = useState( 0 )
  const [bestTime, setBestTime] = useState( localStorage.getItem("bestTime") || null)
  const time = startTime - endTime

  const dice = numbers.map( die => (
    <Die 
      function={()=>{ hold(die.id) }}
      value={die.value}
      isHeld={die.isHeld}
      key={die.id}
    />
  ))

  function generateNewDice(){
    return {
      id: nanoid(),
      value: Math.floor( Math.random() * 6 ),
      isHeld: false
    }
  }

  function allNewDice(){
    const newDice = []
    for(let i=0; i<10; i++ ){
      newDice.push( generateNewDice() )
    }
    return newDice
  }

  function roll(){
    if(!startTime){
      setStartTime( Date.now() / 1000000000000 )
    }

    if(tenzies){
      setTenzies( false )
      setNumber( allNewDice() )
      setRolls( 0 )
      setEndTime( Date.now() / 1000000000000 )
    } else {
      setNumber( prevNum => prevNum.map( die => (
        die.isHeld ? die : generateNewDice()
      )))
      setRolls( rolls + 1 )
    }
  }
  
  function hold(id){
    setNumber( prevNum => prevNum.map( die => (
      die.id === id ? {...die, isHeld: !die.isHeld} : die
      ))
    )
  }

  useEffect( () => {
    const firstValue = numbers[0].value
    const allSameValue = numbers.every( die => die.value === firstValue)
    const allHeld = numbers.every( die => die.isHeld)

    if(allHeld && allSameValue){
      setTenzies( true )
      if(bestTime || time < bestTime){
        setBestTime( time.toFixed(2) )
        localStorage.setItem("bestTime", time.toFixed(2))
      }
    }
  }, [numbers])

  return(
    <main>
      <h1 className="title">Tenzies</h1>
      {tenzies && <h2 className="win">Hai Vinto</h2>}
      <p className="instruction">Roll untill all Dice are the same. Click each Dice to freeze the value.</p>
      <p className="instruction">Elapsed Time: {tenzies &&`${ time.toFixed(2)} seconds`} </p>
      <p className="instruction">Best Time: {bestTime}</p>
      <p className="instruction">Rolls: {rolls}</p>
      <div className="dice-container">
        {dice}
      </div>
      <button onClick={roll} className="roll-btn">{tenzies ? "New Game" : "Roll"}</button>
      {tenzies && <Confetti/>}
    </main>
  )
}

export default App
import React, { Component, useState } from "react";
import WheelComponent from "react-wheel-of-prizes";
//import "react-wheel-of-prizes/dist/index.css";
import logo from './logo.png';
import wine from './wine.svg';

const frendsObj = [
  {
    name: 'Alex'
  },
  {
    name: 'Filip'
  },
  {
    name: 'Poul'
  },
  {
    name: 'Joacim'
  },
  {
    name: 'Celine'
  },
  {
    name: 'Lucas'
  },
  {
    name: 'Arne',
  },
  {
    name: 'Håkon'
  },
  {
    name: 'Andreas'
  },
  {
    name: 'Anette'
  },
  {
    name: 'Christoffer'
  },
  {
    name: 'Dennis'
  },
  {
    name: 'Elise'
  },
  {
    name: 'Emil'
  },
  {
    name: 'Henrik'
  },
  {
    name: 'Magnus'
  },{
    name: 'Madeleine'
  },{
    name: 'Sondre'
  },{
    name: 'Stian'
  },{
    name: 'Trym'
  },{
    name: 'Veronica'
  },{
    name: 'Victoria'
  }
];

const App = () => {
  const [step, setStep] = useState(1);
  const [frends, setFrends] = useState([]);
  const [start, setStart] = useState(false);

  console.log(frends);
  let color = '#e0c5f9';

  let wheelStyleGradient = 'conic-gradient(';
  for(let i = 0; i < frends.length; i++) {
    if(color === "#e0c5f9") {
      wheelStyleGradient += '#0B0426';
      color = "#0B0426";
    } else if( color === "#0B0426") {
      wheelStyleGradient += '#12B046';
      color = "#12B046";
    } else {
      wheelStyleGradient += '#e0c5f9';
      color = "#e0c5f9";
    }
    wheelStyleGradient += ' 0 ' + (100/frends.length * (i + 1)) + '%';
    if(i !== frends.length - 1) {
      wheelStyleGradient += ",";
    }
  }
  wheelStyleGradient += ')';
  console.log(wheelStyleGradient );

  let rotate = 0;
  if(start) {
    rotate = Math.random() * (360 * 10 - 1000) + 1000;
  }
  const slice = 360 / frends.length;

  return (
    <div className="app">
      <div className="wrap">
        <img className="logo" src={logo} />
      <div className={`screen ${step === 1 ? 'active' : ''}`}>
        <h1>Pick your frends</h1>
        <div className="frend-picker">
        {frendsObj.map((frend, key) => 
          <span className={frends.includes(frend.name) ? 'active' : ''} onClick={() => {setFrends([...frends, frend.name]);}}><span></span>{frend.name}</span>
        )}
        </div>
        <button onClick={() => setStep(2)}>Get wined up</button>
        </div>
        <div className={`wheel-screen screen ${step === 2 ? 'active' : ''}`}>
          
        <div className="wheel" style={{backgroundImage: wheelStyleGradient}}>
          <img className="wine" src={wine} onClick={() => {setStart(true)}} style={{transform: 'translateY(-50%) translateX(-50%) rotate('+ rotate +'deg)'}}/>
          {frends.map((frend, key) => 
            <span style={{transform: 'rotate('+((slice * key + slice / 2) - 90 )+'deg)'}}>{frend}</span>  
          )}
        </div>
        <div style={{marginTop: "20px"}} onClick={() => {setStart(false)}}>reset</div>
      </div>
      </div>
    </div>
  );
};

export default App;


{/*<WheelComponent
          segments={frends}
          segColors={segColors}
          winningSegment="won 60"
          onFinished={(winner) => onFinished(winner)}
          primaryColor="black"
          contrastColor="white"
          buttonText="hello"
          size={500}
        /> */}
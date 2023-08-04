import React, { useEffect, useState } from "react";
//import "react-wheel-of-prizes/dist/index.css";
import logo from './logo.png';
import wine from './wine.svg';
import spinningAudio from './audio.mp3';

const frendsSource = [
  'Alex',
  'Filip',
  'Poul',
  'Joakim R',
  'Joakim F',
  'Celine',
  'Lucas',
  'Arne',
  'Håkon',
  'Andreas',
  'Anette',
  'Christoffer',
  'Dennis',
  'Emil',
  'Henrik',
  'Magnus',
  'Madeleine',
  'Sondre',
  'Stian',
  'Trym',
  'Victoria',
  'Sebastian A',
  'Sebastian P',
  'Sebastian H',
  'Martin',
];
frendsSource.sort();

const App = () => {
  const [step, setStep] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [frends, setFrends] = useState({});
  const [start, setStart] = useState(false);
  const [winner, setWinner] = useState(false);

  useEffect(() => {
    if(start) {
      const newRotate = Math.random() * (360 * 10 - 3000) + 3000;
      setRotate(newRotate);
      const final = newRotate % 360;
      for(let i = 0; i < conicPlacement.length; i++) {
        if(final < conicPlacement[i]) {
          setWinner(Object.keys(frends)[i]);
          break;
        }
      }
    }
  }, [start]);

  const colors = [
    '#0B0426',
    "#e0c5f9",
    "#12B046",
    "#FFB23C",
    "#875EFF",
    "#FF6060"
  ];
  let color = 0;
  let tickets = 0;

  for (const [key, value] of Object.entries(frends)) {
    tickets += value;
  }
  const slice = 360 / tickets;
  let wheelStyleGradient = 'conic-gradient(';
  let currentPercentage = 0;
  const namePlacement = [];
  const conicPlacement = [];
  let currentNamePlacement = -90;
  for (const [key, value] of Object.entries(frends)) {
    wheelStyleGradient += colors[color];
    currentPercentage += 100/tickets * value;
    wheelStyleGradient += ' 0 ' + currentPercentage + '%,';
    currentNamePlacement = currentNamePlacement + slice * value;
    namePlacement.push(currentNamePlacement - (slice * value) / 2);
    conicPlacement.push(currentNamePlacement + 90);
    color++;

    if(color > colors.length - 1) {
      color = 0;
    }
  }
  wheelStyleGradient = wheelStyleGradient.substring(0, wheelStyleGradient.length-1);
  wheelStyleGradient += ')';
  

  const handleFrends = (frend, add) => {
    const newFrend = {};
    if(add) {
      if(frends[frend]) {
        newFrend[frend] = frends[frend] + 1;
      } else {
        newFrend[frend] = 1;
      }
    } else {
      newFrend[frend] = frends[frend] - 1;
    }
    console.log(newFrend);
    
    setFrends({
      ...frends,
      ...newFrend
    });
  }

  return (
    <div className="app">
      <div className="wrap">
        <img alt="" className="logo" src={logo} />
      <div className={`screen ${step === 1 ? 'active' : ''}`}>
        <h1>Pick your frends</h1>
        <div className="frend-picker">
        {frendsSource.map((frend, key) => 
          <span className={frends[frend] ? 'active' : ''} onClick={() => {
            if(!frends[frend]) {
              handleFrends(frend, true);
            }
          }}>
            {frend}
            <div>
              <span className="minus" onClick={() => handleFrends(frend, false)}>-</span>
              <span className="count">{frends[frend]}</span>
              <span className="plus" onClick={() => handleFrends(frend, true)}>+</span>
            </div>
          </span>
        )}
        </div>
        <button onClick={() => setStep(2)} disabled={!Object.keys(frends).length}>Get wined up</button>
        </div>
        {winner &&
          <div className="winner">
            {winner}!  
          </div> 
        }
        {start &&
          <audio autoPlay>
            <source src={spinningAudio} type="audio/mp3"></source>
          </audio>
        }
        <div className={`wheel-screen screen ${step === 2 ? 'active' : ''}`}> 
          <div className="wheel" style={{backgroundImage: wheelStyleGradient}}>
            <img alt="" className={`wine ${start ? 'start' : 'stop'}`} src={wine} onClick={() => {setStart(true)}} style={{transform: 'translateY(-50%) translateX(-50%) rotate('+ rotate +'deg)'}}/>
            {Object.keys(frends).map((frend, key) => 
              <span style={{transform: 'rotate('+namePlacement[key]+'deg)'}}>
                {frends[frend] ? frend : ''}
              </span>  
            )}
          </div>
          <div style={{marginTop: "20px"}} onClick={() => {setStart(false); setRotate(0); setWinner(false); setStep(1)}}>reset</div>
      </div>
      </div>
    </div>
  );
};

export default App;
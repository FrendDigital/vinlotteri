import React, { useEffect, useState } from "react";
//import "react-wheel-of-prizes/dist/index.css";
import logo from './logo.png';
import wine from './wine.svg';
import spinningAudio from './audio.mp3';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const frendsSource = [
  'Alex',
  'Filip',
  'Poul',
  'Joacim',
  'Celine',
  'Lucas',
  'Arne',
  'Håkon',
  'Andreas',
  'Anette',
  'Christoffer',
  'Dennis',
  'Elise',
  'Emil',
  'Henrik',
  'Magnus',
  'Madeleine',
  'Sondre',
  'Stian',
  'Trym',
  'Veronica',
  'Victoria',
  'Herman',
  'Sebastian',
];
frendsSource.sort();
const WS_URL = 'ws://localhost:8000';

const App = () => {
  const [step, setStep] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [frends, setFrends] = useState({});
  const [start, setStart] = useState(false);
  const [winner, setWinner] = useState(false);

  const [username, setUsername] = useState('');
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true
  });

  useEffect(() => {
    if(username && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username,
        type: 'userevent'
      });
    } else {
      sendJsonMessage({type: 'history'});
    }
  }, [username, sendJsonMessage, readyState]);

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
      <LoginSection onLogin={setUsername}/>
      <EditorSection/>
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


function isUserEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'userevent';
}

function isDocumentEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'contentchange';
}

function LoginSection({ onLogin }) {
  const [username, setUsername] = useState('');
  useWebSocket(WS_URL, {
    share: true,
    filter: () => false
  });
  function logInUser() {
    if(!username.trim()) {
      return;
    }
    onLogin && onLogin(username);
  }

  return (
    <div className="account">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="account__profile">
            <p className="account__name">Hello, user!</p>
            <p className="account__sub">Join to edit the document</p>
          </div>
          <input name="username" onInput={(e) => setUsername(e.target.value)} className="form-control" />
          <button
            type="button"
            onClick={() => logInUser()}
            className="btn btn-primary account__btn">Join</button>
        </div>
      </div>
    </div>
  );
}

function History() {
  console.log('history');
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isUserEvent
  });
  const activities = lastJsonMessage?.data.userActivity || [];
  return (
    <ul>
      {activities.map((activity, index) => <li key={`activity-${index}`}>{activity}</li>)}
    </ul>
  );
}

function Users() {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isUserEvent
  });
  const users = Object.values(lastJsonMessage?.data.users || {});
  return users.map(user => (
    <div key={user.username}>
      <span id={user.username} className="userInfo" key={user.username}>
        -
      </span>
      <div>
        {user.username}
      </div>
    </div>
  ));
}

function EditorSection() {
  return (
    <div className="main-content">
      <div className="document-holder">
        <div className="currentusers">
          <Users/>
        </div>
        <Document/>
      </div>
      <div className="history-holder">
        <History/>
      </div>
    </div>
  );
}

function Document() {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isDocumentEvent
  });

  let html = lastJsonMessage?.data.editorContent || '';

  function handleHtmlChange(e) {
    sendJsonMessage({
      type: 'contentchange',
      content: e.target.value
    });
  }

  return (
    <input value={html} onChange={handleHtmlChange} />
  );
}

export default App;
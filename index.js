function App() {
  const initState = {
    time: {
      session: 25 * 60,
      break: 5 * 60
    },
    mode: 'default',
    isTicking: false,
    isResuming: false,
    pushedButton: '',
  }

  const [time, setTime] = React.useState(initState.time);
  const [currTime, setCurrTime] = React.useState(initState.time);
  const [mode, setMode] = React.useState(initState.mode);
  const [isTicking, toggleTicking] = React.useState(initState.isTicking);
  const [isResuming, toggleResuming] = React.useState(initState.isResuming);
  const [pushedPlus, togglePlus] = React.useState(initState.pushedButton);
  const [pushedMode, toggleMode] = React.useState(initState.pushedButton);
  const [pushedMinus, toggleMinus] = React.useState(initState.pushedButton);

  function startSession() {
    setMode('session');
    let intervalId = setInterval(() => {
      setCurrTime(prev => {
        return {
          session: prev.session - 1,
          break: prev.break
        };
      });
    }, 1000);
    
    localStorage.setItem('interval-id', intervalId);
    
    let timeoutId = setTimeout(() => {
      const audio = new Audio('./media/ring.m4a');
      audio.play();
      clearInterval(intervalId);
      setCurrTime(time);
      startBreak();
    }, currTime.session * 1000);
    
    localStorage.setItem('timeout-id', timeoutId);
  }

  function startBreak() {
    setMode('break');
    let intervalId = setInterval(() => {
      setCurrTime(prev => {
        return {
          session: prev.session,
          break: prev.break - 1
        };
      });
    }, 1000);
    
    localStorage.setItem('interval-id', intervalId);
    
    let timeoutId = setTimeout(() => {
      const audio = new Audio('./media/ring.m4a');
      audio.play();
      clearInterval(intervalId);
      setCurrTime(time);
      startSession();
    }, currTime.break * 1000);
    
    localStorage.setItem('timeout-id', timeoutId);
  }

  function stopTicking() {
    clearInterval(localStorage.getItem('interval-id'));
    clearTimeout(localStorage.getItem('timeout-id'));
    localStorage.clear();
  }

  return (
    <main>
      <div className='top-buttons'>
        <div className='button-wrapper plus-button'>
          <button onClick={() => {
            togglePlus('button-pushed');
            setTimeout(() => togglePlus(''), 500);
            if(isTicking) return;
            setCurrTime(changeTime(mode, currTime, '+'));
            setTime(changeTime(mode, time, '+'));
          }} className={pushedPlus}>
          </button>
          <div className='button-neck'></div>
          <p>Plus</p>
        </div>
        
        <div className='button-wrapper mode-button'>
          <button onClick={() => {
            toggleMode('button-pushed');
            setTimeout(() => toggleMode(''), 500);
            if(isTicking) return;
            setMode(changeMode(mode));
          }} className={pushedMode}>
          </button>
          <div className='button-neck'></div>
          <p>Mode</p>
        </div>
        
        <div className='button-wrapper minus-button'>
          <button onClick={() => {
            toggleMinus('button-pushed');
            setTimeout(() => toggleMinus(''), 500);
            if(isTicking) return;
            setCurrTime(changeTime(mode, currTime, '-'));
            setTime(changeTime(mode, time, '-'));
          }} className={pushedMinus}>
          </button>
          <div className='button-neck'></div>
          <p>Minus</p>
        </div>
      </div>
      
      <div className='inner-main'>
        <img className='title-svg' src='./media/h1.svg' alt='title' />
       
        <hr />
        
        <div className='display-wrapper'>
          <TimeDisplay title='session' time={currTime.session} mode={mode}/>
          <TimeDisplay title='break' time={currTime.break} mode={mode}/>
        </div>
        
        <div className='controll-wrapper'>
          <button onClick={() => {
            console.log(isTicking);
            if(isTicking) return;
            toggleTicking(true);
            if(!isResuming) {
              setMode('session');
              startSession();
            } else {
              switch(mode) {
                case 'session':
                  startSession();
                  break;
                case 'break':
                  startBreak();
                  break;
                default:
                  startSession();
                  break;
              }
            }
          }}>Start</button>
          
          <button onClick={() => {
            toggleTicking(false);
            setCurrTime(time);
            setMode('default');
            stopTicking();
            toggleResuming(false);
          }}>Reset</button>
          <button onClick={() => {
            stopTicking();
            toggleResuming(true);
            toggleTicking(false);
          }}>Stop</button>
        </div>
        
        <p className='creator'>By Urey Miller</p>
      </div>        
    </main>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);

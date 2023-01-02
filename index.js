function App() {
  const initState = {
    time: {
      session: 5,
      break: 10
    },
    mode: "default",
    isTicking: false,
    isResuming: false
  }

  const [time, setTime] = React.useState(initState.time);
  const [currTime, setCurrTime] = React.useState(initState.time);
  const [mode, setMode] = React.useState(initState.mode);
  const [isTicking, toggleTicking] = React.useState(initState.isTicking);
  const [isResuming, toggleResuming] = React.useState(initState.isResuming);

  function startSession() {
    setMode("session");
    let intervalId = setInterval(() => {
      setCurrTime(prev => {
        return {
          session: prev.session - 1,
          break: prev.break
        };
      });
    }, 1000);

    localStorage.setItem("interval-id", intervalId);
    
    let timeoutId = setTimeout(() => {
      alert("RINGG!!");
      clearInterval(intervalId);
      setCurrTime(time);
      startBreak();
    }, currTime.session * 1000 + 500);

    localStorage.setItem("timeout-id", timeoutId);
  }

  function startBreak() {
    setMode("break");
    let intervalId = setInterval(() => {
      setCurrTime(prev => {
        return {
          session: prev.session,
          break: prev.break - 1
        };
      });
    }, 1000);
    
    localStorage.setItem("interval-id", intervalId);
    
    let timeoutId = setTimeout(() => {
      alert("RINGG!!");
      clearInterval(intervalId);
      setCurrTime(time);
      startSession();
    }, currTime.break * 1000 + 500);
    
    localStorage.setItem("timeout-id", timeoutId);
  }

  function stopTicking() {
    clearInterval(localStorage.getItem('interval-id'));
    clearTimeout(localStorage.getItem('timeout-id'));
    localStorage.clear();
  }

  return (
    <main>
      <div className="button-wrapper">
        <button onClick={() => {
          if(isTicking) return;
          setCurrTime(changeTime(mode, currTime, "+"));
          setTime(changeTime(mode, time, "+"));
        }}>Plus</button>
        <button onClick={() => {
          if(isTicking) return;
          setMode(changeMode(mode));
        }}>Mode</button>
        <button onClick={() => {
          if(isTicking) return;
          setCurrTime(changeTime(mode, currTime, "-"));
          setTime(changeTime(mode, Time, "-"));
        }}>Minus</button>
      </div>
      <h1>Title</h1>
      <hr />
      <div className="display-wrapper">
        <TimeDisplay title="session" time={currTime.session} mode={mode}/>
        <TimeDisplay title="break" time={currTime.break} mode={mode}/>
      </div>
      <div className="controll-wrapper">
        <button onClick={() => {
          if(isTicking) return;
          toggleTicking(true);
          if(!isResuming) {
            setMode('session');
            startSession();
          } else {
            switch(mode) {
              case "session":
                startSession();
                break;
              case "break":
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
          setMode("default");
          stopTicking();
          toggleResuming(false);
        }}>Reset</button>
        <button onClick={() => {
          stopTicking();
          toggleResuming(true);
        }}>Stop</button>
      </div>
    </main>
  );
}

function TimeDisplay(props) {
  const classMode = props.title == props.mode ? " highlighted" : ""; 
  const className = "display-wrapper" + classMode;

  return (
    <div className={className}>
      <h2 className="display-title">{props.title}</h2>
      <p className="display-time">{convertTime(props.time)}</p>
    </div>
  );
}

function convertTime(secs) {
  let minutes = Math.floor(secs / 60);
  let seconds = secs % 60;
  if(minutes < 10) minutes = "0" + minutes;
  if(seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function changeTime(currMode, currTime, operation) {
  if(checkIfCapped(currMode, currTime, operation)) return currTime;

  switch(currMode) {
    case "session":
      return {
        session: operation == "+" ?
          toFullMinutes(currTime.session + 60) :
          toFullMinutes(currTime.session - 60),
        break: currTime.break
      };
    case "break":
      return {
        session: currTime.session,
        break: operation == "+" ?
          toFullMinutes(currTime.break + 60) :
          toFullMinutes(currTime.break - 60)
      };
    default:
      return currTime;
  }
}

function toFullMinutes(secs) {
  return Math.floor(secs / 60) * 60;
}

function checkIfCapped(currMode, currTime, operation) {
  switch(operation) {
    case "+":
      return currTime[currMode] >= 99 * 60;
    case "-":
      return currTime[currMode] <= 1 * 60;
  }
}

function changeMode(currMode) {
  switch(currMode) {
    case "default":
      return "session";
    case "session":
      return "break";
    case "break":
      return "default";
    default:
      return currMode;
  }
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);

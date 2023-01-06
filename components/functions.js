function convertTime(secs) {
  let minutes = Math.floor(secs / 60);
  let seconds = secs % 60;
  if(minutes < 10) minutes = '0' + minutes;
  if(seconds < 10) seconds = '0' + seconds;
  return minutes + ':' + seconds;
}

function changeTime(currMode, currTime, operation) {
  if(checkIfCapped(currMode, currTime, operation)) return currTime;

  switch(currMode) {
    case 'session':
      return {
        session: operation == '+' ?
          toFullMinutes(currTime.session + 60) :
          toFullMinutes(currTime.session - 60),
        break: currTime.break
      };
    case 'break':
      return {
        session: currTime.session,
        break: operation == '+' ?
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
    case '+':
      return currTime[currMode] >= 99 * 60;
    case '-':
      return currTime[currMode] <= 1 * 60;
  }
}

function changeMode(currMode) {
  switch(currMode) {
    case 'default':
      return 'session';
    case 'session':
      return 'break';
    case 'break':
      return 'default';
    default:
      return currMode;
  }
}



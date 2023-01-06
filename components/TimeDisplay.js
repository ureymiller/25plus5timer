function TimeDisplay(props) {
  const classMode = props.title == props.mode ? ' highlighted' : '';
  const className = 'displays' + classMode;

  return (
    <div className={className}>
      <h2 className='display-title'>{props.title}</h2>
      <p className='display-time'>{convertTime(props.time)}</p>
    </div>
  );
}

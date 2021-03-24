import './App.css';
import React from 'react';

function Square({audio, playing, state, quarter, onClick}) {
  let status = "off";
  
  React.useEffect(() => {
    const playSound = () => {
      if (playing && state) {
        if (audio.audio.paused) {
          audio.audio.play();
        } else {
          audio.audio.currentTime = 0;
        }
          
        if (audio.choke) {
          if (!audio.choke.paused) {
            audio.choke.audio.pause();
            audio.choke.audio.currentTime = 0;
          }
        }
      }
    }
    playSound();
    // eslint-disable-next-line
  }, [playing]);

  if (playing) {
    status = "playing";
  } else if (state) {
    status = "on";
  }

  if (quarter) {
    status += " quarter"
  }

  return (
    <button onClick={onClick} className={status + " square"} />
  )
}

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonState: Array(64).fill(false)
    }
    let hat = {audio: new Audio("/op-hat.wav")}; // There must be a better way to do this
    this.audio = [hat, {audio: new Audio("/cl-hat.wav"), choke: hat}, {audio: new Audio("/snare.wav")}, {audio: new Audio("/kick.wav")}];
  }

  handleClick(index) {
    const squares = this.state.buttonState.slice();
    squares[index] = !squares[index];
    this.setState({buttonState: squares});
  }

  render() {
    const instruments = [];
    
    for (let i = 0; i < 4; i++) {
      const row = []
      for (let j = 0; j < 16; j++) {
        let index = i*16+j;
        row.push(<Square
          playing={index % 16 === this.props.playingSquares && this.props.playing}
          key={index}
          state={this.state.buttonState[index]}
          onClick={() => this.handleClick(index)}
          audio={this.audio[i]}
          quarter={index % 4 === 0}
          />);
      }
      instruments.push(<div key={i}>{row}</div>);
    }

    return (
      <div className="Grid">{instruments}</div>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      playingSquares: -1,
      value: "120"
    }

    this.handleChange = this.handleChange.bind(this)
    this.startInterval = this.startInterval.bind(this)
    this.endInterval = this.endInterval.bind(this);
  }

  tick() {
    const next = (this.state.playingSquares + 1) % 16;
    this.setState({playingSquares: next});
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }

  startInterval() {
    this.tick();
    this.timerId = setTimeout(this.startInterval, Math.min(500,  15000/this.state.value))
  }

  endInterval() {
    clearTimeout(this.timerId)
  }

  handlePlay() {
    if (this.state.playing) {
      clearInterval(this.timerId);
      this.setState({playing: false, playingSquares: -1});
    } else {
      this.startInterval();
      this.setState({playing: true});
    }
  }

  render() {
    return (
      <div className="App" onKeyDown={(event) => {if (event.key === " ") { this.handlePlay() }}}>
        <Grid playingSquares={this.state.playingSquares} playing={this.state.playing}/>
        <div className="InputDiv">
          <button
          className={"ButtonContainer Input"}
          onClick={() => this.handlePlay()}
          tabIndex={-1}>
            <div className={(this.state.playing ? " Stop" : " Play")}/>
          </button>
          <input
          className="Input"
          type="number"
          value={this.state.value}
          onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
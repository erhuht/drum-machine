import './App.css';
import React from 'react';

function Square(props) {
  let status = "off";
  if (props.playing) {
    status = "playing";
    if (props.state) { props.audio.play(); }
  } else if (props.state) {
    status = "on";
  }

  return (
    <button onClick={props.onClick} className={status}>Button</button>
  )
}

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonState: Array(64).fill(false)
    }
    this.audio = new Audio("/kick.wav");
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
          audio={this.audio}
          />);
      }
      instruments.push(<div key={i}>{row}</div>);
    }

    return (
      <div>{instruments}</div>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      playingSquares: 0
    }
  }

  tick() {
    const next = (this.state.playingSquares + 1) % 16;
    this.setState({playingSquares: next});
  }

  handlePlay() {
    if (this.state.playing) {
      clearInterval(this.timerId);
      this.setState({playing: false, playingSquares: 0});
    } else {
      this.timerId = setInterval(
        () => this.tick(),
        500
      )
      this.setState({playing: true});
    }
  }

  render() {
    return (
      <div className="App">
        <Grid playingSquares={this.state.playingSquares} playing={this.state.playing}/>
        <button onClick={() => this.handlePlay()}>Play</button>
      </div>
    );
  }
}

export default App;
import React, { Component } from 'react';
import './app.css';
import { Button, Card, CardTitle, CardText } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client'

const serverAddress = "http://localhost:3000"

export default class App extends Component {

  constructor(props) {
    super(props);
    this.display = React.createRef();
    this.socket = null,
    this.state = {
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'],
      HANDSIZE: 20,
      HANDCLOSEDCOLOR: "red",
      HANDOPENCOLOR:"green",
      HANDLASSOCOLOR: "blue"    
    }
  }

  updateHandState(handState, jointPoint) {
    switch (handState) {
      case 3:
        this.drawHand(jointPoint, this.state.HANDCLOSEDCOLOR);
      break;
      case 2:
        this.drawHand(jointPoint, this.state.HANDOPENCOLOR);
      break;
      case 4:
        this.drawHand(jointPoint, this.state.HANDLASSOCOLOR);
      break;
    }
  }

  drawHand(jointPoint, handColor) {
    // draw semi transparent hand cicles
    let ctx = this.display.current.getContext('2d');
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.fillStyle = handColor;
    ctx.arc(jointPoint.depthX * 512, jointPoint.depthY * 424, this.stateHANDSIZE, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }

  componentDidMount() {
    console.log("react ready to go through")
    let self = this

    self.socket = io(serverAddress);
    
    self.socket.on('bodyFrame', bodyFrame => {
      let ctx = self.display.current.getContext('2d');
      ctx.clearRect(0, 0, self.display.current.width, self.display.current.height);
      let index = 0;
      let colors = self.state.colors;

      bodyFrame.bodies.forEach(function(body){
        if(body.tracked) {
          for(let jointType in body.joints) {
            let joint = body.joints[jointType];
            ctx.fillStyle = colors[index];
            ctx.fillRect(joint.depthX * 512, joint.depthY * 424, 10, 10);
          }
          //draw hand states
          self.updateHandState(body.leftHandState, body.joints[7]);
          self.updateHandState(body.rightHandState, body.joints[11]);
          index++;
        }
      });

    });
  };

  clickRecordButton() {
    fetch('/api/startRecord')
  }

  render() {
    return (
      <React.Fragment>
        <div className="container" style={{ marginTop:'10rem' }} >
          <div className="text-center">
            <h1 className="recordText">동작을 녹화할 수 있는 화면입니다.</h1>
          </div>
          <div class="row">
            <div className="col-4"></div>
            <div className="col-4">
              <div className="text-center">
              <canvas className="display" width="512" height="424" ref={this.display}></canvas>
              <Button color="danger" className="mr-3" onClick={this.clickRecordButton}>녹화하기</Button>
              </div>           
            </div>   
            <div className="col-4"></div>           
          </div>            
        </div>
      </React.Fragment>
    );
  }
}

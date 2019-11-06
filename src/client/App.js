import React, { Component } from 'react';
import './app.css';
import { Button, Card, CardTitle, CardText } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component {
  state = { username: null };

  clickRecordButton() {
    fetch('/api/startRecord')
  }

  clickStopButton() {
    fetch('/api/stopRecord')
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
                <Card body inverse color="primary" className="mb-5">
                  <CardTitle>키넥트 졸라맨이 들어갈 자리</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                </Card>
                <Button color="danger" className="mr-3" onClick={this.clickRecordButton}>녹화하기</Button>
                <Button color="primary" onClick={this.clickStopButton}>녹화 종료하기</Button>
              </div>           
            </div>   
            <div className="col-4"></div>           
          </div>            
        </div>
      </React.Fragment>
    );
  }
}

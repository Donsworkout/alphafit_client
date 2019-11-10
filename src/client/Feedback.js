import React, { Component } from 'react';

class Feedback extends Component {
  static defaultProps = {
    feedback: {
        reps: 0,
        majorProblems: '분석되지 않았습니다',
        minorProblems: '분석되지 않았습니다',
        strength: '분석되지 않았습니다'
    }
  }
  
  render() {
    const style = {
      padding: '8px',
      margin: '8px'
    };

    const {
      reps, majorProblems, minorProblems, strength
    } = this.props.feedback;
    
    return (
      <div style={style}>
        <div>총 <b>{reps}</b>개의 스쿼트 동작이 분석되었습니다</div>
        <div>주요 문제점 : {majorProblems}</div>
        <div>사소한 문제점 : {minorProblems}</div>
        <div>강점 : {strength}</div>
      </div>
    );
  }
}

export default Feedback;
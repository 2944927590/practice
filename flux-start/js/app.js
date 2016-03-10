import React from 'react';
import MyButton from './button.js';

let App = React.createClass({
  render(){
    return (
      <MyButton />
    );
  }
});

React.render(
  <App />,
  document.getElementById("app")
)

import React from 'react';
import ReactDOM from 'react-dom';
import DoenetTest from './DoenetTest.jsx';
import axios from 'axios';
import DateTime from "../../_reactComponents/PanelHeaderComponents/DateTime"

// function DoenetTest(props){

//   axios.post('/api/test.php',{}).then((resp) => console.log('>>>resp', resp.data));

//   return <p>test</p>
// }

ReactDOM.render(
  // <DoenetTest />,
  <DoenetDateTime
  selected={this.state.date}
  onChange={(date)=>{
    this.props.callBack(date.toString());
    this.setState({date:date})
  }}  
  disabled={this.writePriviledge}
/>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  console.log(">>>import.meta.hot")
  // import.meta.hot.accept(({module}) => {
  //   console.log(">>>ACCEPT CALLED!!!!!!!!!")
  // }
  // );
  import.meta.hot.accept();
}  

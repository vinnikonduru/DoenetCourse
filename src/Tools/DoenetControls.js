import React from 'react';
import { 
  BrowserRouter as Router, 
  Link, 
  Route 
} from 'react-router-dom';
import styled from 'styled-components';
import GlobalFont from "../fonts/GlobalFont.js";

//=== COMPONENT IMPORTS ===
import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../imports/PanelHeaderComponents/ActionButtonGroup.js";
import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
import ToggleButton from '../imports/PanelHeaderComponents/ToggleButton.js';
import Button from "../imports/PanelHeaderComponents/Button.js";
import Textfield from '../imports/PanelHeaderComponents/Textfield.js';
import UnitMenu from '../imports/PanelHeaderComponents/UnitMenu.js';
import VerticalDivider from '../imports/PanelHeaderComponents/VerticalDivider.js';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// === HOW TO ADD TO CONTROLS ===
// 1. Import the component in the COMPONENT IMPORTS SECTION above
// 2. Copy and paste this into the DATA STRUCTURE section below in alphabetical order
// {
//   name: 'Title of the component', EXAMPLE: 'UnitMenu'
//   id: 'Url addition, all lowercase', EXAMPLE: 'unitmenu'
//   code: component tag used to create it, same as import, no quotation marks, EXAMPLE: UnitMenu
//   codePreview: example of how the code looks for most basic form of the component, EXAMPLE: <UnitMenu {units: ['EM', 'PX', 'PT']}
//   req_props: {props needed for component to exist, null for most cases, written in this form: name: 'option}, EXAMPLE: {units: ['EM', 'PX', 'PT']}
//   req_children: children needed to show how the component works, null for most cases, EXAMPLE: null,
//   use: 'talk about why this thing exists', EXAMPLE: 'Adds added changable units for a textfield.'
//   props: [
//       {name: 'Title of prop', EXAMPLE: 'Label'
//       propPreview: 'example of the component code with the prop', EXAMPLE: '<UnitMenu units={['EM', 'PX', 'PT']} label='Label: '>'
//       propCode: {prop code written in this form: name: 'option'}, EXAMPLE: {units: ['EM', 'PT', 'PX'], label: 'Label: '}
//       description: 'talk about why this prop exists'}, EXAMPLE: 'Adds label in front of the component.'
//   ]
// },

const NavBar = styled.div`
  width: 240px;
  height: 100vh;
  position: fixed;
  background-color: #8FB8DE;
  color: #000;
  top: 0;
  left: 0;
  overflow-x: hidden;
  z-index: 1
`
const Content = styled.div`
  margin-left: 240px
`

const List = styled.ul`
  color: black
`

export default function attempt() {

//=== DATA STRUCTURE SECTION ===
  let dataStructure = [
    {
      name: 'ActionButton',
      id: 'actionbutton',
      code: ActionButton,
      codePreview: '<ActionButton/>',
      req_props: null,
      req_children: null,
      use: 'This is the simpler button styling. Can be used in ActionButtonGroup to place related buttons together.',
      props: [
          {name: 'Size',
          propPreview: '<ActionButton size="medium"/>',
          propCode: {size: 'medium'},
          description: 'The default is small, as shown above.'},
          {name: 'Text',
          propPreview: '<ActionButton text="Edit"/>',
          propCode: {text: 'Edit'},
          description: 'Changes the text'}
      ]
    },
    {
      name: 'ActionButtonGroup',
      id: 'actionbuttongroup',
      code: ActionButtonGroup,
      codePreview: '<ActionButtonGroup> <ActionButton/> <ActionButton/> <ActionButton/> </ActionButtonGroup>',
      req_props: null,
      req_children: [React.createElement(ActionButton), React.createElement(ActionButton), React.createElement(ActionButton)],
      use: 'This groups related action buttons together.'
    },
    {
      name: 'Button',
      id: 'button',
      code: Button,
      codePreview: '<Button/>',
      req_props: null,
      req_children: null,
      use: 'This style is more eye-catching. It is meant to be used when you want the user to do this thing! Click this button here!!',
      props: [
          {name: 'Size',
          propPreview: '<Button size="medium"/>',
          propCode: {size: 'medium'},
          description: 'The default is small, as shown above.'},
          {name: 'Text',
          propPreview: '<Button text="This button is amazing!"/>',
          propCode: {text: 'This button is amazing!'},
          description: 'Changes the text'}
      ]
    },
    {
      name: 'SearchBar',
      id: 'searchbar',
      code: SearchBar,
      codePreview: '<SearchBar/>',
      req_props: null,
      req_children: null,
      use: 'Used for finding things.'
    },
    {
    name: 'Textfield',
    id: 'textfield',
    code: Textfield,
    codePreview: '<Textfield/>',
    req_props: null,
    req_children: null,
    use: 'This is where you can enter text.',
    props: [
      {name: 'Size',
      propPreview: '<Textfield size="medium"/>',
      propCode: {size: 'medium'},
      description: 'The default is small, as shown above.'},
      {name: 'Text',
      propPreview: '<Textfield text="Enter cat names"/>',
      propCode: {text: 'Enter cat names'},
      description: 'Changes the text'},
      ]
    },
    {
      name: 'ToggleButton',
      id: 'togglebutton',
      use: 'This is button toggles back and forth',
      code: ToggleButton,
      codePreview: '<ToggleButton/>',
      req_props: null,
      req_children: null,
      props: [
        {name: 'Size',
        propPreview: '<ToggleButton size="medium"/>',
        propCode: {size: 'medium'},
        description: 'The default is small, as shown above.'},
        {name: 'Text',
        propPreview: '<ToggleButton text="Select me"/>',
        propCode: {text: 'Select me'},
        description: 'Changes the text'},
        // {name: 'isSelected',
        // propPreview: '<ToggleButton isSelected/>',
        // propCode: {'isSelected'},
        // description: 'If added, starts the button in selected state.'},
        {name: 'Switch Text',
        propPreview: '<ToggleButton switch_text="frog"/>',
        propCode: {switch_text: 'frog'},
        description: 'Sets different text value for when the button is selected'},
        {name: 'Label',
        propPreview: '<ToggleButton label="What: "/>',
        propCode: {label: 'What: '},
        description: 'Adds label to button'},
        {name: 'Icon',
        propPreview: '<ToggleButton icon={<FontAwesomeIcon icon={faCode}}/>',
        propCode: {icon: <FontAwesomeIcon icon={faCode}/>},
        description: 'See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button'}
      ]
    },
    {
      name: 'UnitMenu',
      id: 'unitmenu',
      code: UnitMenu,
      codePreview: '<UnitMenu units={["EM", "PT", "PX"]}/>',
      req_props: {units: ['EM', 'PT', 'PX']},
      req_children: null,
      use: 'Textfield with attached menu. Current application is displaying and changing units of values',
      props: [
        {name: 'Units',
        propPreview: '<UnitMenu units={["EM", "PT", "PX"]}/>',
        propCode: {units: ['EM', 'PT', 'PX']},
        description: 'Adds the units to the menu. Required for the component to work.'},
        {name: 'Defaults',
        propPreview: '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]}/>',
        propCode: {units: ['EM', 'PT', 'PX'], defaults: ['None', 'Auto']},
        description: 'Defaults are unitless values defined by us somewhere else. The word in the array will appear in the textfield and a - will appear on the main button.'},
        {name: 'Label',
        propPreview: '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]} label="Label: ">',
        propCode: {units: ['EM', 'PT', 'PX'], defaults: ['None', 'Auto'], label: 'Label: '},
        description: 'Adds label in front of the component. Dragging on the label will increment the value.'
        }
        ]
      },
    {
      name: 'VerticalDivider',
      id: 'verticaldivider',
      code: VerticalDivider,
      codePreview: '<VerticalDivider/>',
      req_props: null,
      req_children: null,
      use: 'Creates visual separation.'
    }
  ];
  // === END OF DATA STRUCTURE SECTION ===

//HOME PAGE
  function Home() {
    return (
    <div>
      <h1>Hi!</h1>
      <p>This is the Component Library. Use it wisely.</p>
      <p style={{display: "inline"}}>You will need </p>
      <p style={{color: "blue", display: "inline"}}>import ComponentName from "../imports/PanelHeaderComponents/ComponentName.js"</p>
      <p style={{display: "inline"}}> to add the component to a new file.</p>
    </div>
    );
  }

//COMPONENT PAGES
  function Components({ match }) {

    const component = dataStructure.find(({ id }) => id === match.params.componentId)
    var display = component.code

    //PROPS SECTION
    function Props(component) {
      if (component.props) {
        return (component.props.map(({ name,propPreview,propCode,description }) => (
          <div key={name}>
            <h3 key={name}>{name}</h3>
            <p key={name + 'code'} style={{color: "blue"}}>{propPreview}</p>
            <p key={description}>{description}</p>
            {React.createElement(display, propCode)}
          </div>)))
      }
      else {
        return (<p>Nothing to see here</p>)
      }


    }
    return (
      <div>
        <h1>{component.name}</h1>
        <p style={{color: "blue"}}>{component.codePreview}</p>
        {React.createElement(display, component.req_props, component.req_children)}

        <hr/>

        <h2>Why would I use this?</h2>
        <p>{component.use}</p>

        <hr/>

        <h2>Props</h2>
        {Props(component)}

      </div>
    )
  };

  //ROUTER SECTION
  return (
    <Router>
      <div>
        <GlobalFont/>

        <NavBar>
          <div style={{marginLeft: '10px'}}>
            <h1>Components</h1>
            {/* <SearchBar width='110px'/> */}
          </div>
          <List>
            {dataStructure.map(({ name, id}) => (
              <li key={id}><Link to={`/controls/${id}`} style={{color: "black"}}>{name}</Link></li>
            ))}
          </List>
        </NavBar>

        <Content>
          <Route exact path='/controls' component={Home}></Route>
          <Route path={`/controls/:componentId`} component={Components}></Route>
        </Content>

      </div>
    </Router>
   

  );
}
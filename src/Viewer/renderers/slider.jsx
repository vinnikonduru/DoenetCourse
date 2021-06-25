import React, { useRef, useState, useEffect ,useMemo } from 'react';

import styled from "styled-components";
import {Spring} from '@react-spring/web';
import useDoenetRender from './useDoenetRenderer';
import Button from "../../_reactComponents/PanelHeaderComponents/Button";
import { doenetComponentForegroundActive, doenetComponentForegroundInactive, doenetLightGray } from "../../_reactComponents/PanelHeaderComponents/theme"

const SliderContainer = styled.div`
    width: fit-content;
    height: ${props => (props.labeled && props.noTicked) ? "60px" : props.labeled ? "80px" : props.noTicked ? "40px" : "60px"};
`;

const SubContainer2 = styled.div`
    padding-top: 10px;
    height: 50px;
`;

const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #888888 ;
  height: 1px;
  width: ${props => props.width};
`;

const StyledValueLabel = styled.p`
    display: inline;
    user-select: none;
`;

const StyledThumb = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: relative;
  top: -3px;
  opacity: 1;
  background: ${props => props.disabled ? "#404040" : `${doenetComponentForegroundActive}`};
  cursor: pointer;
`;

const Tick = styled.div`
    position: absolute;
    border-left: 2px solid  ${doenetLightGray};
    height: 10px;
    top:1px;
    z-Index:-2;
    left: ${props => props.x};
`;

const Label = styled.p`
    position: absolute;
    left: ${props => props.x};
    color: ${doenetComponentForegroundInactive};
    font-size: 12px;
    top:1px;
    user-select: none;
`;

function generateNumericLabels (points, div_width, point_start_val) {

  return (
      [points.map(point => (
          <Tick key = {point} x = {`${(point - point_start_val) * div_width}px`}/>
          )
      ),
      points.map(point => (
              <Label key = {point} x = {`${((point - point_start_val) * div_width) - 3}px`}>{point}</Label>
          )
      )
      ]
  );
}

function generateTextLabels (points, div_width, countToHide) {

  return (
     [points.map((point, index) => {
            if(index <= (countToHide - 1)){
               return  <Tick key = {point} x = {`${index * div_width}px`}/>
            }
        }
        ),
        points.map((point, index) => {
          if(index <= (countToHide - 1)){
             return <Label key = {point} x = {`${(index * div_width) - 3}px`}>{point}</Label>

}
}

      )
      ]
  );
}


function xPositionToValue(ref, div_width, start_val){ 
  return (start_val + (ref/div_width));
}

function nearestValue(refval, points){
  let [min, val, index] = [Infinity, null, 0];
  let i = 0;
  for (let point of points) {

      let diff = Math.abs(point - refval);
      if (diff < min) {
      min = diff;
      val = point;
      index = i;
      }

      i = i + 1;
  }
  return [val, index];
}


const getContext = () => {
    const fragment = document.createDocumentFragment();
    const canvas = document.createElement('canvas');
    fragment.appendChild(canvas);
    return canvas.getContext('2d') ;
  };
  
  const getTextWidth = (currentText, font) => {
    const context = getContext();
    context.font = font;
  
    if (Array.isArray(currentText)) {
      return Math.max(...currentText.map((t) => context.measureText(t).width));
    } else {
      const metrics = context.measureText(currentText);
      return metrics.width;
    }
  };
  
  const useTextWidth = (options) => {
    const textOptions = useMemo(() => ('text' in options ? options : undefined), [options]);
    const refOptions = useMemo(() => ('ref' in options ? options : undefined), [options]);
  
    return useMemo(() => {
      if (refOptions?.ref.current?.textContent) {
        const context = getContext();
        const computedStyles = window.getComputedStyle(refOptions.ref.current);
        context.font = computedStyles.font;
        const metrics = context.measureText(refOptions.ref.current.textContent);
  
        return metrics.width;
      } else if (textOptions?.text) {
        return getTextWidth(textOptions.text, textOptions.font ?? '12px times');
      }
  
      return NaN;
    }, [textOptions?.text, textOptions?.font, refOptions?.ref]);
  };
  
  


export default function Slider(props) {
  let [name, SVs, actions] = useDoenetRender(props);
  //console.log("name: ", name, " value: ", SVs.value, " index: ", SVs.index);

  let width = (SVs.width.size);
        if(SVs.width.isAbsolute === true){
        width = SVs.width.size + 'px';
        }else if(SVs.width.isAbsolute === false){ 
        width= SVs.width.size + 'px'; 
        }
  const containerRef = useRef(null);

  let sorted_points = [...SVs.items].sort((p1, p2) => p1 - p2);

  const [thumbXPos, setThumbXPos] = useState(0);
  const [thumbValue, setThumbValue] = useState((SVs.sliderType === "text") ? SVs.items[0] : sorted_points[0]);
  const [isMouseDown, setIsMouseDown] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [startValue, setStartValue] = useState((SVs.sliderType === "text") ? 0 : sorted_points[0]);
  const [endValue, setEndValue] = useState((SVs.sliderType === "text") ? 0 : sorted_points[sorted_points.length - 1]);
//   const [divisionWidth, setDivisionWidth] = useState((SVs.sliderType === "text") ? SVs.width.size/(SVs.items.length - 1) : SVs.width.size/(endValue - startValue));
  let divisionWidth = (SVs.sliderType === "text") ? SVs.width.size/(SVs.items.length - 1) : SVs.width.size/(endValue - startValue);
  const [index, setIndex] = useState(0);
  const [totalWidth, setTotalWidth] = useState(SVs.width.size);

  const getTotalWidth = (points) => {
    let value = 0;

    points.map((point, index) => {
      const widthpoint = useTextWidth({ text: point, font: '12px Times' });

      value = value + widthpoint;
    });

    return value;
  };
  const [eachPointWidth, setEachPointWidth] = useState(getTotalWidth(SVs.items));

//   console.log(">>>>eachPointWidth",eachPointWidth);
let filteredItems = [];
let originalItems = SVs.items;
let countToHide = 0;
if(eachPointWidth < SVs.width.size){}
else{
    //  countToHide = (eachPointWidth/(SVs.items.length -1));
     countToHide = 3;
     divisionWidth = 33;
    //  setDivisionWidth(SVs.width.size/countToHide)
    //  console.log(">>>countToHide",countToHide);
    // filteredItems = originalItems.splice(-1,countToHide); 
}



  useEffect(() => {
      if(containerRef.current){
          const rect = containerRef.current.getBoundingClientRect();
          setOffsetLeft(rect.left);
      }
  }, []);

  useEffect(() => {
      //console.log("ran");
      if(!isMouseDown){
        setThumbValue(SVs.value);
        setIndex(SVs.index);
        if(!(SVs.sliderType === "text")){
            setThumbXPos((SVs.value - startValue)*divisionWidth);
        }else{
            setThumbXPos((SVs.index)*divisionWidth);
        }
      }
  }, [SVs.index]);

  if(SVs.hidden){
    return null;
  }

  if(SVs.disabled) {
    return (
        <SliderContainer labeled = {(SVs.showControls||SVs.label)} noTicked = {SVs.showTicks === false} ref = {containerRef}>
            <div style = {{height: (SVs.showControls||SVs.label) ? "20px": "0px"}}>
                {SVs.label? <StyledValueLabel>{SVs.label}</StyledValueLabel> : null}
                {SVs.showControls? <>
                <Button value="Prev" style = {{float: "right", userSelect: "none"}} callback = {(e)=>handlePrevious(e)} disabled />
                <Button value="Next" style = {{float: "right", userSelect: "none"}} callback = {(e)=>handleNext(e)} disabled />
                </> : null}
            </div>
            <SubContainer2>
                <StyledSlider width = {`${width}`} >
                <StyledThumb disabled style={{left: `${-3}px`}}/>
                {(SVs.showTicks === false) ? null : ((SVs.sliderType === "text") ? generateTextLabels(SVs.items, divisionWidth) : generateNumericLabels(SVs.items, divisionWidth, startValue))}
                </StyledSlider>
            </SubContainer2>
        </SliderContainer>
    );
}
function handleDragEnter(e) {
    setIsMouseDown(true);
    setThumbXPos(e.nativeEvent.clientX - offsetLeft);

    if(!(SVs.sliderType === "text")){
        let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
        let valindexpair = nearestValue(refval, SVs.items);
        
        setThumbValue(valindexpair[0]);
        setIndex(valindexpair[1]);

        actions.changeValue({ value: SVs.items[valindexpair[1]], transient: true});
    }else{
        let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
        setIndex(i);
        setThumbValue(SVs.items[i]);

        actions.changeValue({ value: SVs.items[i], transient: true});
    }
}



function handleDragExit(e) {
    if(!isMouseDown){
        return;
    }

    setIsMouseDown(false);

    if (!(SVs.sliderType === "text")){
        let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
        let valindexpair = nearestValue(refval, SVs.items);
        setThumbValue(valindexpair[0]);
        setThumbXPos((valindexpair[0] - startValue)*divisionWidth);
        setIndex(valindexpair[1]);

        actions.changeValue({ value: SVs.items[valindexpair[1]]});
        
    }else{
        let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
        setIndex(i);
        setThumbValue(SVs.items[i]);
        setThumbXPos(i*divisionWidth);

        actions.changeValue({ value: SVs.items[i]});

    }
}

function handleDragThrough(e) {
    if(isMouseDown){
        setThumbXPos(e.nativeEvent.clientX - offsetLeft);
        if(!(SVs.sliderType === "text")){
            let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
            let valindexpair = nearestValue(refval, SVs.items);
            setThumbValue(valindexpair[0]);
            setIndex(valindexpair[1]);

            actions.changeValue({ value: SVs.items[valindexpair[1]], transient: true});
        }else{
            let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
            setIndex(i);
            setThumbValue(SVs.items[i]);

            actions.changeValue({ value: SVs.items[i], transient: true});
        }
    }
}

function handleNext(e) {
    if(index === SVs.items.length - 1){
        return;
    }

    if(!(SVs.sliderType === "text")){
        setThumbXPos((SVs.items[index+1] - startValue) * divisionWidth);
    }else{
        setThumbXPos((index+1)*divisionWidth);
    }

    
    actions.changeValue({ value: SVs.items[index+1]});
    setThumbValue(SVs.items[index+1]);
    setIndex(index + 1);

}

function handlePrevious(e) {
    if(index === 0){
        return;
    }

    if(!(SVs.sliderType === "text")){
        setThumbXPos((SVs.items[index-1] - startValue) * divisionWidth);
    }else{
        setThumbXPos((index-1)*divisionWidth);
    }

    actions.changeValue({ value: SVs.items[index-1]});

    setThumbValue(SVs.items[index-1]);
    setIndex(index - 1);
}
  
  return (
    <SliderContainer  ref = {containerRef} labeled = {(SVs.showControls||SVs.label)} noTicked = {SVs.showTicks === false} >
        <div style = {{height: (SVs.showControls||SVs.label) ? "20px": "0px"}}>
            {SVs.label? <StyledValueLabel>{SVs.label}</StyledValueLabel> : null}
            {/* TODO */}
            {SVs.showControls? <>
            <Button value="Prev"  callback = {(e)=>handlePrevious(e)} data-cy="prevbutton" /> 
            <Button value="Next"  callback = {(e)=>handleNext(e)} data-cy="nextbutton" />

            </> : null}
        </div>
        <SubContainer2 onMouseDown = {handleDragEnter} onMouseUp = {handleDragExit} onMouseMove = {handleDragThrough} onMouseLeave = {handleDragExit} >
            <StyledSlider width = {(`${width}`)} data-cy="slider1">
            <Spring
                to={{ x: thumbXPos }}>              
                {(styles) => { return <StyledThumb style={{left: `${thumbXPos - 3}px`}}
                data-cy="slider1-handle"/>
            }}
            </Spring>
            {(SVs.showTicks === false) ? null : ((SVs.sliderType === "text") ? generateTextLabels(SVs.items, divisionWidth, countToHide) : generateNumericLabels(SVs.items, divisionWidth, startValue))}
            </StyledSlider>
        </SubContainer2>
    </SliderContainer>
  );
  
}

// let [name, SVs, actions] = useDoenetRender(props);
//   // let [handlePos,setHandlePos] = useState(100);


//   if (SVs.hidden) {
//     return null;
//   }


//   return (
//     <StyledSlider width = {`${500}px`} >
//       <Spring
//           to={{ x: 0 }}>
//           {props => <StyledThumb style={{left: `${props.x - 3}px`}}/>}
//       </Spring>
//       {/* {(props.showTicks === false) ? null : (props.isText ? generateTextLabels(props.points, divisionWidth) : generateNumericLabels(props.points, divisionWidth, startValue))} */}
//     </StyledSlider>
//   )

{/* <>
      <div> {name}'s Slider Value {SVs.items[SVs.index]} </div>
      <button onClick={() => actions.changeValue({ value: SVs.items[SVs.index - 1] })}>Prev</button>
      <button onClick={() => actions.changeValue({ value: SVs.items[SVs.index + 1] })}>Next</button>
    </> */}
{/* 
<slider>
<number>1</number>
<number>2</number>
<number>3</number>
</slider>


<slider>
<text>cat</text>
<text>dog</text>
<text>mouse</text>
</slider>

<slider>
<sequence>
<from>-10</from>
<to>10</to>
<step>2</step>
</sequence>
</slider> 
*/}




// export default class Slider extends DoenetRenderer {
//   constructor(props) {
//     super(props);

//     this.handleInput = this.handleInput.bind(this);

//     this.state = {
//     }


//     console.log("this.doenetSvData");
//     console.log(this.doenetSvData);
//     // console.log(this.doenetSvData.items)
//     // console.log(this.doenetSvData.index)
//     // console.log(this.doenetSvData.sliderType);
//     // console.log(this.actions);
//     // console.log(props.rendererUpdateMethods[this.componentName])



//   }


//   handleInput(e, inputState) {


//   }



//   render() {

//     console.log('RENDER')

//     if (this.doenetSvData.hidden) {
//       return null;
//     }

//     console.log("Current Value")
//     console.log(this.doenetSvData.items[this.doenetSvData.index]);



//     return (
//       <>
//         <div> {this.componentName}'s Slider Value {this.doenetSvData.items[this.doenetSvData.index]} </div>
//         <button onClick={() => this.actions.changeValue({ value: this.doenetSvData.items[this.doenetSvData.index - 1] })}>Prev</button>
//         <button onClick={() => this.actions.changeValue({ value: this.doenetSvData.items[this.doenetSvData.index + 1] })}>Next</button>
//       </>
//     );



//   }
// }


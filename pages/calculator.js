import React, { useState, useRef,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft, faUpload } from '@fortawesome/free-solid-svg-icons'
import ResultsTable from '../components/ResultsTable';
import ToggleSwitch from '../components/ToggleSwitch';
function Calculator() {
  //const [image, setImage] = useState(null);
  const [image, setImageData] = useState(null);
  const [dots, setDots] = useState([]);
  const [lineSegments, setLineSegments] = useState([]);
  const [referencePoints, setReferencePoints] = useState([]);
  const [fillColor, setFillColor] = useState('rgba(243,211,29, .3)');
  const canvasRef = useRef(null);
  const [toDragIndex, setToDragIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toRefDragIndex, setRefDragIndex] = useState(null);
  const [isRefDragging, setIsRefDragging] = useState(false);
  const [areaEnclosed, setAreaEnclosed] = useState(false);
  const [showReference, setShowReference] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0);
  const [dragMode, setDragMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [dotMode, setDotMode] = useState(true);
  const [referenceMode, setReferenceMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(null);
  const [windowHeight, setWindowHeight] = useState(null);
  const [referenceLength, setReferenceLength] = useState(0);
  const [pictureScale, setPictureScale] = useState(.9);

  const [areaDisplay, setAreaDisplay] = useState(null);
  const [perimeterDisplay, setPerimeterDisplay] = useState(null);
  const [volumeDisplay, setVolumeDisplay] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const DOT_WIDTH = 5;
  const DOT_HEIGHT = 5;
  const DOT_OFFSET = DOT_WIDTH /2;
  const DOT_COLOR = "#F3D31D";
  const LINE_COLOR = "#F3D31D";
  const REFERENCE_LINE_COLOR = "#585BFF";

//   var win = window;
//   var windowWidth = win.innerWidth || docElem.clientWidth || body.clientWidth;
  
  

  useEffect(() => {
    console.log(canvasRef.current.parentNode.clientHeight)
    if(!windowHeight){
      setWindowWidth(canvasRef.current.parentNode.clientWidth)
      setWindowHeight(canvasRef.current.parentNode.clientHeight)
    }
    

    console.log("updating use effect");
    refreshCanvas();
  }, [dots, fillColor,image, position, size, rotation, showReference, isRefDragging,pictureScale]);

  const refreshCanvas = function(){
    console.log("Refreshing");
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.restore();
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
      drawImageScaled(image, context);
    }
    if(dots.length == 1){
      context.fillStyle = dots[0].color;
      
      context.fillRect(dots[0].x, dots[0].y, dots[0].width, dots[0].height, dots[0].color);
    }
    else if (dots.length > 1) {
      let prevDot = null;
      
      for(let dot of dots){
        
        
        context.fillStyle = dot.color;
        context.fillRect(dot.x,dot.y, dot.width, dot.height, dot.color);
        if(prevDot){
          
          context.beginPath();
          context.moveTo(prevDot.x + DOT_OFFSET, prevDot.y + DOT_OFFSET);
          context.lineTo(dot.x + DOT_OFFSET, dot.y + DOT_OFFSET);
          context.strokeStyle = LINE_COLOR;
          context.shadowColor = "grey";
          context.shadowBlur = 4;
          context.stroke();
          context.restore();
        }
        
        
        prevDot = dot;
      }
      if(areaEnclosed){
        handleFillClick();
      }
    }
    if(showReference){
      context.fillStyle = REFERENCE_LINE_COLOR;
      context.fillRect(referencePoints[0][0] - 2,referencePoints[0][1] -2, 4, 4, REFERENCE_LINE_COLOR);
      context.fillStyle = REFERENCE_LINE_COLOR;
      context.fillRect(referencePoints[1][0] - 2,referencePoints[1][1] - 2, 4, 4,REFERENCE_LINE_COLOR);
      context.beginPath();
      context.moveTo(referencePoints[0][0], referencePoints[0][1]);
      context.lineTo(referencePoints[1][0], referencePoints[1][1]);
      context.strokeStyle = REFERENCE_LINE_COLOR;
      context.stroke();
      context.closePath()
    }
  }


  const handleUpload = (e) => {
    setAreaEnclosed(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      drawImageScaled(img, context);

    };
    img.src = URL.createObjectURL(e.target.files[0]);
    
    setImageData(img)
    resetStates();

    


  };
  const resetStates = function (){
    setDots([]);
    setReferenceLength(0);
    setShowReference(false);
    setAreaDisplay(null);
    setPerimeterDisplay(null);
    setVolumeDisplay(null);
    setShowResults(false);
  }

  function drawImageScaled(img, ctx) {
    let adjustedWidth =  img.width *pictureScale ;
    let adjustedHeight =  img.height * pictureScale;
    var canvas = ctx.canvas ;
    var hRatio = canvas.width  / img.width   ;
    var vRatio =  canvas.height / img.height  ;
    var ratio  = Math.min ( hRatio, vRatio );
    var centerShift_x = ( canvas.width - adjustedWidth*ratio ) / 2;
    var centerShift_y = ( canvas.height - adjustedHeight*ratio ) / 2;  
    ctx.clearRect(0,0,canvas.width, canvas.height);
    //cxt.drawImage(image, -width / 2, -height / 2, width, height);
    
    ctx.drawImage(img, 0,0, img.width, img.height, centerShift_x,centerShift_y, adjustedWidth*ratio ,adjustedHeight*ratio);  
 }


  const handleCanvasClick = (e) => {
    console.log("dots", dots);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;

    let x =  clickX - DOT_OFFSET;
    let y =clickY - DOT_OFFSET;

    if(dotMode){
      
      if( dots.length > 1 && mouse_in_dot(clickX, clickY, dots[0])){
        console.log("No dot added but line should be drawn");
        lineSegments.push({x1:dots[dots.length - 1].x, y1: dots[dots.length - 1].y, x2: dots[0].x, y2:dots[0].y});
        handleFillClick();
        setAreaEnclosed(true);
      }
      else{
        console.log("Normal Dot added");
        dots.push({x: x, y:y, height: DOT_HEIGHT, width:DOT_WIDTH, color: DOT_COLOR})
  
        
        if (dots.length > 0) {
          const prevDot = dots[dots.length - 1];
   
          lineSegments.push({x1:prevDot.x, y1: prevDot.y, x2: x, y2:y});
          refreshCanvas();
        }
      }
    }
    if(deleteMode){
      let currLine = null;
      for(let i = 0; i < dots.length - 1; i ++){
        currLine = {start: dots[i], end: dots[i + 1]};
        if(isClickOnLine(x,y,currLine)){
          console.log("LINE CLICKED", currLine.start, currLine.end);
          //dots.splice(i, 1);
        }
      }

    }

  };

  const handleFillClick = (color) => {
    console.log("Handle Filling", fillColor, color);

    if(color == undefined){
        color = fillColor
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //const [firstX, firstY] = dots[0];
    let firstX = dots[0].x + DOT_OFFSET;
    let firstY = dots[0].y + DOT_OFFSET;
    ctx.beginPath();
    ctx.moveTo(firstX, firstY);
    let prevDot = null
    for (let i = 1; i < dots.length; i++) {
      //const [x, y] = dots[i];
      prevDot = dots[i]
      ctx.lineTo(prevDot.x + DOT_OFFSET, prevDot.y + DOT_OFFSET);
    }
    ctx.lineTo(firstX, firstY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.fill();
    ctx.shadowColor = "grey";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(dots[0].x+ DOT_OFFSET, dots[0].y+ DOT_OFFSET);
    ctx.lineTo(prevDot.x+ DOT_OFFSET, prevDot.y+ DOT_OFFSET);
    ctx.strokeStyle = LINE_COLOR;
    ctx.stroke();
  };

  const handleDotDrag = (event, index) => {

    if(isDragging){
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let copy = dots
     
      let dx = x - copy[toDragIndex].x;
      let dy = y - copy[toDragIndex].y;
      
      copy[toDragIndex].x += dx;
      copy[toDragIndex].y += dy;
      setDots(copy);
      refreshCanvas();
      console.log("canvas refreshed");
      //const newDots = [...dots];
      //newDots[index] = { x, y };
      //setDots(newDots);
    }
    

  };

  const handleRefDrag = (event, index) => {

    if(isRefDragging){
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let copy = referencePoints;
     
      let dx = x - copy[toRefDragIndex][0];
      let dy = y - copy[toRefDragIndex][1];
      
      copy[toRefDragIndex][0] += dx;
      copy[toRefDragIndex][1] += dy;
      setReferencePoints(copy);
      refreshCanvas();
      console.log("Dragged REference");
    }
    

  };
  const handleDotRelease = () => {
    console.log("releasing");
    setToDragIndex(null);
    setIsDragging(false);
    setRefDragIndex(null);
    setIsRefDragging(false);
  };
  const handleFillColorChange = (e) => {
    setReferenceLength(e.target.value);
  };


  const handleDotHover = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hover = false;
    for (let dot of dots){
      if(mouse_in_dot(x,y, dot)){
        hover = true;
      }
      }
      if(hover){
        document.getElementById("myCanvas").style.cursor = "move";
      }
      else{
        document.getElementById("myCanvas").style.cursor = "default";
      }
  };
  const handleRefHover = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hover = false;
    
    if(mouse_in_reference_dot(x,y, referencePoints[0]) || mouse_in_reference_dot(x,y, referencePoints[1])){
      hover = true;
    }
    
    if(hover){
      document.getElementById("myCanvas").style.cursor = "move";
    }
    else{
      document.getElementById("myCanvas").style.cursor = "default";
    }
  };
  function calculateLineLength(x1, y1, x2, y2) {
    console.log("Getting Line Lenght");
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx*dx + dy*dy);
  }

  const handleCalculateClick = () => {
      // console.log("Calculating");
      // setFillColor('rgb(255,255,0)');
      // refreshCanvas();
      // handleFillClick('rgba(255,255,0,1)');
      // refreshCanvas();
      // console.log("Canvas Refreshed..");
      let currRef = referenceLength;
      let numPixelsInLine= calculateLineLength(referencePoints[0][0], referencePoints[0][1], referencePoints[1][0], referencePoints[1][1])
      let pixelLength = currRef / numPixelsInLine;

      let length = getPixelsInPolygon().length;
   

      setAreaDisplay(length* pixelLength * pixelLength);
      setPerimeterDisplay(156);
      setVolumeDisplay(0.000);
      setShowResults(true);
      

  };

  function getPixelsInPolygon() {
    const canvas = canvasRef.current;
    const polygonPoints = dots;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const pixelsInPolygon = [];
  
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        if (isPointInPolygon(x, y, polygonPoints)) {
          const pixelIndex = (y * canvas.width + x) * 4;
          pixelsInPolygon.push({
            x: x,
            y: y,
            r: pixels[pixelIndex],
            g: pixels[pixelIndex + 1],
            b: pixels[pixelIndex + 2],
            a: pixels[pixelIndex + 3]
          });
        }
      }
    }
  
    return pixelsInPolygon;
  }
  
  function isPointInPolygon(x, y, polygonPoints) {
    let isInside = false;
    for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
      const xi = polygonPoints[i].x, yi = polygonPoints[i].y;
      const xj = polygonPoints[j].x, yj = polygonPoints[j].y;
      const intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    }
    return isInside;
  }

  const findPixelsWithColor = function () {
    console.log("Starting to get pixel count");
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
  
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixelsWithColor = [];

    let colorRed = 255; 
    let colorGreen = 255;
    let colorBlue = 0;
    for (var i = 0; i < imageData.data.length; i += 4) {
      var red = imageData.data[i];
      var green = imageData.data[i + 1];
      var blue = imageData.data[i + 2];
      //console.log(red,green,blue);
      
      
      
      if (red === colorRed && green === colorGreen && blue === colorBlue) {
        var x = (i / 4) % canvas.width;
        var y = Math.floor((i / 4) / canvas.width);
        pixelsWithColor.push([x, y]);
      }
    }
    console.log("Total Pixels",pixelsWithColor.length);
    return pixelsWithColor;
  }

  const mouse_in_dot = function(x,y, dot){
    let shape_left = dot.x - DOT_WIDTH;
    let shape_right = dot.x + dot.width + DOT_WIDTH;
    let shape_top = dot.y - DOT_HEIGHT;
    let shape_bottom = dot.y + dot.height + DOT_HEIGHT;
    if(x > shape_left && x < shape_right && y > shape_top && y < shape_bottom ){
        return true;
    }
    return false;
  }
  
  const mouse_in_reference_dot = function(x,y, point){
    let shape_left = point[0]- DOT_WIDTH;
    let shape_right = point[0] + DOT_WIDTH + DOT_WIDTH;
    let shape_top = point[1] - DOT_HEIGHT;
    let shape_bottom = point[1] + DOT_HEIGHT + DOT_HEIGHT;
    if(x > shape_left && x < shape_right && y > shape_top && y < shape_bottom ){
        console.log("IN REFERENCE");
        return true;
    }
    return false;
  }

  const isClickOnLine= function(x, y, line) {
    var threshold = 5;
    var startX = line.start.x;
    var startY = line.start.y;
    var endX = line.end.x;
    var endY = line.end.y;

    if (startX > endX) {
      var temp = startX;
      startX = endX;
      endX = temp;

      temp = startY;
      startY = endY;
      endY = temp;
    }

    var distance = Math.abs((endY - startY) * x - (endX - startX) * y + endX * startY - endY * startX) / Math.sqrt(Math.pow(endY - startY, 2) + Math.pow(endX - startX, 2));

    if (distance <= threshold) {
      return true;
    } else {
      return false;
    }
  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if(dragMode){
      let index = 0;
    
      for (let dot of dots){
        if(mouse_in_dot(x,y, dot)){
          console.log("yes");
          setIsDragging(true);
          setToDragIndex(index);
          
        }else{
          console.log("no");
        }
          
          index++;
        }
  
    }
    if(showReference && referencePoints.length>0){
      if(showReference && mouse_in_reference_dot(x,y, referencePoints[0])){
        console.log("REFERENCE POINT");
        setIsRefDragging(true);
        setRefDragIndex(0);
      }
      else if(mouse_in_reference_dot(x,y, referencePoints[1])){
        console.log("REFERENCE POINT");
        setIsRefDragging(true);
        setRefDragIndex(1);
      }
    }
    

  };

  const increaseScale = (e) => {
   
    setPictureScale(pictureScale+ .1)

  };
  const decreaseScale = (e) => {
    setPictureScale(pictureScale- .1)

  };

  const handleDragModeClick = (e) => {
    setDragMode(true);
    setDeleteMode(false);
    setDotMode(false);
    setReferenceMode(false);
  }
  const handleDotModeClick = (e) => {
    setDragMode(false);
    setDeleteMode(false);
    setDotMode(true);
    setReferenceMode(false);
  }
  const handleDeleteModeClick = (e) => {
    setDragMode(false);
    setDeleteMode(false);
    setAreaEnclosed(false);
    setDots([]);
    setReferencePoints([]);
    setShowReference(false);
    setReferenceLength(0);
    refreshCanvas();

  }
  const handleUndoButtonClick = (e) => {
    setAreaEnclosed(false);
    dots.pop();
    refreshCanvas();
  }
  const handleReferenceClick = (e) => {
    console.log("adding refference");
    setShowReference(true);
    setReferenceMode(true);
    setDragMode(false);
    setDeleteMode(false);
    setDotMode(false);
    referencePoints.push([100,110])
    referencePoints.push([300,110])


    refreshCanvas();
  }
  return (
    <div className='calculator-wrapper'>

        <div className='menu-bar'>
            <div className='icon-wrapper'>
            
                <button className={dotMode ? 'menu-icon-active' : 'menu-icon'} onClick={handleDotModeClick}><img id='dots' src="/dots.svg" alt="My SVG file" /></button>
                <button className={dragMode ? 'menu-icon-active' : 'menu-icon'} onClick={handleDragModeClick}><img id='hand' src="/hand.svg" alt="My SVG file" /></button>
                <button className={referenceMode ? 'menu-icon-active' : 'menu-icon'} onClick={handleReferenceClick}><img id='reference' src="/reference.svg" alt="My SVG file" /></button>
                <button className='menu-icon' onClick={handleDeleteModeClick}><img id='clear' src="/clear.svg" alt="My SVG file" /></button>
                <button className='menu-icon' onClick={handleUndoButtonClick}><FontAwesomeIcon  id='undo' icon={faRotateLeft} color='white' /></button>
                
            </div>

            <div className='page-title'>
                <h4> tubeVOL</h4>
            </div>

            <div className='right-menu-col'>
                <div className='zoom-wrapper'>
                    <button className='zoom-icon' onClick={increaseScale}>+</button>
                    <button className= 'zoom-icon' onClick={decreaseScale}>-</button>
                </div>

                <div className="file-upload-container">
                  <input type="file" onChange={handleUpload} className="file-upload-input" />
                  <button className="file-upload-button">
                    <FontAwesomeIcon icon={faUpload} color='white' />
                    <span>Choose a file</span>
                  </button>
                </div>

            </div>

        </div>


        <div className='main-page'>
            <div className='left-column'>
              <div className='col-item'>
                <div className='col-item-title'>
                  <img src="/reference-gray.svg" alt="My SVG file" />
                  <p>Reference Line</p>
                </div>
                <div className='col-item-body'>
                  <input type="text" value={referenceLength} onChange={handleFillColorChange} />
                  <p>m</p>
                </div>
              </div>

              <div className='col-item'>
                <div className='col-item-title'>
                  <img src="/units.svg" alt="My SVG file" />
                  <p>Units</p>
                </div>
                <div className='col-item-body'>
                  
                  
                  
   
                </div>
              </div>
       

              <div className='col-item'>
                <div className='col-item-title'>
                  <img src="/location.svg" alt="My SVG file" />
                  <p>Center of Tube Location</p>
                </div>
                <div className='col-item-body'>
                    <ToggleSwitch />
                </div>
              </div>     

               <div className='col-item'>
                <div className='col-item-title'>
                  <img src="/distance-gray.svg" alt="My SVG file" />
                  <p>Distance to Center of Tube</p>
                </div>
                <div className='col-item-body'>
                  <input type="text" value={referenceLength} onChange={handleFillColorChange} />
                  <p>m</p>
                </div>
              </div>      
                {/* {showReference && (
                <div>
                
                <button onClick={() => {
                console.log("Ref length", referenceLength);
                }}  
                >Show Ref Length</button>
                
                </div>
                )} */}

                {/* {dots.length > 2 && (
                    <div>
                    <input type="color" value={fillColor} onChange={handleFillColorChange} />
                    <button onClick={handleFillClick}>Fill Area</button>
                    
                    </div>
                )} */}

                <button className='calculate-button' onClick={() => {
                if(referenceLength > 0){
                    handleCalculateClick();
                }
                }}>Calculate Area</button>

                <div className='answers'>
                  {showResults && (
                  <ResultsTable area={areaDisplay} perimeter={perimeterDisplay} volume={volumeDisplay} />
                  )}
                </div>
                <div style={{marginTop:"200px"}}>
                    <button onClick={refreshCanvas}>FORCE REFRESH</button>
                </div>
                
            </div>
            

            <div className='right-column'>
                <canvas
                    onMouseDown={(event) => {
                    handleMouseDown(event)
                    }}
                    onMouseUp={handleDotRelease}
                    onMouseMove={(event) => {
                        if(dragMode){
                        handleDotHover(event);
                        if (isDragging && toDragIndex !== null) {
                            handleDotDrag(event, toDragIndex);
                        }
                        }
                        if(referenceMode) {
                        handleRefHover(event);
                        if(isRefDragging){
                            handleRefDrag(event, toRefDragIndex);
                        }
                        
                        }
                    }}
                    id='myCanvas'
                    ref={canvasRef}
                    width={windowWidth}
                    height={windowHeight}
                    // onClick={handleCanvasClick}
                    onClick={(event) => {
                        if (!isDragging) {
                        handleCanvasClick(event)
                        }
                    }}
                    className='main-canvas'
                />
            </div>
        </div>

    </div>
  );
}

export default Calculator;
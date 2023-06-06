import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faUpload,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import ResultsTable from "../components/ResultsTable";
import ToggleSwitch from "../components/ToggleSwitch";
import ButtonWithIcon from "../components/ButtonWithIcon";
import HintIcon from "../components/HintIcon";
import SimpleButton from "@/components/SimpleButton";

const LEFT = 0;
const RIGHT = 1;
function Calculator() {
  //const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [image, setImageData] = useState(null);

  const [dots, setDots] = useState([]);
  const [lineSegments, setLineSegments] = useState([]);
  const [referencePoints, setReferencePoints] = useState([]);
  const [veritcalReferencePoint, setVeritcalReferencePoint] = useState([]);
  const [centerOrientation, setCenterOrientation] = useState(LEFT);

  const [fillColor, setFillColor] = useState("rgba(243,211,29, .3)");
  const canvasRef = useRef(null);
  const [toDragIndex, setToDragIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toRefDragIndex, setRefDragIndex] = useState(null);
  const [isRefDragging, setIsRefDragging] = useState(false);
  const [isVertRefDragging, setIsVertRefDragging] = useState(false);
  const [vertDragIndex, setVertDragIndex] = useState(null);
  //UI Conditionals
  const [areaEnclosed, setAreaEnclosed] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showVeritcalReference, setShowVeritcalReference] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0);
  //Modes
  const [dragMode, setDragMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [dotMode, setDotMode] = useState(true);
  const [referenceMode, setReferenceMode] = useState(false);
  const [verticalReferenceMode, setVerticalReferenceMode] = useState(false);

  //Canvas Dimensions
  const [windowWidth, setWindowWidth] = useState(null);
  const [windowHeight, setWindowHeight] = useState(null);
  const [referenceLength, setReferenceLength] = useState(0);
  const [distanceFromRefToCenter, setDistanceFromRefToCenter] = useState(0);
  const [pictureScale, setPictureScale] = useState(0.9);

  //Display Variables
  const [areaDisplay, setAreaDisplay] = useState(null);
  const [perimeterDisplay, setPerimeterDisplay] = useState(null);
  const [volumeDisplay, setVolumeDisplay] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("mm");
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const DOT_WIDTH = 5;
  const DOT_HEIGHT = 5;
  const DOT_OFFSET = DOT_WIDTH / 2;
  const DOT_COLOR = "#F3D31D";
  const LINE_COLOR = "#F3D31D";
  const REFERENCE_LINE_COLOR = "#585BFF";
  const INNER_WALL_LINE_COLOR = "#F16F61";

  //   var win = window;
  //   var windowWidth = win.innerWidth || docElem.clientWidth || body.clientWidth;

  const pathToCursor = "../public/dot-cursor.svg";

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    if (!windowHeight) {
      setWindowWidth(canvasRef.current.parentNode.clientWidth);
      setWindowHeight(canvasRef.current.parentNode.clientHeight);
    }

    console.log("updating use effect");
    refreshCanvas();
  }, [
    dots,
    fillColor,
    image,
    position,
    showReference,
    showVeritcalReference,
    isRefDragging,
    isVertRefDragging,
    pictureScale,
    showResults,
    showWarnings,
    errorMessage,
    showModal,
  ]);

  const refreshCanvas = function () {
    console.log("Refreshing");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.restore();
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
      drawImageScaled(image, context);
    }
    if (dots.length == 1) {
      context.fillStyle = dots[0].color;

      context.fillRect(
        dots[0].x,
        dots[0].y,
        dots[0].width,
        dots[0].height,
        dots[0].color
      );
    } else if (dots.length > 1) {
      let prevDot = null;

      for (let dot of dots) {
        context.fillStyle = dot.color;
        context.fillRect(dot.x, dot.y, dot.width, dot.height, dot.color);
        if (prevDot) {
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
      if (areaEnclosed) {
        handleFillClick();
      }
    }
    if (showReference && referencePoints.length > 0) {
      context.fillStyle = REFERENCE_LINE_COLOR;
      context.fillRect(
        referencePoints[0][0] - 2,
        referencePoints[0][1] - 2,
        4,
        4,
        REFERENCE_LINE_COLOR
      );
      context.fillStyle = REFERENCE_LINE_COLOR;
      context.fillRect(
        referencePoints[1][0] - 2,
        referencePoints[1][1] - 2,
        4,
        4,
        REFERENCE_LINE_COLOR
      );
      context.beginPath();
      context.moveTo(referencePoints[0][0], referencePoints[0][1]);
      context.lineTo(referencePoints[1][0], referencePoints[1][1]);
      context.strokeStyle = REFERENCE_LINE_COLOR;
      context.lineWidth = 3;
      context.stroke();
      context.lineWidth = 1;
      context.closePath();
    }
    if (showVeritcalReference && veritcalReferencePoint.length > 0) {
      console.log("Innerwall Drawing");
      context.fillStyle = INNER_WALL_LINE_COLOR;
      context.fillRect(
        veritcalReferencePoint[0][0] - 2,
        veritcalReferencePoint[0][1] - 2,
        4,
        4,
        INNER_WALL_LINE_COLOR
      );
      context.fillStyle = INNER_WALL_LINE_COLOR;
      context.fillRect(
        veritcalReferencePoint[1][0] - 2,
        veritcalReferencePoint[1][1] - 2,
        4,
        4,
        INNER_WALL_LINE_COLOR
      );
      context.beginPath();
      context.moveTo(
        veritcalReferencePoint[0][0],
        veritcalReferencePoint[0][1]
      );
      context.lineTo(
        veritcalReferencePoint[1][0],
        veritcalReferencePoint[1][1]
      );
      context.strokeStyle = INNER_WALL_LINE_COLOR;
      context.lineWidth = 3;
      context.stroke();
      context.lineWidth = 1;
      context.closePath();
    }
    overlayText(context, canvas);
    context.restore();
  };

  const overlayText = function (ctx, canvas) {
    // Define the text properties
    const text = "Center of Tube";
    const fontSize = 24;
    const fontFamily = "Arial";
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.fillStyle = "lightgray";
    // Set the font properties
    ctx.font = `${fontSize}px ${fontFamily}`;

    // Set the text alignment to start (left)
    ctx.textAlign = "start";

    // Set the baseline to middle
    ctx.textBaseline = "middle";

    // Calculate the starting position for the text
    const x = 50;
    const y = canvas.height / 2;

    // // Rotate the canvas by 90 degrees
    // ctx.rotate(-Math.PI / 2);

    // Render the text
    ctx.fillText(text, x, y);

    // // Reset the canvas rotation
    // ctx.rotate(Math.PI / 2);
  };

  const handleUpload = (e) => {
    setAreaEnclosed(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      drawImageScaled(img, context);
    };
    img.src = URL.createObjectURL(e.target.files[0]);

    setImageData(img);
    resetStates();
  };
  const resetStates = function () {
    setDots([]);
    setReferenceLength(0);
    setShowReference(false);
    setAreaDisplay(null);
    setPerimeterDisplay(null);
    setVolumeDisplay(null);
    setShowResults(false);
  };

  function drawImageScaled(img, ctx) {
    let adjustedWidth = img.width * pictureScale;
    let adjustedHeight = img.height * pictureScale;
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - adjustedWidth * ratio) / 2;
    var centerShift_y = (canvas.height - adjustedHeight * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //cxt.drawImage(image, -width / 2, -height / 2, width, height);

    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      adjustedWidth * ratio,
      adjustedHeight * ratio
    );
  }

  const handleCanvasClick = (e) => {
    console.log("dots", dots);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;

    let x = clickX - DOT_OFFSET;
    let y = clickY - DOT_OFFSET;

    if (dotMode) {
      if (dots.length > 1 && mouse_in_dot(clickX, clickY, dots[0])) {
        console.log("No dot added but line should be drawn");
        lineSegments.push({
          x1: dots[dots.length - 1].x,
          y1: dots[dots.length - 1].y,
          x2: dots[0].x,
          y2: dots[0].y,
        });
        handleFillClick();
        setAreaEnclosed(true);
      } else {
        console.log("Normal Dot added");
        dots.push({
          x: x,
          y: y,
          height: DOT_HEIGHT,
          width: DOT_WIDTH,
          color: DOT_COLOR,
        });

        if (dots.length > 0) {
          const prevDot = dots[dots.length - 1];

          lineSegments.push({ x1: prevDot.x, y1: prevDot.y, x2: x, y2: y });
          refreshCanvas();
        }
      }
    }
    if (deleteMode) {
      let currLine = null;
      for (let i = 0; i < dots.length - 1; i++) {
        currLine = { start: dots[i], end: dots[i + 1] };
        if (isClickOnLine(x, y, currLine)) {
          console.log("LINE CLICKED", currLine.start, currLine.end);
          //dots.splice(i, 1);
        }
      }
    }
  };

  const handleFillClick = (color) => {
    console.log("Handle Filling", fillColor, color);

    if (color == undefined) {
      color = fillColor;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    //const [firstX, firstY] = dots[0];
    let firstX = dots[0].x + DOT_OFFSET;
    let firstY = dots[0].y + DOT_OFFSET;
    ctx.beginPath();
    ctx.moveTo(firstX, firstY);
    let prevDot = null;
    for (let i = 1; i < dots.length; i++) {
      //const [x, y] = dots[i];
      prevDot = dots[i];
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
    ctx.moveTo(dots[0].x + DOT_OFFSET, dots[0].y + DOT_OFFSET);
    ctx.lineTo(prevDot.x + DOT_OFFSET, prevDot.y + DOT_OFFSET);
    ctx.strokeStyle = LINE_COLOR;
    ctx.stroke();
  };

  const handleDotDrag = (event, index) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let copy = dots;

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
    if (isRefDragging) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
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

  const handleVertRefDrag = (event, index) => {
    if (isVertRefDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let copy = veritcalReferencePoint;

      let dx = x - copy[vertDragIndex][0];
      let dy = y - copy[vertDragIndex][1];

      copy[vertDragIndex][0] += dx;
      copy[vertDragIndex][1] += dy;
      setVeritcalReferencePoint(copy);
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
    setVertDragIndex(null);
    setIsVertRefDragging(false);
  };
  const handleSetReferenceChange = (e) => {
    setReferenceLength(e.target.value);
  };
  const handleSetDistanceToCenterChange = (e) => {
    setDistanceFromRefToCenter(e.target.value);
  };

  const handleDotHover = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hover = false;
    for (let dot of dots) {
      if (mouse_in_dot(x, y, dot)) {
        hover = true;
      }
    }
    if (hover) {
      document.getElementById("myCanvas").style.cursor = "move";
    } else {
      document.getElementById("myCanvas").style.cursor = "default";
    }
  };
  const handleRefHover = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hover = false;

    if (
      mouse_in_reference_dot(x, y, referencePoints[0]) ||
      mouse_in_reference_dot(x, y, referencePoints[1])
    ) {
      hover = true;
    }

    if (hover) {
      document.getElementById("myCanvas").style.cursor = "move";
    } else {
      document.getElementById("myCanvas").style.cursor = "default";
    }
  };

  const handleVerticalRefHover = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hover = false;

    if (
      mouse_in_reference_dot(x, y, veritcalReferencePoint[0]) ||
      mouse_in_reference_dot(x, y, veritcalReferencePoint[1])
    ) {
      hover = true;
    }

    if (hover) {
      document.getElementById("myCanvas").style.cursor = "move";
    } else {
      document.getElementById("myCanvas").style.cursor = "default";
    }
  };

  function calculateLineLength(x1, y1, x2, y2) {
    console.log("Getting Line Lenght");
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  const handleCalculateClick = () => {
    setShowWarnings(false);
    setShowResults(false);
    if (!areaEnclosed || dots.length < 3) {
      setErrorMessage(
        "Please skectch the area of which you would like to calculate the volume"
      );
      setShowWarnings(true);
    } else if (referencePoints.length == 0) {
      setErrorMessage("Please add a reference line for scale");
      setShowWarnings(true);
    } else if (referenceLength == 0) {
      setErrorMessage("Please give your reference line a value greater than 0");
      setShowWarnings(true);
    } else if (veritcalReferencePoint.length == 0) {
      setErrorMessage("Please add a vertical reference line");
      setShowWarnings(true);
    } else if (distanceFromRefToCenter == 0) {
      setErrorMessage(
        "Please add a distance from your vertical reference line to the center of the tube thats greater than zero"
      );
      setShowWarnings(true);
    } else if (
      referencePoints.length > 0 &&
      veritcalReferencePoint.length > 0
    ) {
      let currRef = referenceLength;
      let numPixelsInLine = calculateLineLength(
        referencePoints[0][0],
        referencePoints[0][1],
        referencePoints[1][0],
        referencePoints[1][1]
      );
      let pixelLength = currRef / numPixelsInLine;
      let pixelArea = pixelLength * pixelLength;

      let pixels = getPixelsInPolygon();
      let distanceFromCenter = 0;
      let volume = 0;

      for (let i = 0; i < pixels.length; i++) {
        distanceFromCenter = getDistanceFromCenter(
          pixels[i].x,
          pixels[i].y,
          veritcalReferencePoint[0][0],
          veritcalReferencePoint[0][1],
          veritcalReferencePoint[1][0],
          veritcalReferencePoint[1][1],
          pixelLength,
          centerOrientation
        );
        //console.log("dist from center:", distanceFromCenter);
        volume += pixelArea * distanceFromCenter * 2 * Math.PI;
      }

      setAreaDisplay(pixels.length * pixelArea);
      setPerimeterDisplay("TBI");
      setVolumeDisplay(volume);
      setShowResults(true);
    }
  };

  const getDistanceFromCenter = function (
    x,
    y,
    x1,
    y1,
    x2,
    y2,
    pixelLength,
    centerOrientation
  ) {
    //console.log(x,y,x1,y1,x2,y2);
    // Calculate the slope of the line
    const slope = (y2 - y1) / (x2 - x1);

    // Calculate the y-intercept of the line
    const yIntercept = y1 - slope * x1;

    // Calculate the slope of the perpendicular line
    const perpendicularSlope = -1 / slope;

    // Calculate the y-intercept of the perpendicular line
    const perpendicularYIntercept = y - perpendicularSlope * x;

    // Calculate the x-coordinate of the perpendicular intercept
    const perpendicularX =
      (yIntercept - perpendicularYIntercept) / (perpendicularSlope - slope);

    // Calculate the y-coordinate of the perpendicular intercept
    const perpendicularY =
      perpendicularSlope * perpendicularX + perpendicularYIntercept;

    // Return the coordinates of the perpendicular intercept as an object

    // Calculate the length of the line segment using the distance formula
    const length = Math.sqrt(
      Math.pow(x - perpendicularX, 2) + Math.pow(y - perpendicularY, 2)
    );
    //console.log("Lenght", length);

    return distanceFromRefToCenter - length * pixelLength;
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
            a: pixels[pixelIndex + 3],
          });
        }
      }
    }

    return pixelsInPolygon;
  }

  function isPointInPolygon(x, y, polygonPoints) {
    let isInside = false;
    for (
      let i = 0, j = polygonPoints.length - 1;
      i < polygonPoints.length;
      j = i++
    ) {
      const xi = polygonPoints[i].x,
        yi = polygonPoints[i].y;
      const xj = polygonPoints[j].x,
        yj = polygonPoints[j].y;
      const intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }
    return isInside;
  }

  const findPixelsWithColor = function () {
    console.log("Starting to get pixel count");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
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
        var y = Math.floor(i / 4 / canvas.width);
        pixelsWithColor.push([x, y]);
      }
    }
    console.log("Total Pixels", pixelsWithColor.length);
    return pixelsWithColor;
  };

  const mouse_in_dot = function (x, y, dot) {
    let shape_left = dot.x - DOT_WIDTH;
    let shape_right = dot.x + dot.width + DOT_WIDTH;
    let shape_top = dot.y - DOT_HEIGHT;
    let shape_bottom = dot.y + dot.height + DOT_HEIGHT;
    if (
      x > shape_left &&
      x < shape_right &&
      y > shape_top &&
      y < shape_bottom
    ) {
      return true;
    }
    return false;
  };

  const mouse_in_reference_dot = function (x, y, point) {
    if (point) {
      let shape_left = point[0] - DOT_WIDTH;
      let shape_right = point[0] + DOT_WIDTH + DOT_WIDTH;
      let shape_top = point[1] - DOT_HEIGHT;
      let shape_bottom = point[1] + DOT_HEIGHT + DOT_HEIGHT;
      if (
        x > shape_left &&
        x < shape_right &&
        y > shape_top &&
        y < shape_bottom
      ) {
        console.log("IN REFERENCE");
        return true;
      }
    }

    return false;
  };

  const isClickOnLine = function (x, y, line) {
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

    var distance =
      Math.abs(
        (endY - startY) * x -
          (endX - startX) * y +
          endX * startY -
          endY * startX
      ) / Math.sqrt(Math.pow(endY - startY, 2) + Math.pow(endX - startX, 2));

    if (distance <= threshold) {
      return true;
    } else {
      return false;
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (dragMode) {
      let index = 0;

      for (let dot of dots) {
        if (mouse_in_dot(x, y, dot)) {
          console.log("yes");
          setIsDragging(true);
          setToDragIndex(index);
        } else {
          console.log("no");
        }

        index++;
      }
    }
    if (showReference && referencePoints.length > 0) {
      if (mouse_in_reference_dot(x, y, referencePoints[0])) {
        console.log("REFERENCE POINT");
        setIsRefDragging(true);
        setRefDragIndex(0);
      } else if (mouse_in_reference_dot(x, y, referencePoints[1])) {
        console.log("REFERENCE POINT");
        setIsRefDragging(true);
        setRefDragIndex(1);
      }
    }
    if (showVeritcalReference && veritcalReferencePoint.length > 0) {
      if (mouse_in_reference_dot(x, y, veritcalReferencePoint[0])) {
        console.log("REFERENCE POINT");
        setIsVertRefDragging(true);
        setVertDragIndex(0);
      } else if (mouse_in_reference_dot(x, y, veritcalReferencePoint[1])) {
        console.log("REFERENCE POINT");
        setIsVertRefDragging(true);
        setVertDragIndex(1);
      }
    }
  };

  const increaseScale = (e) => {
    setPictureScale(pictureScale + 0.1);
  };
  const decreaseScale = (e) => {
    setPictureScale(pictureScale - 0.1);
  };

  const handleDragModeClick = (e) => {
    setDragMode(true);
    setDeleteMode(false);
    setDotMode(false);
    setReferenceMode(false);
    setVerticalReferenceMode(false);
  };
  const handleDotModeClick = (e) => {
    setDragMode(false);
    setDeleteMode(false);
    setDotMode(true);
    setReferenceMode(false);
    setVerticalReferenceMode(false);
  };
  const handleDeleteModeClick = (e) => {
    setDragMode(false);
    setDeleteMode(false);
    setAreaEnclosed(false);
    setDots([]);
    setReferencePoints([]);
    setShowReference(false);
    setShowVeritcalReference(false);
    setReferenceLength(0);
    refreshCanvas();
  };
  const handleUndoButtonClick = (e) => {
    setAreaEnclosed(false);
    dots.pop();
    refreshCanvas();
  };
  const handleReferenceClick = (e) => {
    console.log("adding refference");
    setShowReference(true);
    setReferenceMode(true);
    setDragMode(false);
    setDeleteMode(false);
    setDotMode(false);
    setVerticalReferenceMode(false);
    referencePoints.push([100, 110]);
    referencePoints.push([300, 110]);
    refreshCanvas();
  };

  const handleVerticalReferenceModeClick = (e) => {
    console.log("Inner Wall line");
    setShowVeritcalReference(true);
    setVerticalReferenceMode(true);
    setReferenceMode(false);
    setDragMode(false);
    setDeleteMode(false);
    setDotMode(false);
    veritcalReferencePoint.push([100, 10]);
    veritcalReferencePoint.push([100, 210]);
    refreshCanvas();
  };
  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  const handleCanvasMouseEnter = () => {
    setIsCanvasHovered(true);
  };

  const handleCanvasMouseLeave = () => {
    setIsCanvasHovered(false);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleHomeClick = () => {
    location.href = "/";
  };
  const closeMobileModal = () => {
    alert("Liar");
  };

  return (
    <div className="calculator-wrapper">
      <div className="modal-overlay mobile-show">
        <div className="modal">
          <div className="modal-content">
            <div className="modalbar"></div>

            <div className="modal-description">
              <div className="modal-title">
                <h2>Hi There,</h2>
              </div>
              <p>
                Several essential features of this application do not work on a
                mobile phone. In order to use the app, please join using a
                desktop browser
              </p>
            </div>
            <div className="modal-buttons">
              <button className="simple-button gray" onClick={closeMobileModal}>
                I am on a browser
              </button>
              <button className="simple-button" onClick={handleHomeClick}>
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${showModal ? "show" : ""}`}>
        <div className="modal">
          <div className="modal-content">
            <div className="modalbar">
              <button onClick={closeModal}>X</button>
            </div>

            <div className="modal-description">
              <div className="modal-title">
                <h2>Welcome to the Tube Volume Calculator</h2>
              </div>

              <p>
                Determining the volume of a tube cross section plays a crucial
                role in the analysis of samples. To calculate this volume, the
                shell method is employed, following the equation:
              </p>
              <div className="equation">
                <img src="/volume-equation.svg" alt="" />
              </div>
              <p>
                Where R represents the measurement from the center of the tube
                (excluding the center of the wall). To begin the volume
                calculation, start by uploading an image of the sample onto the
                website. Then, utilize the dot tool to define the desired
                calculation area and outline it accordingly. This designated
                area will be divided into a finite number of nodes. The size of
                each node is determined based on a reference scale line that you
                provide, which can be established using either a known length or
                a scale measurement. Subsequently, the volume of each node is
                determined by evaluating the horizontal distance relative to the
                center of the tube wall. This involves placing a vertical
                reference line and indicating the distance between the line and
                the center of the tube, typically on the inner wall. By clicking
                the "calculate" button, you can obtain the precise volume
                measurement for your analysis.
              </p>
            </div>
            <div className="modal-buttons">
              <button className="simple-button" onClick={closeModal}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="menu-bar">
        <div className="icon-wrapper">
          <ButtonWithIcon
            display={dotMode}
            onButtonClick={handleDotModeClick}
            idP={"dots"}
            imageUrl={"/dots.svg"}
            hint="Draw outline"
          />
          <ButtonWithIcon
            display={dragMode}
            onButtonClick={handleDragModeClick}
            idP={"hand"}
            imageUrl={"/hand.svg"}
            hint="Move Area Dots"
          />
          <ButtonWithIcon
            display={referenceMode}
            onButtonClick={handleReferenceClick}
            idP={"reference"}
            imageUrl={"/reference.svg"}
            hint="Add/move scale reference"
          />
          <ButtonWithIcon
            display={verticalReferenceMode}
            onButtonClick={handleVerticalReferenceModeClick}
            idP={"distance"}
            imageUrl={"/distance.svg"}
            hint="Add/move vertical locator"
          />
          <ButtonWithIcon
            display={false}
            onButtonClick={handleDeleteModeClick}
            idP={"clear"}
            imageUrl={"/clear.svg"}
            hint="Clear all markings"
          />
          <button className="menu-icon" onClick={handleUndoButtonClick}>
            <FontAwesomeIcon id="undo" icon={faRotateLeft} color="white" />
          </button>

          {/* <button className={dotMode ? 'menu-icon-active' : 'menu-icon'} onClick={handleDotModeClick}><img id='dots' src="/dots.svg" alt="My SVG file" /></button>
                <button className={dragMode ? 'menu-icon-active' : 'menu-icon'} onClick={handleDragModeClick}><img id='hand' src="/hand.svg" alt="My SVG file" /></button>
                <button className={referenceMode ? 'menu-icon-active' : 'menu-icon'} onClick={handleReferenceClick}><img id='reference' src="/reference.svg" alt="My SVG file" /></button>
                <button className={verticalReferenceMode ? 'menu-icon-active' : 'menu-icon'} onClick={handleVerticalReferenceModeClick}><img id='distance' src="/distance.svg" alt="My SVG file" /></button>
                <button className='menu-icon' onClick={handleDeleteModeClick}><img id='clear' src="/clear.svg" alt="My SVG file" /></button>
                <button className='menu-icon' onClick={handleUndoButtonClick}><FontAwesomeIcon  id='undo' icon={faRotateLeft} color='white' /></button>
                
                 */}
        </div>

        <div className="page-title">
          <img className="navbar-logo" src="/logo.svg" alt="Logo" />
          <a href="/" className="navbar-title">
            analyze it
          </a>
        </div>

        <div className="right-menu-col">
          <div className="zoom-wrapper">
            <button className="zoom-icon" onClick={increaseScale}>
              +
            </button>
            <button className="zoom-icon" onClick={decreaseScale}>
              -
            </button>
          </div>

          <div className="file-upload-container">
            <input
              type="file"
              onChange={handleUpload}
              className="file-upload-input"
            />
            <button className="file-upload-button">
              <FontAwesomeIcon icon={faUpload} color="white" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      </div>

      <div className="main-page">
        <div className="left-column">
          <div className="left-column-content">
            <div className="col-item">
              <div className="col-item-header">
                <div className="col-item-title">
                  <img src="/units.svg" alt="My SVG file" />
                  <p>Units</p>
                </div>

                <HintIcon
                  icon={faQuestionCircle}
                  text="So far selecting the units is purely cosmetic for the input values. One day it will allow different units for input and output"
                />
              </div>

              <div className="col-item-body">
                <div className="col-item-body-centered">
                  <select
                    id="unit-dropdown"
                    value={selectedUnit}
                    onChange={handleUnitChange}
                  >
                    <option value="mm">Milimeter (mm)</option>
                    <option value="cm">Centimeter (cm)</option>
                    <option value="m">Meter (m)</option>
                    <option value="in">Inch (in)</option>
                    <option value="ft">Foot (ft)</option>
                    <option value="yd">Yard (yd)</option>
                    <option value="mi">Mile (mi)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-item">
              <div className="col-item-header">
                <div className="col-item-title">
                  <img src="/location.svg" alt="My SVG file" />
                  <p>Center of Tube Location</p>
                </div>

                <HintIcon
                  icon={faQuestionCircle}
                  text="This feature is under construction, but this indicates the orientation of the cross section, which is needed to maintain correct orientation of the inner and outer wall. For now, to gain an accurate calculation of a cross-section that is oriented such as the center of the tube is on the right side, simply invert the image horizonatally. "
                />
              </div>
              <div className="col-item-body">
                <ToggleSwitch />
              </div>
            </div>

            <div className="col-item">
              <div className="col-item-header">
                <div className="col-item-title">
                  <img src="/reference-gray.svg" alt="My SVG file" />
                  <p>Scale</p>
                </div>

                <HintIcon
                  icon={faQuestionCircle}
                  text="Place the reference line over a known measurement and input its value. With a tube, use the wall thickness as a good reference point."
                />
              </div>
              <div className="col-item-body">
                <div className="col-item-body-line">
                  <p>Scale Reference Line</p>
                  <div id="reference-line" className="line-display"></div>
                </div>
                <div className="col-item-body-input">
                  <input
                    type="text"
                    value={referenceLength}
                    onChange={handleSetReferenceChange}
                  />
                  <p>{selectedUnit}</p>
                </div>
              </div>
            </div>

            <div className="col-item">
              <div className="col-item-header">
                <div className="col-item-title">
                  <img src="/distance-gray.svg" alt="My SVG file" />
                  <p>Distance to Center of Tube (ID)</p>
                </div>

                <HintIcon
                  icon={faQuestionCircle}
                  text="This vertical line functions as a scale reference to measure the distance from the center of the tube to the line. This measurement is needed to perform the double integral, as it determines the distance of the indicated area from the center of the tube. Usually the line will be placed on the inner wall using the inner radius as the value. The line does not need to be perfectly vertical, the degree of tilt will be taken into consideration for the calculations. The center of tube location is more of a general direction."
                />
              </div>

              <div className="col-item-body">
                <div className="col-item-body-line">
                  <p>Vertical Reference Line</p>
                  <div id="inner-wall-line" className="line-display"></div>
                </div>
                <div className="col-item-body-input">
                  <input
                    type="text"
                    value={distanceFromRefToCenter}
                    onChange={handleSetDistanceToCenterChange}
                  />
                  <p>{selectedUnit}</p>
                </div>
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
            <div className="col-item">
              <div className="calc-btn-container">
                <button
                  className="calculate-button"
                  onClick={() => {
                    handleCalculateClick();
                  }}
                >
                  Calculate
                </button>
              </div>
              <div className="col-item-body">
                <div className="results">
                  {showWarnings && <p>Error: {errorMessage}</p>}
                  {showResults && (
                    <ResultsTable
                      area={areaDisplay.toFixed(3)}
                      perimeter={perimeterDisplay}
                      volume={volumeDisplay.toFixed(3)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* <div style={{marginTop:"200px"}}>
                    <button onClick={refreshCanvas}>FORCE REFRESH</button>
                </div> */}
          </div>
        </div>

        <div className="right-column">
          <canvas
            onMouseDown={(event) => {
              handleMouseDown(event);
            }}
            onMouseUp={handleDotRelease}
            onMouseMove={(event) => {
              if (dragMode) {
                handleDotHover(event);
                if (isDragging && toDragIndex !== null) {
                  handleDotDrag(event, toDragIndex);
                }
              }
              if (referenceMode) {
                handleRefHover(event);
                if (isRefDragging) {
                  handleRefDrag(event, toRefDragIndex);
                }
              }
              if (verticalReferenceMode) {
                handleVerticalRefHover(event);
                if (isVertRefDragging) {
                  handleVertRefDrag(event, vertDragIndex);
                }
              }
            }}
            id="myCanvas"
            ref={canvasRef}
            width={windowWidth}
            height={windowHeight}
            // onClick={handleCanvasClick}
            onClick={(event) => {
              if (!isDragging) {
                handleCanvasClick(event);
              }
            }}
            className="main-canvas"
            onMouseEnter={handleCanvasMouseEnter}
            onMouseLeave={handleCanvasMouseLeave}
            style={{
              cursor: isCanvasHovered
                ? "url(/dot-cursor.svg) 0 20, auto"
                : "default",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Calculator;

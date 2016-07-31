# Canvasspinner

Canvasspinner is a small library of, easy to use, spinners, which is made with javascript and the HTML5 canvas element. 



# How to spin
All you need to do is to include the provided files into the head.

//You only need a container div, with a canvas element embedded. Like this
<div id="containerId">
  <canvas id="canvasId"></canvas>
</div>


//Then you need to put these id's into an object
var spinnerObj = {
  type : "clockSpinner", // spinner name
  containerId : "containerId",
  canvasId : "canvasId"
};


//Then call the canvasspinner, and your done.
canvasspinner.init(spinnerObj);



Every spinner is ofcourse customizable, and each example is demonstrated in the index.html file.


This library has been build upon the math and particle library created and taught by Keith Peters.



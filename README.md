# Canvasspinner

Canvasspinner is a small library of, easy to use, spinners, which is made with javascript and the HTML5 canvas element. 

# How to spin
All you need to do is to include the provided files into the head.

<i>You only need a container div, with a canvas element embedded. Like this.</i><br>
"<div id="containerId">"<br>
  "<canvas id="canvasId"></canvas>"<br>
"</div>"<br>

<i>Then you need to put these id's into an object. </i> <br>
var spinnerObj = { <br>
    type : "clockSpinner", <br>
    containerId : "containerId",<br>
    canvasId : "canvasId"<br>
};<br>

<i>Then call the canvasspinner, and your done.</i><br>
<b>canvasspinner.init(spinnerObj);</b>

Every spinner is ofcourse customizable, and each example is demonstrated in the index.html file.</b></b>

# Disclaimer
The canvasspinner project is at a very early stage, so be aware that some spinners not yet are fully customizable yet. And others might be glitchy etc...</b></b>

# Credits

This library has been build upon the math and particle library created and taught by Keith Peters. So special shout out to Keith, peace!



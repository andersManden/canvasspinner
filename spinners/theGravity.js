var theGravity = (function(){

    var canvas = null,
        context = null,
        width = null,
        height = null;

    var angle = Math.PI * 1.5,
        speed = 0.02,
        acc = 0.01;

    var arcRadius = null,
        lineColor = null,
        lineWidth = null,
        dotColor = null,
        dotSize = null,
        opacity = null;

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        arcRadius = spinner.arcRadius ? spinner.arcRadius : 20;
        lineColor = spinner.lineColor ? spinner.lineColor : '#4b4b4b';
        lineWidth = spinner.lineWidth ? spinner.lineWidth : 1;
        dotColor = spinner.dotColor ? spinner.dotColor : '#4b4b4b';
        dotSize = spinner.dotSize ? spinner.dotSize : 2;
        opacity = spinner.opacity ? spinner.opacity : 1;

        clearCanvas();
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        context.beginPath();
        context.arc(width / 2 + Math.cos(angle) * arcRadius, height / 2 + Math.sin(angle) * arcRadius, dotSize, 0, Math.PI * 2, false);
        context.fillStyle = dotColor;
        context.globalAlpha = opacity;
        context.fill();

        context.beginPath();
        context.arc(width / 2, height / 2 , arcRadius, 0, Math.PI * 2, false);
        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        context.stroke();

        if (angle >= Math.PI * 1.5 ) {
            speed += acc;
        } else if (angle >= 0 && angle <= Math.PI * 0.5) {
            speed += acc;
        } else {
            speed -= acc * 1.05;
        }

        if (angle > Math.PI * 2) {
            angle = 0;
        }

        angle += speed;
        context.restore();
    }

    return {
        init : init
    }
})();
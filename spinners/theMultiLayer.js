var theMultiLayer = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var spinnerLayers = null,
        run  = 'head';

    var layers = [];

    var spinner = null;

    function init (spinnerData) {
        var container = document.getElementById(spinnerData.containerId);
        canvas = document.getElementById(spinnerData.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        spinner = spinnerData;

        spinnerLayers = spinnerData.layers;
        layers = layersFactory(spinnerData);

        clearCanvas();
    }

    function layersFactory (spinner) {
        var layers = [];
        var distance = spinner.arcRadiusOffset;
        for (var i = 0; i < spinner.layers; i++) {
            var layer = {
                angleA : 0,
                angleB : 1,
                speedA : 0.1,
                speedB : 0.02,
                headColor : spinner.template.headColor,
                headSize : 3,
                tailColor : spinner.template.tailColor,
                tailSize : 2,
                bodyColor : spinner.template.bodyColor,
                bodyStrokeWidth : 1,
                distMin : 1,
                distMax : 4,
                arcRadius :distance,
                pSize : 1,
                pHead : canvasSpinners.particleFactory(1, width, height, distance, 0, false, null, null, null),
                pTail : canvasSpinners.particleFactory(1, width, height, distance, 0, false, null, null, null)
            };
            layers.push(layer);
            distance = distance - spinner.layersDistance;
        }
        return layers;
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        for (var i = 0; i < spinnerLayers; i++) {
            context.beginPath();
            context.arc(layers[i].pHead[0].x = width / 2 + Math.cos(spinner.angleA) * layers[i].arcRadius, layers[i].pHead[0].x = height / 2 + Math.sin(spinner.angleA) * layers[i].arcRadius, 0.5, 0, Math.PI * 2, false);
            context.arc(layers[i].pTail[0].x = width / 2 + Math.cos(spinner.angleB) * layers[i].arcRadius, layers[i].pTail[0].x = height / 2 + Math.sin(spinner.angleB) * layers[i].arcRadius, 0.5, 0, Math.PI * 2, false);
            context.fillStyle = '#4b4b4b';
            context.fill();

            context.beginPath();
            context.arc(width / 2, height / 2, layers[i].arcRadius, spinner.angleA, spinner.angleB, false);
            context.strokeStyle = '#4b4b4b'; //layers[i].bodyColor
            context.lineWidth = spinner.lineWidth;
            context.stroke();
        }

        var dist = spinner.angleB - spinner.angleA;
        if (run === 'tail') {
            spinner.angleA += spinner.speedA;
            spinner.angleB += spinner.speedB;
            if (dist < spinner.distMin) {
                run = 'head';
            }
        } else if (run === 'head') {
            spinner.angleA += spinner.speedB;
            spinner.angleB += spinner.speedA;
            if (dist > spinner.distMax) {
                run = 'tail';
            }
        }

        context.restore();
    }

    return {
        init : init
    }
})();
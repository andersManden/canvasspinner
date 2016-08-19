var theCircle = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = null,
        angleHead = null,
        angleTail = null,
        headTimer = 1,
        tailTimer = 0,
        speedA = null,
        speedB = null,
        headColor = null,
        headSize = null,
        tailColor = null,
        tailSize = null,
        bodyColor = null,
        bodyStrokeWidth = null,
        distMin = null,
        distMax = null,
        run  = 'head';

    var particles = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        arcRadius = spinner.arcRadius ? spinner.arcRadius : 20;
        angleHead = spinner.angleA ? spinner.angleA : 0;
        angleTail = spinner.angleB ? spinner.angleB : 1;
        speedA = spinner.speedA ? spinner.speedA : 0.15;
        speedB = spinner.speedB ? spinner.speedB : 0.06;
        headColor = spinner.headColor ? spinner.headColor : '#4b4b4b';
        headSize = spinner.headSize ? spinner.headSize : 2;
        tailColor = spinner.tailColor ? spinner.tailColor : '#4b4b4b';
        tailSize = spinner.tailSize ? spinner.tailSize : 1;
        bodyColor = spinner.bodyColor ? spinner.bodyColor : '#4b4b4b';
        bodyStrokeWidth = spinner.bodyStrokeWidth ? spinner.bodyStrokeWidth : 1;
        distMin = spinner.distMin ? spinner.distMin : 1;
        distMax = spinner.distMax ? spinner.distMax : 4;

        particles = spinners.particleFactory(2, width, height, arcRadius, 0, false, null, null, null);

        clearCanvas();
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        setSpeed();
        render();
        requestAnimationFrame(clearCanvas);
    }

    function setSpeed() {
        var dist = angleTail - angleHead;
        var timer =  headTimer - tailTimer;
        if (run === 'tail') {
            angleHead += speedA;
            angleTail += speedB;
            headTimer += speedB;
            tailTimer += speedA;
            if (dist <  distMin) {
                run = 'pauseHead';
            }
        } else if (run === 'head') {
            angleHead += speedB;
            angleTail += speedA;
            headTimer += speedA;
            tailTimer += speedB;
            if (dist > distMax) {
                run = 'pauseTail';
            }
        }  else if (run === 'pauseTail') {
            angleHead += speedB;
            angleTail += speedB;
            headTimer += speedA;
            tailTimer += speedB;
            if (timer >= Math.PI * 2) {
                run = 'tail';
                headTimer = angleTail;
            }
        } else if (run === 'pauseHead'){
            angleHead += speedB;
            angleTail += speedB;
            headTimer += speedB;
            tailTimer += speedA;
            if (timer <= 0) {
                run = 'head';
                tailTimer = angleHead;
            }
        }
    }

    function render () {
        context.save();

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadius, angleHead, angleTail, false);
        context.lineWidth = bodyStrokeWidth;
        context.strokeStyle = bodyColor;
        context.stroke();

        for (var i = 0; i < particles.length; i++) {
            // TAIL
            context.beginPath();
            context.arc(particles[0].x = width / 2 + Math.cos(angleHead) * arcRadius, particles[i].y = height / 2 + Math.sin(angleHead) * arcRadius, tailSize, 0, Math.PI * 2, false);
            context.fillStyle = tailColor;
            context.fill();
            // HEAD
            context.beginPath();
            context.arc(particles[1].x = width / 2 + Math.cos(angleTail) * arcRadius, particles[1].y = height / 2 + Math.sin(angleTail) * arcRadius, headSize, 0, Math.PI * 2, false);
            context.fillStyle = headColor;
            context.fill();
        }
        context.restore();
    }
    
    return {
        init : init
    }
})();
function CircleSpinner(spinner){
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
        direction = null,
        color = null,
        opacity = null,
        run  = 'head';

    var particles = [];

    var ratio = null;

    init(spinner);

    function init (spinner) {
        setEnviroment(spinner);
        standardOptions(spinner);
        specificOptions(spinner);
        createParticles();
        initCanvas();
    }

    function setEnviroment (spinner) {
        var container = document.getElementById(spinner.setup.containerId);
        canvas = document.getElementById(spinner.setup.canvasId);
        context = canvas.getContext('2d');
        retinaDimensions(container);
    }

    function retinaDimensions (container) {
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
        ratio = devicePixelRatio / backingStoreRatio;
        width = canvas.width = container.offsetWidth * ratio;
        height = canvas.height = container.offsetHeight * ratio;
        canvas.style.width = width / ratio + 'px';
        canvas.style.height = height / ratio + 'px';
    }

    function standardOptions (spinner) {
        arcRadius = spinner.options.radius ? spinner.options.radius : 20;
        direction = spinner.options.direction ? spinner.options.direction : 'right';
        color = spinner.options.color ? spinner.options.color : '#4b4b4b';
        opacity = spinner.options.opacity ? spinner.options.opacity : 1;
    }

    function specificOptions (spinner) {
        angleHead = spinner.advancedOptions.angleA ? spinner.advancedOptions.angleA : 0;
        angleTail = spinner.advancedOptions.angleB ? spinner.advancedOptions.angleB : 1;
        speedA = spinner.advancedOptions.speedA ? spinner.advancedOptions.speedA : 0.15;
        speedB = spinner.advancedOptions.speedB ? spinner.advancedOptions.speedB : 0.06;
        headColor = spinner.advancedOptions.headColor ? spinner.advancedOptions.headColor : '#4b4b4b';
        headSize = spinner.advancedOptions.headSize ? spinner.advancedOptions.headSize : 2;
        tailColor = spinner.advancedOptions.tailColor ? spinner.advancedOptions.tailColor : '#4b4b4b';
        tailSize = spinner.advancedOptions.tailSize ? spinner.advancedOptions.tailSize : 1;
        bodyColor = spinner.advancedOptions.bodyColor ? spinner.advancedOptions.bodyColor : '#4b4b4b';
        bodyStrokeWidth = spinner.advancedOptions.bodyStrokeWidth ? spinner.advancedOptions.bodyStrokeWidth : 1;
        distMin = spinner.advancedOptions.distMin ? spinner.advancedOptions.distMin : 1;
        distMax = spinner.advancedOptions.distMax ? spinner.advancedOptions.distMax : 4;
    }

    function createParticles () {
        particles = spinners.particleFactory(2, width, height, arcRadius, 0, false, null, null, null);
    }

    function initCanvas() {
        context.clearRect(0, 0, width, height);
        setSpeed();
        render();
        requestAnimationFrame(initCanvas);
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
        context.globalAlpha = opacity;
        context.stroke();

        for (var i = 0; i < particles.length; i++) {
            /* Tail */
            context.beginPath();
            context.arc(particles[0].x = width / 2 + Math.cos(angleHead) * arcRadius, particles[i].y = height / 2 + Math.sin(angleHead) * arcRadius, tailSize, 0, Math.PI * 2, false);
            context.fillStyle = tailColor;
            context.globalAlpha = opacity;
            context.fill();
            /* Head */
            context.beginPath();
            context.arc(particles[1].x = width / 2 + Math.cos(angleTail) * arcRadius, particles[1].y = height / 2 + Math.sin(angleTail) * arcRadius, headSize, 0, Math.PI * 2, false);
            context.fillStyle = headColor;
            context.globalAlpha = opacity;
            context.fill();
        }
        context.restore();
    }
    
    return {
        init : init
    }
};
var spinners = (function(){

    function init(spinner) {
        switch (spinner.spinner) {
            case 'theCircle':
                theCircle.init(spinner);
                break;
            case 'theTail':
                theTail.init(spinner);
                break;
            case 'star':
                theExperiments.init(spinner);
                break;
            case 'wormII':
                theMultiLayer.init(spinner);
                break;
            case 'worm':
                theWorm.init(spinner);
                break;
            case 'drop':
                theGravity.init(spinner);
                break;
            case 'theWeirdSpoke':
                theWeirdSpoke.init(spinner);
                break;
            case 'theWatch':
                theWatch.init(spinner);
                break;
            case 'catchUpSpinnerII' :
                theCatchupExperiment.init(spinner);
                break;
            case 'theGear' :
                theGear.init(spinner);
                break;
        }
    }

    function particleFactory (amount, width, height, arcRadius, customAngle, ifSprings, friction, springStrength, springLength) {
        var angle =  customAngle ? customAngle : 0;
        var particles = [];
        for (var i = 0; i < amount; i++) {
            var myParticle = particle.create(width / 2 + Math.cos(angle) * arcRadius, height / 2 + Math.sin(angle) * arcRadius, 0, 0, 0);
            var springPoint = particle.create(width / 2, height / 2 , 0, 0, 0);
            if (ifSprings) {
                myParticle.friction =  friction;
                myParticle.addSpring(springPoint, springStrength, springLength);
            }
            myParticle.angleStart = angle;
            angle += Math.PI / (amount / 2);
            myParticle.angleStop = angle;
            myParticle.arcX = myParticle.x;
            myParticle.arcY = myParticle.y;
            particles.push(myParticle);
        }
        return particles;
    }

    return {
        init : init,
        particleFactory : particleFactory
    }

})();

var theCatchupExperiment = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var startAngleA = 0,
        stopAngleA = 1,
        startAngleB = 1,
        stopAngleB = 1,
        angleSpeed = 2,
        speed1 = 0.1,
        speed2 = 0.04,
        run = 'stopAngleB',
        color = null,
        arcRadius = 20,
        lineWidth = 3;

    var particles = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;


        speed1 = spinner.speedA ? spinner.speedA : 0.1;
        speed2 = spinner.speedB ? spinner.speedB : 0.04;
        color = spinner.myColor ? spinner.myColor : '#4b4b4b';
        arcRadius = spinner.myArcRadius ? spinner.myArcRadius : 20;
        lineWidth = spinner.myLineWidth ? spinner.myLineWidth : 3;

        particles = spinners.particleFactory(5, width, height, arcRadius, 0, false, null, null, null);

        clearCanvas();
    }

    function clearCanvas(){
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        if (run === 'startAngleB') {
            startAngleA += speed2;
            stopAngleA += speed2;
            startAngleB += speed1;
            stopAngleB += speed2;
            if (utils.distanceXY(particles[2].x, particles[2].y, particles[3].x, particles[3].y) < 3) {
                run = 'pauseBA';
            }
        } else if (run === 'stopAngleA') {
            startAngleA += speed2;
            stopAngleA += speed1;
            startAngleB += speed2  - 0.01;
            stopAngleB += speed2;
            if (utils.distanceXY(particles[1].x, particles[1].y, particles[2].x, particles[2].y) < 3) {
                run = 'pauseAA';
            }
        } else if (run === 'startAngleA') {
            startAngleA += speed1;
            stopAngleA += speed2;
            startAngleB += speed2 ;
            stopAngleB += speed2;
            if (utils.distanceXY(particles[0].x, particles[0].y, particles[1].x, particles[1].y) < 3) {
                run = 'pauseAB';
            }
        } else if (run === 'stopAngleB') {
            startAngleA += speed2 - 0.02;
            stopAngleA += speed2;
            startAngleB += speed2;
            stopAngleB += speed1;
            if (utils.distanceXY(particles[0].x, particles[0].y, particles[3].x, particles[3].y) <3) {
                run = 'pauseBB';
            }
        } else if (run === 'pauseBB') {
            startAngleA += speed2;
            stopAngleA += speed2;
            startAngleB += speed2 + 0.02;
            stopAngleB += speed2;
            if (utils.distanceXY(particles[2].x, particles[2].y, particles[4].x, particles[4].y) < 2 ) {
                run = 'startAngleB';
            }
        } else if (run === 'pauseBA') {
            startAngleA += speed2;
            stopAngleA = stopAngleA + 0.01;
            stopAngleA += speed2 + 0.01;
            startAngleB += speed2;
            stopAngleB += speed2;
            if (utils.distanceXY(particles[1].x, particles[1].y, particles[4].x, particles[4].y) < 2 ) {
                run = 'stopAngleA';
            }
        } else if (run === 'pauseAA') {
            startAngleA += speed2 + 0.01;
            stopAngleA += speed2;
            //startAngleB = startAngleB - 0.01;
            startAngleB += speed2;

            stopAngleB += speed2 + 0.01;
            if (utils.distanceXY(particles[0].x, particles[0].y, particles[4].x, particles[4].y) < 2 ) {
                run = 'startAngleA';
            }
        } else if (run === 'pauseAB') {
            startAngleA += speed2;
            stopAngleA += speed2;
            startAngleB += speed2;
            stopAngleB += speed2 + 0.03;
            if (utils.distanceXY(particles[3].x, particles[3].y, particles[4].x, particles[4].y) < 2 ) {
                run = 'stopAngleB';
            }
        }

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadius, startAngleA, stopAngleA, false);
        context.lineWidth = lineWidth;
        context.strokeStyle = 'green';
        context.strokeStyle = color;
        context.stroke();

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadius, startAngleB , stopAngleB +1, false);
        context.lineWidth = lineWidth;
        context.strokeStyle = 'red';
        context.strokeStyle = color;
        context.stroke();

        for (var i = 0; i < particles.length; i++) {
            context.beginPath();
            context.arc(particles[0].x = width / 2 + Math.cos(startAngleA) * arcRadius, particles[0].y = height / 2 + Math.sin(startAngleA) * arcRadius, lineWidth / 2 - 0.2, 0, Math.PI * 2, false);
            //context.fillStyle = '#ffffff';
            context.fillStyle = color;
            //context.globalAlpha = 0;
            context.fill();

            context.beginPath();
            context.arc(particles[1].x = width / 2 + Math.cos(stopAngleA) * arcRadius, particles[1].y = height / 2 + Math.sin(stopAngleA) * arcRadius, lineWidth / 2 - 0.2, 0, Math.PI * 2, false);
            context.fillStyle = color;
            //context.fillStyle = 'pink';
            context.fill();

            context.beginPath();
            context.arc(particles[2].x = width / 2 + Math.cos(startAngleB) * arcRadius, particles[2].y = height / 2 + Math.sin(startAngleB) * arcRadius,lineWidth / 2 - 0.2, 0, Math.PI * 2, false);
            context.fillStyle = color;
            //context.fillStyle = 'blue';
            context.fill();

            context.beginPath();
            context.arc(particles[3].x = width / 2 + Math.cos(stopAngleB +1) * arcRadius, particles[3].y = height / 2 + Math.sin(stopAngleB +1) * arcRadius, lineWidth / 2 - 0.2, 0, Math.PI * 2, false);
            context.fillStyle = color;
            //context.fillStyle = 'green';
            context.fill();

            context.beginPath();
            context.arc(particles[4].x = width / 2 + Math.cos(angleSpeed) * arcRadius, particles[4].y = height / 2 + Math.sin(angleSpeed) * arcRadius, 2, 0, Math.PI * 2, false);
            context.globalAlpha = 0;
            context.fillStyle = '#ff0000';
            context.fill();
        }

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(angleSpeed) * arcRadius, height / 2 + Math.sin(angleSpeed) * arcRadius);
        context.lineWidth = 0.2;
        context.stroke();

        angleSpeed += speed1;

        context.restore();
    }

    return {
        init : init
    }
})();
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
function ClockSpinner (spinner){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = null,
        speedMinutes = null,
        speedHour = null,
        startAngleMinutes = null,
        startAngleHours = null,
        armWidthMinute = null,
        armWidthHour = null,
        clockLineWidth = null,
        armColorMinute = null,
        armColorHour = null,
        clockColorLine = null,
        clockColorFill = null,
        indicatorColorFill = null,
        color = null,
        direction = null,
        opacity = null;

    var ratio = null;

    var particles = [];

    init(spinner);

    function init (spinner) {
        setEnviroment(spinner);
        standardOptions(spinner);
        specificOptions(spinner);
        clearCanvas();
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
        arcRadius = spinner.options.radius ? spinner.options.radius : 15;
        speedMinutes = spinner.options.speed ? spinner.options.speed : 0.1;
        speedHour = speedMinutes / 12;
        direction = spinner.options.direction ? spinner.options.direction : 'right';
        opacity = spinner.options.opacity ? spinner.options.opacity : 1;
    }

    function specificOptions (spinner) {
        startAngleMinutes = spinner.advancedOptions.startAngleMinutes ? spinner.advancedOptions.startAngleMinutes : 0;
        startAngleHours = spinner.advancedOptions.startAngleHours ? spinner.advancedOptions.startAngleHours : 0;
        armWidthMinute = spinner.advancedOptions.armWidthMinute ? spinner.advancedOptions.armWidthMinute : 1;
        armWidthHour = spinner.advancedOptions.armWidthHour ? spinner.advancedOptions.armWidthHour : 2;
        clockLineWidth = spinner.advancedOptions.clockLineWidth ? spinner.advancedOptions.clockLineWidth : 1;
        armColorMinute = spinner.advancedOptions.armColorMinute ? spinner.advancedOptions.armColorMinute : '#4b4b4b';
        armColorHour = spinner.advancedOptions.armColorHour ? spinner.advancedOptions.armColorHour : '#4b4b4b';
        clockColorLine = spinner.advancedOptions.clockColorLine ? spinner.advancedOptions.clockColorLine : '#4b4b4b';
        clockColorFill = spinner.advancedOptions.clockColorFill ? spinner.advancedOptions.clockColorFill : '#ffffff';
        indicatorColorFill = spinner.advancedOptions.indicatorColorFill ? spinner.advancedOptions.indicatorColorFill : '#4b4b4b';

        if (spinner.advancedOptions.hoursIndicator) {
            particles = spinners.particleFactory(12, width, height, arcRadius / 1.2, 0, false, null, null, null);
        }
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        context.globalAlpha = opacity;

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadius, 0, Math.PI * 2, false);
        context.strokeStyle = clockColorLine;
        context.lineWidth = clockLineWidth;
        context.fillStyle = clockColorFill;
        context.globalAlpha = opacity;
        context.fill();
        context.stroke();

        for (var i = 0; i < particles.length; i++) {
            context.beginPath();
            context.arc(particles[i].x, particles[i].y, 1, 0, Math.PI * 2, false);
            context.fillStyle = indicatorColorFill;
            context.fill();
        }

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(startAngleHours) * (arcRadius / 2), height / 2 + Math.sin(startAngleHours) * (arcRadius / 2));
        context.strokeStyle = armColorHour;
        context.lineWidth = armWidthHour;
        context.stroke();

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(startAngleHours) * -(arcRadius / 4), height / 2 + Math.sin(startAngleHours) * -(arcRadius / 4));
        context.strokeStyle = armColorHour;
        context.lineWidth = armWidthHour;
        context.stroke();

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(startAngleMinutes) * (arcRadius / 1.3), height / 2 + Math.sin(startAngleMinutes) * (arcRadius / 1.3));
        context.strokeStyle = armColorMinute;
        context.lineWidth = armWidthMinute;
        context.stroke();

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(startAngleMinutes) * -(arcRadius / 3) , height / 2 + Math.sin(startAngleMinutes) * -(arcRadius / 3));
        context.strokeStyle = armColorMinute;
        context.lineWidth = armWidthMinute;
        context.stroke();


        if (direction === 'right') {
            startAngleMinutes += speedMinutes;
            startAngleHours += speedHour;
        } else if (direction === 'left') {
            startAngleMinutes -= speedMinutes;
            startAngleHours -= speedHour;
        }

        context.restore();
    }

    return {
        init : init
    }
};
var theExperiments = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadiusA = 20,
        arcRadiusB = arcRadiusA + 8,
        number = 8,
        speed = 0.03,
        speedA = 0.01,
        size = 'shrink';

    var particlesA = [];
    var particlesB = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        particlesA = spinners.particleFactory(number, width, height, arcRadiusA, 0, false, null, null, null);
        particlesB = spinners.particleFactory(number, width, height, arcRadiusB, Math.PI / number, false, null, null, null);

        clearCanvas();
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        for (var i = 0; i < number; i++) {
            context.beginPath();
            context.moveTo(particlesA[i].x = width / 2 + Math.cos(particlesA[i].angleStart) * arcRadiusA, particlesA[i].y = height / 2 + Math.sin(particlesA[i].angleStart) * arcRadiusA);
            context.lineTo(particlesB[i].x = width / 2 + Math.cos(particlesB[i].angleStart) * arcRadiusB, particlesB[i].y = height / 2 + Math.sin(particlesB[i].angleStart) * arcRadiusB);
            if (i < number -1) {
                context.lineTo(particlesA[i + 1].x , particlesA[i + 1].y);
            } else {
                context.moveTo(particlesB[number-1].x , particlesB[number-1].y);
                context.lineTo(particlesA[0].x, particlesA[0].y);
            }
            context.strokeStyle = '#4b4b4b';
            context.stroke();

            particlesA[i].angleStart += speed;
            particlesB[i].angleStart += speed;

            if (size === 'shrink') {
                arcRadiusB -= speedA;
                //speedA += 0.01;
                if (arcRadiusB <= arcRadiusA - 8 ) {
                    size = 'grow';
                }
            } else if (size === 'grow') {
                arcRadiusB += speedA;
                //speedA -= 0.01 ;
                if (arcRadiusB >= arcRadiusA + 8 ) {
                    size = 'shrink';
                }
            }
        }

        context.restore();
    }
    
    return {
        init : init
    }
})();
function GearSpinner (spinner){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadiusA = null,
        arcRadiusB = null,
        number = null,
        speed = null,
        lineWidth = null,
        innerOffset = 0.1,
        outerOffset = 0.1,
        color = null,
        direction = null,
        opacity = null;

    var particlesA = [];
    var particlesB = [];

    var ratio = null;

    init(spinner);

    function init (spinner) {
        setEnviroment(spinner);
        standardOptions(spinner);
        specificOptions(spinner);
        createParticles();
        clearCanvas();
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
        color = spinner.options.color ? spinner.options.color : '#4b4b4b';
        speed = spinner.options.speed ? spinner.options.speed : 0.06;
        direction = spinner.options.direction ? spinner.options.direction : 'right';
        opacity = spinner.options.opacity ? spinner.options.opacity : 1;
    }

    function specificOptions (spinner) {
        number = spinner.advancedOptions.teeth ? spinner.advancedOptions.teeth : 16;
        arcRadiusA = spinner.options.radius ? spinner.options.radius : 40;
        arcRadiusB = arcRadiusA - (arcRadiusA / 5);
        lineWidth = arcRadiusB / 2;
    }

    function createParticles () {
        particlesA = spinners.particleFactory(number, width, height, arcRadiusA,  Math.PI / number, false, null, null, null);
        particlesB = spinners.particleFactory(number, width, height, arcRadiusB, Math.PI / number, false, null, null, null);
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        context.globalAlpha = opacity;

        for (var j = 0; j < number; j++) {
            context.beginPath();
            context.fillStyle = color;
            if (j % 2 !== 0) {
                context.moveTo(particlesB[j].x = width / 2 + Math.cos(particlesB[j].angleStart + innerOffset) * arcRadiusB, particlesB[j].y = height / 2 + Math.sin(particlesB[j].angleStart + innerOffset) * arcRadiusB);
                context.lineTo(particlesB[j -1].x = width / 2 + Math.cos(particlesB[j -1].angleStart - innerOffset) * arcRadiusB, particlesB[j -1].y = height / 2 + Math.sin(particlesB[j -1].angleStart - innerOffset) * arcRadiusB);
                context.lineTo(particlesA[j -1].x = width / 2 + Math.cos(particlesA[j -1].angleStart + outerOffset) * arcRadiusA, particlesA[j -1].y = height / 2 + Math.sin(particlesA[j -1].angleStart + outerOffset) * arcRadiusA);
                context.lineTo(particlesA[j].x = width / 2 + Math.cos(particlesA[j].angleStart - outerOffset) * arcRadiusA, particlesA[j].y = height / 2 + Math.sin(particlesA[j].angleStart - outerOffset) * arcRadiusA);
                context.lineTo(particlesB[j].x = width / 2 + Math.cos(particlesB[j].angleStart + innerOffset) * arcRadiusB, particlesB[j].y = height / 2 + Math.sin(particlesB[j].angleStart + innerOffset) * arcRadiusB);
            }
            context.fill();

            if (direction === 'right') {
                particlesA[j].angleStart += speed;
                particlesB[j].angleStart += speed;
            } else if (direction === 'left') {
                particlesA[j].angleStart -= speed;
                particlesB[j].angleStart -= speed;
            }
        }

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadiusB - (lineWidth / 2), 0, Math.PI * 2, false);
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.stroke();

        context.restore();
    }

}
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

        retinaDimensions(container);

        spinner = spinnerData;

        spinnerLayers = spinnerData.layers;
        layers = layersFactory(spinnerData);

        initCanvas();
    }

    function retinaDimensions (container) {
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1,
            ratio = devicePixelRatio / backingStoreRatio;

        width = canvas.width = container.offsetWidth * ratio;
        height = canvas.height = container.offsetHeight * ratio;
        canvas.style.width = width / ratio + 'px';
        canvas.style.height = height / ratio + 'px';
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
                pHead : spinners.particleFactory(1, width, height, distance, 0, false, null, null, null),
                pTail : spinners.particleFactory(1, width, height, distance, 0, false, null, null, null)
            };
            layers.push(layer);
            distance = distance - spinner.layersDistance;
        }
        return layers;
    }

    function initCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(initCanvas);
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
function Tailspinner(spinner){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = null,
        position = 0,
        color = null,
        direction = null,
        opacity = null,
        speed = null;

    var shrinkValue = null,
        defaultParticleSize = null,
        backgroundStroke = null,
        backgroundStrokeColor = null,
        backgroundStrokeWidth = null,
        fadeoutValue = null,
        particleNumber = null;

    var particles = [];

    var ratio = null;

    init(spinner);

    function init (spinner) {
        setEnviroment(spinner);
        standardOptions(spinner);
        specificOptions(spinner);
        createParticles();
        clearCanvas();
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
        arcRadius = spinner.options.radius ? spinner.options.radius : 15;
        speed = spinner.options.speed ? spinner.options.speed : 0.1;
        color = spinner.options.color ? spinner.options.color : '#4b4b4b';
        direction = spinner.options.direction ? spinner.options.direction : 'right';
        opacity = spinner.options.opacity ? spinner.options.opacity : 1;
    }

    function specificOptions (spinner) {
        defaultParticleSize = spinner.advancedOptions.particleSize ? spinner.advancedOptions.particleSize : 4;
        shrinkValue = spinner.advancedOptions.shrinkValue ? spinner.advancedOptions.shrinkValue : 0.05;
        fadeoutValue = spinner.advancedOptions.fadeoutValue ? spinner.advancedOptions.fadeoutValue : 0.05;
        particleNumber = spinner.advancedOptions.particles ? spinner.advancedOptions.particles : 40;
        backgroundStroke = spinner.advancedOptions.backgroundStroke ? spinner.advancedOptions.backgroundStroke : false;
        backgroundStrokeColor = spinner.advancedOptions.backgroundStrokeColor? spinner.advancedOptions.backgroundStrokeColor: '#ffffff';
        backgroundStrokeWidth = spinner.advancedOptions.backgroundStrokeWidth? spinner.advancedOptions.backgroundStrokeWidth: 12;
    }

    function createParticles () {
        particles = spinners.particleFactory(particleNumber, width, height, arcRadius, 0, false, null, null, null);
        setParticleOpacity();
        setParticleSize();
        setParticlePosition();
    }

    function setParticleSize () {
        var  particleSize = defaultParticleSize;
        for (var i = 0; i < particles.length; i++) {
            particles[i].size = particleSize;
            particleSize -= shrinkValue;
        }
    }

    function setParticleOpacity () {
        var  particleOpacity =  1;
        for (var i = 0; i < particles.length; i++) {
            particles[i].opacity = particleOpacity;
            particleOpacity -= fadeoutValue;
        }
    }

    function setParticlePosition () {
        var particlePosition = position;
        for (var i = 0; i < particles.length; i++) {
            particles[i].position = particlePosition;
            particlePosition -= shrinkValue;
        }
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        updateAngle();
        requestAnimationFrame(clearCanvas);
    }

    function updateAngle () {
        for (var i = 0; i < particles.length; i++) {
            if (direction === 'right') {
                particles[i].position += speed;
            } else if (direction === 'left') {
                particles[i].position -= speed;
            }
        }
    }

    function render () {
        context.save();

        if (backgroundStroke === true) {
            context.beginPath();
            context.arc(width / 2, height / 2, arcRadius, 0, Math.PI * 2, false);
            context.strokeStyle = backgroundStrokeColor;
            context.lineWidth = backgroundStrokeWidth;
            context.stroke();
        }

        for (var i = 0; i < particles.length; i++) {
            context.beginPath();
            context.arc(particles[i].x = width / 2 + Math.cos(particles[i].position) * arcRadius, particles[i].y = height / 2 + Math.sin(particles[i].position) * arcRadius, particles[i].size, 0, Math.PI * 2, false);
            context.globalAlpha = particles[i].opacity;
            context.fillStyle = color;
            context.fill();
        }
        context.restore();
    }
}
var theWeirdSpoke = (function(){

    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = 30,
        constant = 0.1,
        springLength = 10   ,
        friction = 0.250;

    var speed = 0.08,
        thisAngle = 0;

    var particles = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        createParticles(48);
        clearCanvas();
    }

    function createParticles (amount) {
        var angle =  0;
        for (var i = 0; i < amount; i++) {
            var myParticle = particle.create(width / 2 + Math.cos(angle) * arcRadius, height / 2 + Math.sin(angle) * arcRadius, 0, 0, 0);
            var springPoint = particle.create(width / 2, height / 2 , 0, 0, 0);
            myParticle.friction = friction;
            myParticle.angleStart = angle;
            myParticle.addSpring(springPoint, constant, springLength);
            angle += Math.PI / (amount / 2);
            myParticle.angleStop = angle;
            particles.push(myParticle);
        }
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();
        for (var i = 0; i < particles.length; i++){
            context.beginPath();
            context.arc(particles[i].x, particles[i].y, 1, 0, Math.PI * 2, false);
            context.lineTo(particles[i].x, particles[i].y);
            if (thisAngle > particles[i].angleStart && thisAngle < particles[i].angleStop) {
                if (!isNaN(particles[i].x)) {
                    context.moveTo(particles[i].x = width / 2 + Math.cos(particles[i].angleStop),particles[i].y =  height / 2 + Math.sin(particles[i].angleStop));
                }
                context.fillStyle = '#ff0000';
            } else {
                context.fillStyle = '#666666';
            }
            context.fill();
            particles[i].update();
        }

        thisAngle += speed;
        if (thisAngle > Math.PI * 2) {
            thisAngle = 0;
        }

        context.restore();
    }


    return {
        init : init
    }
})();
var theWorm = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = null,
        angleA = null,
        angleB = null,
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

        retinaDimensions(container);
        config(spinner);

        particles = spinners.particleFactory(2, width, height, arcRadius, 0, false, null, null, null);

        clearCanvas();
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

    function config (spinner) {
        arcRadius = spinner.arcRadius ? spinner.arcRadius : 20;
        angleA = spinner.angleA ? spinner.angleA : 0;
        angleB = spinner.angleB ? spinner.angleB : 1;
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
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadius, angleA, angleB, false);
        context.lineWidth = bodyStrokeWidth;
        context.strokeStyle = bodyColor;
        context.stroke();

        for (var i = 0; i < particles.length; i++) {

            // TAIL
            context.beginPath();
            context.arc(particles[0].x = width / 2 + Math.cos(angleA) * arcRadius, particles[i].y = height / 2 + Math.sin(angleA) * arcRadius, tailSize, 0, Math.PI * 2, false);
            context.fillStyle = tailColor;
            context.fill();

            // HEAD
            context.beginPath();
            context.arc(particles[1].x = width / 2 + Math.cos(angleB) * arcRadius, particles[1].y = height / 2 + Math.sin(angleB) * arcRadius, headSize, 0, Math.PI * 2, false);
            context.fillStyle = headColor;
            context.fill();
        }

        var dist = angleB - angleA;
        if (run === 'tail') {
            angleA += speedA;
            angleB += speedB;
            if (dist <  distMin) {
                run = 'head';
            }
        } else if (run === 'head') {
            angleA += speedB;
            angleB += speedA;
            if (dist > distMax) {
                run = 'tail';
            }
        }

        context.restore();
    }
    return {
        init : init
    }
})();
var particle = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	mass: 1,
	radius: 0,
	bounce: -1,
	friction: 1,
	gravity: 0,
	springs: null,
	gravitation: null,

	create: function(x, y, speed, direction, grav) {
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		obj.vx = Math.cos(direction) * speed;
		obj.vy = Math.sin(direction) * speed;
		obj.gravity = grav || 0;
		obj.springs = [];
		obj.gravitation = [];
		return obj;
	},

	addGravitation: function(p) {
		this.removeGravitation(p);
		this.gravitation.push(p);
	},

	removeGravitation: function(p) {
		for(var i = 0; i < this.gravitation.length; i += 1) {
			if(p === this.gravitation[i]) {
				this.gravitation.splice(i, 1);
				return;
			}
		}
	},

	addSpring: function(point, k, length) {
		this.removeSpring(point);
		this.springs.push({
			point: point,
			k: k,
			length: length || 0
		});
	},

	removeSpring: function(point) {
		for(var i = 0; i < this.springs.length; i += 1) {
			if(point === this.springs[i].point) {
				this.springs.splice(i, 1);
				return;
			}
		}
	},

	getSpeed: function() {
		return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
	},

	setSpeed: function(speed) {
		var heading = this.getHeading();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	},

	getHeading: function() {
		return Math.atan2(this.vy, this.vx);
	},

	setHeading: function(heading) {
		var speed = this.getSpeed();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	},

	accelerate: function(ax, ay) {
		this.vx += ax;
		this.vy += ay;
	},

	update: function() {
		this.handleSprings();
		this.handlegravitation();
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	},

	handlegravitation: function() {
		for(var i = 0; i < this.gravitation.length; i += 1) {
			this.gravitateTo(this.gravitation[i]);
		}
	},

	handleSprings: function() {
		for(var i = 0; i < this.springs.length; i += 1) {
			var spring = this.springs[i];
			this.springTo(spring.point, spring.k, spring.length);
		}
	}, 

	angleTo: function(p2) {
		return Math.atan2(p2.y - this.y, p2.x - this.x);
	},

	distanceTo: function(p2) {
		var dx = p2.x - this.x,
			dy = p2.y - this.y;

		return Math.sqrt(dx * dx + dy * dy);
	},

	gravitateTo: function(p2) {
		var dx = p2.x - this.x,
			dy = p2.y - this.y,
			distSQ = dx * dx + dy * dy,
			dist = Math.sqrt(distSQ),
			force = p2.mass / distSQ,
			ax = dx / dist * force,
			ay = dy / dist * force;

		this.vx += ax;
		this.vy += ay;
	},

	springTo: function(point, k, length) {
		var dx = point.x - this.x,
			dy = point.y - this.y,
			distance = Math.sqrt(dx * dx + dy * dy),
			springForce = (distance - length || 0) * k; 
		this.vx += dx / distance * springForce,
		this.vy += dy / distance * springForce;
	}
};
var utils = {
	norm: function(value, min, max) {
		return (value - min) / (max - min);
	},

	lerp: function(norm, min, max) {
		return (max - min) * norm + min;
	},

	map: function(value, sourceMin, sourceMax, destMin, destMax) {
		return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
	},

	clamp: function(value, min, max) {
		return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
	},

	distance: function(p0, p1) {
		var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	distanceXY: function(x0, y0, x1, y1) {
		var dx = x1 - x0,
			dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	},

	circleCollision: function(c0, c1) {
		return utils.distance(c0, c1) <= c0.radius + c1.radius;
	},

	circlePointCollision: function(x, y, circle) {
		return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
	},

	pointInRect: function(x, y, rect) {
		return utils.inRange(x, rect.x, rect.x + rect.width) &&
		       utils.inRange(y, rect.y, rect.y + rect.height);
	},

	inRange: function(value, min, max) {
		return value >= Math.min(min, max) && value <= Math.max(min, max);
	},

	rangeIntersect: function(min0, max0, min1, max1) {
		return Math.max(min0, max0) >= Math.min(min1, max1) && 
			   Math.min(min0, max0) <= Math.max(min1, max1);
	},

	rectIntersect: function(r0, r1) {
		return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
			   utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
	},

	degreesToRads: function(degrees) {
		return degrees / 180 * Math.PI;
	},

	radsToDegrees: function(radians) {
		return radians * 180 / Math.PI;
	},

	randomRange: function(min, max) {
		return min + Math.random() * (max - min);
	},

	randomInt: function(min, max) {
		return Math.floor(min + Math.random() * (max - min + 1));
	},

	roundToPlaces: function(value, places) {
		var mult = Math.pow(10, places);
		return Math.round(value * mult) / mult;
	},

	roundNearest: function(value, nearest) {
		return Math.round(value / nearest) * nearest;
	},

	quadraticBezier: function(p0, p1, p2, t, pFinal) {
		pFinal = pFinal || {};
		pFinal.x = Math.pow(1 - t, 2) * p0.x + 
				   (1 - t) * 2 * t * p1.x + 
				   t * t * p2.x;
		pFinal.y = Math.pow(1 - t, 2) * p0.y + 
				   (1 - t) * 2 * t * p1.y + 
				   t * t * p2.y;
		return pFinal;
	},

	cubicBezier: function(p0, p1, p2, p3, t, pFinal) {
		pFinal = pFinal || {};
		pFinal.x = Math.pow(1 - t, 3) * p0.x + 
				   Math.pow(1 - t, 2) * 3 * t * p1.x + 
				   (1 - t) * 3 * t * t * p2.x + 
				   t * t * t * p3.x;
		pFinal.y = Math.pow(1 - t, 3) * p0.y + 
				   Math.pow(1 - t, 2) * 3 * t * p1.y + 
				   (1 - t) * 3 * t * t * p2.y + 
				   t * t * t * p3.y;
		return pFinal;
	},

	multicurve: function(points, context) {
		var p0, p1, midx, midy;

		context.moveTo(points[0].x, points[0].y);

		for(var i = 1; i < points.length - 2; i += 1) {
			p0 = points[i];
			p1 = points[i + 1];
			midx = (p0.x + p1.x) / 2;
			midy = (p0.y + p1.y) / 2;
			context.quadraticCurveTo(p0.x, p0.y, midx, midy);
		}
		p0 = points[points.length - 2];
		p1 = points[points.length - 1];
		context.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
	}

};
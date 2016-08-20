var spinners = (function(){

    function init(spinner) {
        switch (spinner.type) {
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
var theGear = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadiusA = 30,
        arcRadiusB = arcRadiusA - (arcRadiusA / 5),
        number = 16,
        speed = 0.03,
        speedA = 0.04,
        size = 'shrink',
        lineWidth = arcRadiusB / 2,
        innerOffset = 0.06,
        outerOffset = 0.08;

    var particlesA = [];
    var particlesB = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        particlesA = spinners.particleFactory(number, width, height, arcRadiusA,  Math.PI / number, false, null, null, null);
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
            // // context.moveTo(particlesA[i].x = width / 2 + Math.cos(particlesA[i].angleStart) * arcRadiusA, particlesA[i].y = height / 2 + Math.sin(particlesA[i].angleStart) * arcRadiusA);
            // // context.lineTo(particlesB[i].x = width / 2 + Math.cos(particlesB[i].angleStart) * arcRadiusB, particlesB[i].y = height / 2 + Math.sin(particlesB[i].angleStart) * arcRadiusB);
            // // context.arc(particlesA[i].x = width / 2 + Math.cos(particlesA[i].angleStart) * arcRadiusA, particlesA[i].y = height / 2 + Math.sin(particlesA[i].angleStart) * arcRadiusA, 3, 0, Math.PI *2 , false);
            // context.arc(particlesB[i].x = width / 2 + Math.cos(particlesB[i].angleStart) * arcRadiusB, particlesB[i].y = height / 2 + Math.sin(particlesB[i].angleStart) * arcRadiusB, 1, 0, Math.PI *2, false);
            // // if (i < number -1) {
            // //     // context.lineTo(particlesA[i + 1].x , particlesA[i + 1].y);
            // // } else {
            // //     // context.moveTo(particlesB[number-1].x , particlesB[number-1].y);
            // //     // context.lineTo(particlesA[0].x, particlesA[0].y);
            // // }
            // context.strokeStyle = 'green';
            // context.stroke();


            // context.moveTo(particlesA[i].x = width / 2 + Math.cos(particlesA[i].angleStart) * arcRadiusA, particlesA[i].y = height / 2 + Math.sin(particlesA[i].angleStart) * arcRadiusA);


            // context.beginPath();
            // if (i % 2 !== 0) {
            //     context.moveTo(particlesB[i].x = width / 2 + Math.cos(particlesB[i].angleStart) * arcRadiusB, particlesB[i].y = height / 2 + Math.sin(particlesB[i].angleStart) * arcRadiusB);
            //     context.lineTo(particlesB[i -1].x = width / 2 + Math.cos(particlesB[i -1].angleStart) * arcRadiusB, particlesB[i -1].y = height / 2 + Math.sin(particlesB[i -1].angleStart) * arcRadiusB);
            //
            // }
            // context.stroke();






            // particlesA[i].angleStart += speed;
            // particlesB[i].angleStart += speed;
            //
            // if (size === 'shrink') {
            //     arcRadiusB -= speedA;
            //     if (arcRadiusB <= arcRadiusA - 12 ) {
            //         size = 'grow';
            //     }
            // } else if (size === 'grow') {
            //     arcRadiusB += speedA;
            //     //speedA -= 0.01 ;
            //     if (arcRadiusB >= arcRadiusA) {
            //         size = 'shrink';
            //     }
            // }
        }


        for (var j = 0; j < number; j++) {
            context.beginPath();
            // context.arc(particlesA[j].x = width / 2 + Math.cos(particlesA[j].angleStart) * arcRadiusA, particlesA[j].y = height / 2 + Math.sin(particlesA[j].angleStart) * arcRadiusA, 2, 0, Math.PI *2 , false);
            context.strokeStyle = 'red';
            context.fillStyle = 'red';
            if (j % 2 !== 0) {
                context.moveTo(particlesB[j].x = width / 2 + Math.cos(particlesB[j].angleStart + innerOffset) * arcRadiusB, particlesB[j].y = height / 2 + Math.sin(particlesB[j].angleStart + innerOffset) * arcRadiusB);
                context.lineTo(particlesB[j -1].x = width / 2 + Math.cos(particlesB[j -1].angleStart - innerOffset) * arcRadiusB, particlesB[j -1].y = height / 2 + Math.sin(particlesB[j -1].angleStart - innerOffset) * arcRadiusB);
                context.lineTo(particlesA[j -1].x = width / 2 + Math.cos(particlesA[j -1].angleStart + outerOffset) * arcRadiusA, particlesA[j -1].y = height / 2 + Math.sin(particlesA[j -1].angleStart + outerOffset) * arcRadiusA);
                context.lineTo(particlesA[j].x = width / 2 + Math.cos(particlesA[j].angleStart - outerOffset) * arcRadiusA, particlesA[j].y = height / 2 + Math.sin(particlesA[j].angleStart - outerOffset) * arcRadiusA);
                context.lineTo(particlesB[j].x = width / 2 + Math.cos(particlesB[j].angleStart + innerOffset) * arcRadiusB, particlesB[j].y = height / 2 + Math.sin(particlesB[j].angleStart + innerOffset) * arcRadiusB);
            }

            context.fill();
            context.stroke();
        }

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadiusB - (lineWidth / 2), 0, Math.PI * 2, false);
        context.lineWidth = lineWidth;
        context.stroke();




        // context.beginPath();
        // context.arc(width / 2, height / 2, arcRadiusA, 0, Math.PI * 2, false);
        // context.strokeStyle = '#4b4b4b';
        // context.stroke();

        context.restore();
    }

    return {
        init : init
    }
})();
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
                pHead : spinners.particleFactory(1, width, height, distance, 0, false, null, null, null),
                pTail : spinners.particleFactory(1, width, height, distance, 0, false, null, null, null)
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
var theTail = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = 20,
        defaultParticleSize = 2,
        position = 0,
        speed = 0.1,
        shrinkValue = 0.05,
        particleNumber = 40;

    var particles = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        particles = spinners.particleFactory(particleNumber, width, height, arcRadius, 0, false, null, null, null);
        setParticleSize();
        setParticlePosition();
        clearCanvas();
    }

    function setParticleSize () {
        var  particleSize = defaultParticleSize;
        for (var i = 0; i < particles.length; i++) {
            particles[i].size = particleSize;
            particleSize -= shrinkValue;
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
            particles[i].position += speed;
        }
    }

    function render () {
        context.save();
        context.beginPath();
        context.arc(width / 2, height / 2, arcRadius, 0, Math.PI * 2, false);
        context.strokeStyle = 'white';
        context.lineWidth = 6;
        context.stroke();
        for (var i = 0; i < particles.length; i++) {
            context.beginPath();
            context.arc(particles[i].x = width / 2 + Math.cos(particles[i].position) * arcRadius, particles[i].y = height / 2 + Math.sin(particles[i].position) * arcRadius, particles[i].size, 0, Math.PI * 2, false);
            context.fillStyle = '#4b4b4b';
            context.fill();
        }
        context.restore();
    }

    return {
        init : init
    }
})();
var theWatch = (function(){
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
        opacity = null;

    var particles = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        arcRadius = spinner.arcRadius ? spinner.arcRadius : 15;
        speedMinutes = spinner.speed ? spinner.speed : 0.1;
        speedHour = speedMinutes / 12;
        startAngleMinutes = spinner.startAngleMinutes ? spinner.startAngleMinutes : 0;
        startAngleHours = spinner.startAngleHours ? spinner.startAngleHours : 0;
        armWidthMinute = spinner.armWidthMinute ? spinner.armWidthMinute : 1;
        armWidthHour = spinner.armWidthHour ? spinner.armWidthHour : 2;
        clockLineWidth = spinner.clockLineWidth ? spinner.clockLineWidth : 1;
        armColorMinute = spinner.armColorMinute ? spinner.armColorMinute : '#4b4b4b';
        armColorHour = spinner.armColorHour ? spinner.armColorHour : '#4b4b4b';
        clockColorLine = spinner.clockColorLine ? spinner.clockColorLine : '#4b4b4b';
        clockColorFill = spinner.clockColorFill ? spinner.clockColorFill : '#ffffff';
        indicatorColorFill = spinner.indicatorColorFill ? spinner.indicatorColorFill : '#4b4b4b';
        opacity = spinner.opacity ? spinner.opacity : 1;

        if (spinner.hoursIndicator) {
            particles = spinners.particleFactory(12, width, height, arcRadius / 1.2, 0, false, null, null, null);
        }
        clearCanvas();
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

        startAngleMinutes += speedMinutes;
        startAngleHours += speedHour;

        context.restore();
    }

    return {
        init : init
    }
})();
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

        particles = spinners.particleFactory(2, width, height, arcRadius, 0, false, null, null, null);

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
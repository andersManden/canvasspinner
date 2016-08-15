var canvasSpinners = (function(){

    function initSpinner(spinner) {
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
            case 'spokeSpinner':
                spokeSpinner(spinner);
                break;
            case 'theWatch':
                theWatch.init(spinner);
                break;
            case 'catchUpSpinnerII' :
                catchUpSpinnerII(spinner);
                break;
        }
    }

    function spokeSpinner (containerId, canvasId) {
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

        init(containerId, canvasId);

        function init (containerId, canvasId) {
            alert('work in progress');
            var container = document.getElementById(containerId);
            canvas = document.getElementById(canvasId);
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
    }

    function catchUpSpinnerII (spinner){
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

        init(spinner);

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

            particles = canvasSpinners.particleFactory(5, width, height, arcRadius, 0, false, null, null, null);

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
        initSpinner : initSpinner,
        particleFactory : particleFactory
    }

})();

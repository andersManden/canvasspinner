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
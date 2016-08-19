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
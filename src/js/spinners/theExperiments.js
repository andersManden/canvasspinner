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
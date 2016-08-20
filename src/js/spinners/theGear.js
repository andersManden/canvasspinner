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
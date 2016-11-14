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

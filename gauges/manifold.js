
/*
   Manifold Pressure gauge
 */


const manifoldCalcTable = [
    { manifold: 10, angle: -160 },
    { manifold: 15, angle: -120  },
    { manifold: 20, angle:  -80  },
    { manifold: 25, angle:  -40  },
    { manifold: 30, angle:    0  },
    { manifold: 35, angle:   40  },
    { manifold: 40, angle:   80  },
    { manifold: 45, angle:  120  },
    { manifold: 50, angle:  160  },
];

function manifoldToAngle(manifold) {
    for (let i = 0; i < manifoldCalcTable.length - 1; i++) {
        const a = manifoldCalcTable[i];
        const b = manifoldCalcTable[i + 1];

        if (manifold >= a.manifold && manifold <= b.manifold) {
            const t = (manifold - a.manifold) / (b.manifold - a.manifold);
            return a.angle + t * (b.angle - a.angle);
        }
    }

    if (manifold < manifoldCalcTable[0].manifold) return manifoldCalcTable[0].angle;
    return manifoldCalcTable[manifoldCalcTable.length - 1].angle;
}

let currentManifoldAngle = 0;

function smoothManifold(targetAngle) {
    currentManifoldAngle += (targetAngle - currentManifoldAngle) * 0.15;
    return currentManifoldAngle;
}

async function updateManifoldGauge() {

//        gsdManifold = 25 ; //testing only
    // Goto these values every %40 seconds and stay there 7 seconds
//    gsdManifold = ([15,10,20,26,50,30,35,40,45,null])[(
//	Math.floor(((Date.now()/1000)%40)/7))]
//	?? gsdManifold;  
    
    const angle = manifoldToAngle(gsdManifold);
    const smoothAngle = smoothManifold(angle);

    document.getElementById("manifoldNeedle").style.transform =
        `translate(-50%, -90%) rotate(${smoothAngle}deg)`;
}

const canvas = document.getElementById('canvas')



const ctx = canvas.getContext('2d');



canvas.width = 450;
canvas.height = 500;


const lineWidth = 4;
const size = 40;


const cables = ['yellow', 'red', 'blue', 'green'];
const cableSize = 28;
const cableWidth = 60;
const padding = 120;
const distance = (canvas.height - padding) / cables.length;

const leftCables = sortCables();
const rightCables = sortCables();
leftCablesCoordinates();
rightCablesCoordinates()

const mousePos = {
    x: 0,
    y: 0,
    isClicked: false,
}

const taskState = {
    selectedCable: null,
    linkedCables: [],
}

canvas.addEventListener('mousedown', (e) => {
    mousePos.x = e.layerX;
    mousePos.y = e.layerY;
    mousePos.isClicked = true;

    checkColorSelected();


});

canvas.addEventListener('mousemove', (e) => {
    if (mousePos.isClicked) {
        mousePos.x = e.layerX;
        mousePos.y = e.layerY;
    }

})

canvas.addEventListener('mouseup', (e) => {
    checkCableDropped();
    mousePos.isClicked = false;
    taskState.selectedColor = null;

})


function main() {
    clearCanvas();
    drawBackground();
    drawLeftHandle();
    drawRightHandle();
    drawCables();
    drawCableLigature();
    drawLinkedCables();


    requestAnimationFrame(main);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, canvas.height / 2, canvas.width, canvas.height / 2);
    
    gradient.addColorStop(0, '#333');
    gradient.addColorStop(0.5, '#666');
    gradient.addColorStop(0, '#333');


    ctx.strokStyle = '#000';
    ctx.lineWidth = lineWidth;

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeRect(lineWidth / 2, lineWidth / 2, canvas.width - lineWidth, canvas.height - lineWidth);
}

function drawLeftHandle() {
    ctx.fillStyle = '#555';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = lineWidth;

    ctx.strokeRect(lineWidth / 2, lineWidth / 2, size, canvas.height - lineWidth);
    ctx.strokeRect(lineWidth / 2, lineWidth / 2, size, canvas.height - lineWidth);

}

function drawRightHandle() {
    ctx.fillStyle = '#555';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = lineWidth;

    ctx.fillRect(canvas.width - size - (lineWidth / 2), lineWidth / 2, size, canvas.height);
    ctx.strokeRect(canvas.width - size - (lineWidth / 2), lineWidth / 2, size, canvas.height - lineWidth);

}

function sortCables() {
    let localCables = cables.slice();
    return cables.map(cable => {
        const selectedCable = localCables[Math.floor(Math.random() * localCables.length)];
        localCables = localCables.filter(lCable => lCable !== selectedCable);

        return {
            color: selectedCable
        }

    })
}

function leftCablesCoordinates() {
    leftCables.forEach((cable, index) => {
        cable.x = lineWidth / 2;
        cable.y = distance * (index + 1);
        cable.w = cableWidth - (lineWidth / 2);
        cable.h = cableSize - (lineWidth / 2);

    });
}

function rightCablesCoordinates() {
    rightCables.forEach((cable, index) => {
        cable.x = canvas.width - cableWidth;
        cable.y = distance * (index + 1);
        cable.w = cableWidth - (lineWidth / 2);
        cable.h = cableSize - (lineWidth / 2);

    });
}

function drawCables() {
    leftCables.forEach(cable => {
        ctx.fillStyle = cable.color;
        ctx.strokeStyle = "#000";
        ctx.fillRect(cable.x, cable.y, cable.w, cable.h);
        ctx.strokeRect(cable.x, cable.y, cable.w, cable.h);
    });


    rightCables.forEach(cable => {
        ctx.fillStyle = cable.color;
        ctx.strokeStyle = "#000";
        ctx.fillRect(cable.x, cable.y, cable.w, cable.h)
        ctx.strokeRect(cable.x, cable.y, cable.w, cable.h)
    });
}

function checkColorSelected() {
    leftCables.forEach(cable => {
        if (taskState.linkedCables.find(lCable => lCable.color === cable.color)) {
            return;
        }
        if (
            cable.x < mousePos.x &&
            cable.x + cable.w > mousePos.x &&
            cable.y < mousePos.y &&
            cable.y + cable.h > mousePos.y
        ) {
            taskState.selectedCable = cable;

        }

    });
}
let cont = 0

const btnReset = document.querySelector('#inicio button')
function resetBtn(){
    
        btnReset.style.display = 'block'
    
}



function checkCableDropped() {
    
    
    cont += 1

    if(cont > 3){
        resetBtn()
    }
    
    rightCables.forEach(cable => {
        if (
            cable.x < mousePos.x &&
            cable.x + cable.w > mousePos.x &&
            cable.y < mousePos.y &&
            cable.y + cable.h > mousePos.y
        ) {
            if (cable.color === taskState.selectedCable?.color) {
                
                taskState.linkedCables.push(cable);
                
                

            }

        }

    });
}

function drawCableLigature() {
    if (mousePos.isClicked && taskState.selectedCable) {
        const selectedCable = taskState.selectedCable;
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.moveTo(selectedCable.x + selectedCable.w + lineWidth / 2, selectedCable.y);
        ctx.lineTo(mousePos.x, mousePos.y - cableSize / 2);
        ctx.lineTo(mousePos.x, mousePos.y + cableSize / 2);
        ctx.lineTo(selectedCable.x + selectedCable.w + lineWidth / 2, selectedCable.y + selectedCable.h);
        ctx.fillStyle = selectedCable.color;
        ctx.fill();
        ctx.stroke();

    }
}

function drawLinkedCables() {
    taskState.linkedCables.forEach(endCable => {
        const beginCable = leftCables.find(cable => cable.color === endCable.color);
        if (beginCable) {
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.moveTo(beginCable.x + beginCable.w + lineWidth / 2, beginCable.y);
            ctx.lineTo(endCable.x, endCable.y);
            ctx.lineTo(endCable.x, endCable.y + cableSize - lineWidth / 2);
            ctx.lineTo(beginCable.x + beginCable.w + lineWidth / 2, beginCable.y + beginCable.h);
            ctx.fillStyle = beginCable.color;
            ctx.fill();
            ctx.stroke();
        }
    })
}

main();

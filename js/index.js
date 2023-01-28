// ----------------------------- Initial Setup -----------------------------

let columns, rows;
let state, direction;

let container = document.getElementById('container');
const define = async () => {
    columns = Math.floor(container.clientWidth / (nodeWidth + 1));
    columns -= (columns%2 === 0);

    rows = Math.floor(container.clientHeight / (nodeHeight + 1));
    rows -= (rows%2 === 0);

    state = [];
    direction = [];
    container.innerHTML = '';

    for(let i=0; i<rows; i++){
        let row = document.createElement('div');
        let rowState = [], rowDirection = [];
        row.className = 'row';
        for(let j=0; j<columns; j++){
            rowState.push(emptyNode);
            rowDirection.push(0);
            let node = document.createElement('div');
            node.className = 'node';
            node.id = `${i},${j}`;
            node.draggable = false;
            row.appendChild(node);
        }
        state.push(rowState);
        direction.push(rowDirection);
        container.appendChild(row);
    }
    endPoints[0] = [Math.floor(rows/2), Math.floor(columns/4)];
    endPoints[1] = [Math.floor(rows/2), Math.floor(columns*3/4)];
    state[endPoints[0][0]][endPoints[0][1]] = startNode;
    state[endPoints[1][0]][endPoints[1][1]] = endNode;
    await animateWhole();
}

const init = async() => {
    await define();
    addListeners();
}

init();

// -------------------------- Solving Maze -------------------------------

const solveMaze = async () => {
    clearMaze(1);
    solving = true;
    let algo = document.getElementById('mazeSolvingAlgorithm');
    switch(algo.value) {
        case 'bfs':
            await bfs();
            break;

        case 'dfs':
            await dfs();
            break;

        case 'astar':
            await Astar();
            break;

        case 'uniformCost':
            await uniformCostSearch();
            break;
            
        case 'bestFirst':
            await greedyBestFirstSearch();
            break;                
    }
    solving = false;
}

// ------------------------- Event Listeners -----------------------------

window.addEventListener('resize', () =>{
    if(actions() === false){
        define();
    } 
});

document.getElementById('start').addEventListener('click', () => {
    if(actions() === false){
        solveMaze();
    }
})

document.getElementById('createMaze').addEventListener('click', () => {
    if(actions() === false) {
      generateMaze();
    }
});
  
document.getElementById('clearMaze').addEventListener('click', () => {
    if(actions() == false) {
      clearMaze();
    }
});

const addListeners = () => {
    let nodes = document.getElementsByClassName('node');
    for(let i=0; i<nodes.length; i++){
        nodes[i].addEventListener('mousedown', async (event) => {
            event.preventDefault();
            if(event.button === 0 && actions() === false) {
                try {
                    let id = nodes[i].id.split(',');
                    id = [parseInt(id[0]), parseInt(id[1])];
                    if(state[id[0]][id[1]] >= 0){
                        state[id[0]][id[1]] = (state[id[0]][id[1]] == 1 ? 0 : 1);
                        await animate(id[0], id[1]);
                    }
                    else{
                        if(endPoints[1][0] === id[0] && endPoints[1][1] === id[1]) {
                            moving = 1;
                        }
                        else {
                            moving = 0;
                        }
                    }
                    mousedown = true;
                }
                catch(err) {}
            }
        })
        nodes[i].addEventListener('mouseover', async (event) => {
            event.preventDefault();
            if(mousedown) { 
                let id = nodes[i].id.split(',');
                id = [parseInt(id[0]), parseInt(id[1])];
                if(actions() === false) {
                    try {
                        if(state[id[0]][id[1]] >= 0) {
                        state[id[0]][id[1]] = (state[id[0]][id[1]]==1?0:1);
                        animate(id[0], id[1]);
                        }
                    }
                    catch(err) {}
                }
                if(moving>=0 && state[id[0]][id[1]] !== 1 && state[id[0]][id[1]]>=0) {
                    state[endPoints[moving][0]][endPoints[moving][1]] = 0;
                    state[id[0]][id[1]] = (moving === 1? endNode : startNode);
                    let temp = endPoints[moving];
                    endPoints[moving] = id;
                    await animate(temp[0], temp[1]);
                    await animate(id[0], id[1]);
                }
            }
        });
    }
}

container.addEventListener('mouseup', (event) => {
    event.preventDefault();
    if(event.button === 0) {
        if(actions() === false){
            mousedown = false;
        }
        if(moving >= 0){
            moving = -1;
            mousedown = false;
        }
    }
});


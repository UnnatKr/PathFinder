const dfs = async () => {
    let queue = [endPoints[0]];
    let parent = [];
    while(queue.length > 0) {
        let [x, y] = queue[queue.length - 1];
        queue.pop();
        if(x === endPoints[1][0] && y === endPoints[1][1]) {
            await traceFinal(parent);
            return;
        }
        state[x][y] = visited;
        await animate(x, y);
        for(let i=0; i<dx.length; i++) {
            let nx = x + dx[i], ny = y + dy[i];
            if(checkIn(nx, ny) && (state[nx][ny] < wall || state[nx][ny] === inQueue)) {
                if(state[nx][ny] === inQueue) {
                    for(let i=0; i<queue.length; i++){
                        if(queue[i][0] === nx && queue[i][1] === ny) {
                            queue.splice(i,1);
                            break;
                        }
                    }
                }
                parent[`${nx},${ny}`] = [x,y,i];
                state[nx][ny] = inQueue;
                queue.push([nx, ny]);
                await animate(nx, ny);
            }
        }
    }
}
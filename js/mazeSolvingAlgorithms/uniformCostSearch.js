const uniformCostSearch = async () => {
    let queue = [[0, endPoints[0][0], endPoints[0][1]]];
    let parent = [];
    while(queue.length > 0) {
        let j = 0;
        for(let i=1; i<queue.length; i++) {
            if(queue[i][0] < queue[j][0]) {
                j = i;
            }
        }
        let [g, x, y] = queue[j];
        queue.splice(j, 1);
        if(x === endPoints[1][0] && y === endPoints[1][1]) {
            await traceFinal(parent);
            return;
        }
        state[x][y] = visited;
        await animate(x, y);

        for(let i=0; i<dx.length; i++) {
            let nx =x + dx[i], ny = y + dy[i];
            if(checkIn(nx, ny) && (state[nx][ny] < wall || state[nx][ny] === inQueue)) {
                if(state[nx][ny] == inQueue) {
                    for(let i=0; i<queue.length; i++) {
                        if(queue[i][1] === nx && queue[i][2] === ny) {
                            if(queue[i][0] > g + 1) {
                                queue[i] = [g + 1, nx, ny];
                                parent[`${nx},${ny}`] = [x, y];
                            }
                        }
                    }
                }
                else {
                    parent[`${nx},${ny}`] = [x, y, i];
                    queue.push([g + 1, nx, ny]);
                    state[nx][ny] = inQueue;
                    await animate(nx, ny);
                }
            }
        }
    }
}
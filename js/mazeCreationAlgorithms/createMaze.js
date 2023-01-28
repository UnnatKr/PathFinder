// ------------------------ Maze Creation Algorithms -----------------------
const createMaze = async () => {
    for(let st=[[1,1,1,1]]; st.length>0; ) {
        let top = st[st.length -1];
        st.pop();
        if(getRandom(20)<10) {
            st.unshift(top);
        }
        else if(state[top[2]][top[3]] === 1) {
            state[top[0]][top[1]] = 0;
            await animate(top[0], top[1]);
            if(state[top[2]][top[3]] === 1) {
                state[top[2]][top[3]] = 0;
                await animate(top[2], top[3]);
            }
            let [x, y] = [top[2], top[3]];
            for(let i=getRandom(4), j=0; j<4; j++) {
                let k = (i+j)%4;
                if(checkIn(x+2*dx[k], y+2*dy[k]) && state[x+2*dx[k]][y+2*dy[k]] === 1) {
                    st.push([x+dx[k], y+dy[k], x+2*dx[k], y+2*dy[k]]);
                }
            }
        }
    }
}

const generateMaze = async () => {
    generating =true;
    for(let i=0; i<rows; i++) {
        for(let j=0; j<columns; j++){
            state[i][j] = 1;
            animate(i,j);
        }
    }
    await createMaze();
    generating = false;
}

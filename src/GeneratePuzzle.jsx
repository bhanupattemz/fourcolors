const GeneratePuzzle = (n) => {
    let structures = [];
    const visited = Array.from({ length: n }, () => Array(n).fill(false));
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    const isValid = (x, y) => x >= 0 && x < n && y >= 0 && y < n && !visited[x][y];

    const getStructure = (x, y, count, path = []) => {
        if (count <= 0) return path;

        const neighbors = directions
            .map(([dx, dy]) => [x + dx, y + dy])
            .filter(([nx, ny]) => isValid(nx, ny));

        if (neighbors.length === 0) return path;

        const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
        visited[nx][ny] = true;
        path.push([nx, ny]);

        return getStructure(nx, ny, count - 1, path);
    };

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!visited[i][j]) {
                visited[i][j] = true;
                const size = Math.floor(Math.random() * 3 + 1); 
                const newStruct = [[i, j], ...getStructure(i, j, size)];
                structures.push({ cells: newStruct, backgroundColor: "white" });
            }
        }
    }

    const CheckColors = (struct, n) => {
        const sameStruct = (x, y) => {
            for (let group of struct) {
                const inGroup = group.cells.some(([r, c]) => r === x[0] && c === x[1]);
                const alsoInGroup = group.cells.some(([r, c]) => r === y[0] && c === y[1]);
                if (inGroup && alsoInGroup) return true;
            }
            return false;
        };

        for (let i = 0; i < struct.length; i++) {
            if (struct[i].backgroundColor === "white") continue;

            for (let [x, y] of struct[i].cells) {
                for (let [dx, dy] of directions) {
                    const nx = x + dx, ny = y + dy;

                    if (nx >= 0 && nx < n && ny >= 0 && ny < n) {
                        for (let j = 0; j < struct.length; j++) {
                            if (i !== j && struct[j].backgroundColor === struct[i].backgroundColor) {
                                for (let [xr, yr] of struct[j].cells) {
                                    if (xr === nx && yr === ny && !sameStruct([x, y], [xr, yr])) {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return true;
    };

    let maincolors = ["blue", "red", "lightgreen", "yellow"];

    const setColor = (num) => {
        if (num === structures.length) return true;

        for (let color of maincolors) {
            structures[num].backgroundColor = color;
            if (CheckColors(structures, n)) {
                if (setColor(num + 1)) {
                    return true;
                }
            }
            structures[num].backgroundColor = "white";
        }

        return false;
    };

    setColor(0);
    return structures

}




export {GeneratePuzzle}
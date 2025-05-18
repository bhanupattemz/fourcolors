const CheckSolution = (grid, struct, n) => {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!grid || !Array.isArray(grid) || grid.length !== n || !grid[i] || !grid[i][j] || grid[i][j].style.backgroundColor === "white") {
                return false
            }
        }
    }
    const sameStruct = (x, y) => {
        for (let group of struct) {
            const inGroup = group.cells.some(([r, c]) => r === x[0] && c === x[1])
            const alsoInGroup = group.cells.some(([r, c]) => r === y[0] && c === y[1])
            if (inGroup && alsoInGroup) return true
        }
        return false
    }

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let [dx, dy] of directions) {
                const ni = i + dx, nj = j + dy
                if (ni >= 0 && ni < n && nj >= 0 && nj < n) {
                    const color1 = grid[i][j].style.backgroundColor
                    const color2 = grid[ni][nj].style.backgroundColor
                    if (color1 === color2 && !sameStruct([i, j], [ni, nj])) {
                        return false
                    }
                }
            }
        }
    }

    return true
}


function countValidColorings(structures, n) {
    const mainColors = ["red", "blue", "yellow", "lightgreen"];
    const structCount = structures.length;

    const sameStruct = (x, y) => {
        for (let group of structures) {
            const inGroup = group.cells.some(([r, c]) => r === x[0] && c === x[1]);
            const alsoInGroup = group.cells.some(([r, c]) => r === y[0] && c === y[1]);
            if (inGroup && alsoInGroup) return true;
        }
        return false;
    };

    const areColorsValid = () => {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];
        for (let i = 0; i < structCount; i++) {
            const group1 = structures[i];
            for (let [x, y] of group1.cells) {
                for (let [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < n && ny >= 0 && ny < n) {
                        for (let j = 0; j < structCount; j++) {
                            const group2 = structures[j];
                            if (i === j || group1.backgroundColor !== group2.backgroundColor) continue;
                            for (let [xr, yr] of group2.cells) {
                                if (xr === nx && yr === ny && !sameStruct([x, y], [xr, yr])) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    };

    function count(index) {
        if (index === structCount) {
            return areColorsValid() ? 1 : 0;
        }

        const current = structures[index];
        if (current.backgroundColor !== "white") {
            return count(index + 1);
        }

        let ways = 0;
        for (let color of mainColors) {
            current.backgroundColor = color;
            ways += count(index + 1);
            current.backgroundColor = "white";
        }
        return ways;
    }

    return count(0);
}


export { CheckSolution, countValidColorings }
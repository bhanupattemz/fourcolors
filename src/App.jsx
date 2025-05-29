import { useEffect, useRef, useState } from 'react'
import './App.css'
import { CheckSolution, countValidColorings } from "./Solution"
import { GeneratePuzzle } from "./GeneratePuzzle"
function App() {
  const [n, setN] = useState(6)
  const [formValue, setFormValue] = useState(n)
  const [grid, setGrid] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [struct, setStruct] = useState([])
  const [preMoves, setPreMoves] = useState([])
  const [solved, setSolved] = useState(false)
  const boxRef = useRef(null)
  const [solution, setSolution] = useState([])
  const [currColor, setCurrColor] = useState("red")
  const colors = ["red", "lightgreen", "yellow", "blue"]
  const changeColor = (row, col, color) => {
    setGrid(prev => {
      const tempGrid = prev.map(row => row.map(cell => ({ ...cell })))
      for (let i = 0; i < struct.length; i++) {
        for (let j = 0; j < struct[i].cells.length; j++) {
          const x = struct[i].cells[j]
          if (x[0] === row && x[1] === col) {
            for (let k = 0; k < struct[i].cells.length; k++) {
              const [r, c] = struct[i].cells[k]
              tempGrid[r][c].style.backgroundColor = color
            }
            return tempGrid
          }
        }
      }
      return tempGrid
    })
  }

  useEffect(() => {
    const tempGrid = []
    for (let i = 0; i < n; i++) {
      const row = []
      for (let j = 0; j < n; j++) {
        row.push({
          num: i * n + j,
          style: {}
        })
      }
      tempGrid.push(row)
    }


    let tempSolution = GeneratePuzzle(n)
    let structures = JSON.parse(JSON.stringify(tempSolution))
    let colors = ["red", "blue", "lightgreen", "yellow"]
    for (let i = 0; i < structures.length; i++) {
      const group = structures[i];
      let iscolored = false
      for (let [x, y] of structures[i].cells) {
        if ((x == 0 && y == 0) || (x == 0 && y == n - 1) || (x == n - 1 && y == 0) || (x == n - 1 && y == n - 1)) {
          iscolored = true
          break
        }
      }
      if (iscolored) {
        colors = colors.filter((color) => color != group.backgroundColor)
        for (let [x, y] of group.cells) {
          tempGrid[x][y].style.backgroundColor = group.backgroundColor || "white";
          structures[i].backgroundColor = group.backgroundColor || "white";
        }
      }
      for (let j = 0; j < structures[i].cells.length; j++) {
        let x = structures[i].cells[j]
        // structures[i].backgroundColor = revealSet.has(i) ? structures[i].backgroundColor : "white"
        // tempGrid[x[0]][x[1]].style.backgroundColor = structures[i].backgroundColor

        for (let k = j + 1; k < structures[i].cells.length; k++) {
          let y = structures[i].cells[k]
          if (!x || !y) continue
          if (x[0] === y[0]) {
            if (x[1] < y[1]) {
              tempGrid[x[0]][x[1]].style.borderRight = "none"
              tempGrid[y[0]][y[1]].style.borderLeft = "none"
            } else {
              tempGrid[y[0]][y[1]].style.borderRight = "none"
              tempGrid[x[0]][x[1]].style.borderLeft = "none"
            }
          } else if (x[1] === y[1]) {
            if (x[0] < y[0]) {
              tempGrid[x[0]][x[1]].style.borderBottom = "none"
              tempGrid[y[0]][y[1]].style.borderTop = "none"
            } else {
              tempGrid[y[0]][y[1]].style.borderBottom = "none"
              tempGrid[x[0]][x[1]].style.borderTop = "none"
            }
          }
        }
      }
    }
    for (let color of colors) {
      for (let i = 0; i < structures.length; i++) {
        const group = structures[i];
        if (group.backgroundColor == color) {
          for (let [x, y] of group.cells) {
            tempGrid[x][y].style.backgroundColor = group.backgroundColor;
          }
          break
        }
      }
    }
    setGrid(tempGrid)
    setStruct(structures)
    setSolution(tempSolution)
  }, [n, refresh])

  useEffect(() => {
    if (CheckSolution(grid, struct, n)) {
      setSolved(true)
    }
  }, [grid])
  return (
    <>
      <main className='four-colors-main' style={{ cursor: `url(/${currColor}.png) 2 2,auto` }}>
        <h1 className='four-colors-title'>Four colors</h1>
        {solved && <h2 className='four-colors-solved'>Solved</h2>}
        <div className='grid-scroll-container'>
          <div className="four-colors-grid" style={{ gridTemplateRows: `repeat(${n}, 50px)`, gridTemplateColumns: `repeat(${n}, 50px)` }}>
            {grid.map((row, rowIndex) =>
              row.map((item, colIndex) => {
                return (
                  <div
                    className={`four-colors-cell`}
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      ...item.style, cursor: (item.style.backgroundColor && item.style.backgroundColor != "white") ? "not-allowed" : `url(/${currColor}.png) 2 2,auto`
                    }}
                    onClick={() => {
                      if (!item.style.backgroundColor || item.style.backgroundColor == "white") {
                        setPreMoves(prev => [...prev, [rowIndex, colIndex]])
                        changeColor(rowIndex, colIndex, currColor)
                      }
                    }}
                  />
                )
              })
            )}
          </div>
        </div>
        <div className='four-colors-palette' ref={boxRef} >
          <div style={{
            transform: currColor == "red" ? "scale(1.1)" : 'none',
            borderColor: currColor == "red" ? "#2c3e50" : "none",
          }} className='four-colors-option four-colors-red' onClick={() => { setCurrColor("red") }}></div>
          <div style={{
            transform: currColor == "lightgreen" ? "scale(1.1)" : 'none',
            borderColor: currColor == "red" ? "#2c3e50" : "none",
          }} className='four-colors-option four-colors-green' onClick={() => { setCurrColor('lightgreen') }}></div>
          <div style={{
            transform: currColor == "blue" ? "scale(1.1)" : 'none',
            borderColor: currColor == "red" ? "#2c3e50" : "none",
          }} className='four-colors-option four-colors-blue' onClick={() => { setCurrColor("blue") }}></div>
          <div style={{
            transform: currColor == "yellow" ? "scale(1.1)" : 'none',
            borderColor: currColor == "red" ? "#2c3e50" : "none",
          }} className='four-colors-option four-colors-yellow' onClick={() => { setCurrColor("yellow") }}></div>
        </div>
        <div className='four-colors-controls'>
          <div className='four-colors-feature-btns'>
            <button className='four-colors-button four-colors-refresh-btn' onClick={() => {
              if (preMoves && preMoves.length != 0) {
                setPreMoves(prev => {
                  let temp = JSON.parse(JSON.stringify(prev))
                  let [x, y] = temp.pop()
                  changeColor(x, y, "white")
                  return temp
                })
              }
            }}>undo</button>
            <button className='four-colors-button four-colors-solution-btn' onClick={() => {
              setGrid(prev => {
                const newGrid = prev.map(row => row.map(cell => ({ ...cell })))
                for (let i = 0; i < solution.length; i++) {
                  for (let [r, c] of solution[i].cells) {
                    newGrid[r][c].style.backgroundColor = solution[i].backgroundColor
                  }
                }
                return newGrid
              })
            }}>Solution</button>
            <button className='four-colors-button four-colors-refresh-btn' onClick={() => { setRefresh(prev => prev + 1); setSolved(false) }}>refresh</button>
          </div>
          <form className='four-colors-form' onSubmit={(e) => {
            e.preventDefault();
            setN(formValue)
          }}>
            <input className='four-colors-input' type="number" max={20} name="size" id="size" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='Enter grid Size(max 20)' />
            <button className='four-colors-button'>Set</button>
          </form>
        </div>
      </main>
    </>
  )
}

export default App

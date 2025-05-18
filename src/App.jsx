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
  const [selected, setSelected] = useState(null)
  const [solved, setSolved] = useState(false)
  const boxRef = useRef(null)
  const [solution, setSolution] = useState([])

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
    let structures = [...tempSolution]

    // const revealCount = Math.floor(Math.random() * (structures.length / 3)) + Math.min(4, structures.length / 3);
    const revealCount=6

    const structureCount = tempSolution.length

    const shuffled = [...Array(structureCount).keys()]
      .sort(() => Math.random() - 0.5)

    const revealIndices = shuffled.slice(0, revealCount)

    const revealSet = new Set(revealIndices)

    for (let i = 0; i < structures.length; i++) {
      for (let j = 0; j < structures[i].cells.length; j++) {
        let x = structures[i].cells[j]
        structures[i].backgroundColor = revealSet.has(i) ? structures[i].backgroundColor : "white"
        tempGrid[x[0]][x[1]].style.backgroundColor = structures[i].backgroundColor

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
    setGrid(tempGrid)
    setStruct(structures)
    console.log(countValidColorings(structures, n))
    setSolution(tempSolution)
  }, [n, refresh])

  useEffect(() => {
    if (CheckSolution(grid, struct, n)) {
      setSolved(true)
    }
    console.log(countValidColorings(struct,n))
  }, [grid])
  return (
    <>
      <main className='four-colors-main'>
        <h1 className='four-colors-title'>Four colors</h1>
        {solved && <h2 className='four-colors-solved'>Solved</h2>}
        <div className="four-colors-grid" style={{ gridTemplateRows: `repeat(${n}, 50px)`, gridTemplateColumns: `repeat(${n}, 50px)` }}>
          {grid.map((row, rowIndex) =>
            row.map((item, colIndex) => {
              return (
                <div
                  className={`four-colors-cell ${item.style.backgroundColor == "white" ? "four-colors-cell-editable" : "four-colors-cell-fixed"}`}
                  key={`${rowIndex}-${colIndex}`}
                  style={{ ...item.style }}
                  onClick={() => {
                    if (item.style.backgroundColor == "white") {
                      setSelected([rowIndex, colIndex])
                    }
                  }}
                />
              )
            })
          )}
        </div>
        {selected && <div className='four-colors-palette' ref={boxRef}>
          <div className='four-colors-option four-colors-red' onClick={() => { changeColor(selected[0], selected[1], "red"); setSelected(null) }}></div>
          <div className='four-colors-option four-colors-green' onClick={() => { changeColor(selected[0], selected[1], "lightgreen"); setSelected(null) }}></div>
          <div className='four-colors-option four-colors-blue' onClick={() => { changeColor(selected[0], selected[1], "blue"); setSelected(null) }}></div>
          <div className='four-colors-option four-colors-yellow' onClick={() => { changeColor(selected[0], selected[1], "yellow"); setSelected(null) }}></div>
        </div>}
        <div className='four-colors-controls'>
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
          <form className='four-colors-form' onSubmit={(e) => {
            e.preventDefault();
            setN(formValue)
          }}>
            <input className='four-colors-input' type="number" max={20} name="size" id="size" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='Enter grid Size(max 20)' />
            <button className='four-colors-button'>Set</button>
          </form>
          <button className='four-colors-button four-colors-refresh-btn' onClick={() => { setRefresh(prev => prev + 1) }}>refresh</button>
        </div>
      </main>
    </>
  )
}

export default App

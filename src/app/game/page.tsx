"use client"

import React, { useState,useEffect } from "react"

export default function page(){

  const rows = 30;
  const cols = 30;

  const createEmptyGrid = () => {
    return Array.from({ length: rows }).map(() =>
      Array.from({ length: cols }).fill(0)
    );
  };

  const [grid,setGrid] = useState(createEmptyGrid());
  const [running,setRunning] = useState(false);

  // Calculate next state of grid 

  const nextGridState = (grid:any) => {
    const newGrid = createEmptyGrid();

    for(let r=0; r < rows; r++){
      for(let c=0; c < cols; c++){
        let neighbors = 0;

        // Calculate live neighbors

        for(let i = -1; i <= 1; i++){
          for(let j = -1; j <= 1; j++){
            if( i===0 && j===0 ) continue

            const newRow = r+i;
            const newCol = c+j;

            if(
              newRow >= 0 &&
              newRow < rows &&
              newCol >= 0 &&
              newCol < cols
            ){
              neighbors += grid[newRow][newCol]
            }

            // Applying the rules

            if(grid[r][c] === 1 && neighbors === 2 || neighbors === 3){
              newGrid[r][c] = 1;
            }

            else if(grid[r][c] === 0 && neighbors === 3){
              newGrid[r][c] = 1;
            }

           else{
              newGrid[r][c] = 0;
            }

          }
        }
      }
    }
    return newGrid;
  }

  // Function to start/stop

  const runGame = () => {
    setRunning(!running)
  }

  const randomizeGrid = () => {
    const newGrid = grid.map((row) =>
      row.map(() => (Math.random() > 0.7 ? 1 : 0))
    );
    setGrid(newGrid);
  };

  const toggleCellState = (row:number,col:number) =>{
    const newGrid = grid.map((rowArr,r) =>
      rowArr.map((cell,c) => ( r === row && c === col ? (cell ? 0 : 1) : cell))
    )
    setGrid(newGrid);
  }


  useEffect(()=>{
    if(!running) return;

    const interval = setInterval(()=>{
      setGrid((prevGrid)=> nextGridState(prevGrid))
    },100);

    return ()=> clearInterval(interval);
  },[running])

  return(
        <div>
            <div 
              className="grid justify-center mt-4" 
              style={{
                gridTemplateRows:`repeat(${rows},15px)`,
                gridTemplateColumns: `repeat(${cols},15px)`
              }}>
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="contents">
                  {row.map((cell, colIndex) => (
                    <div
                      key={colIndex}
                      className={`${cell ? 'bg-black' : 'bg-white'} w-5 h-5 border-[#ccc] border`}
                      onClick={() => toggleCellState(rowIndex, colIndex)}
                    />
                  ))}
                </div>
              ))}
            </div>
          
          <div className="flex justify-center gap-8 mt-8">
            <button
              onClick={runGame}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              {running ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={randomizeGrid}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
              Randomize
            </button>
            <button
              onClick={() => setGrid(createEmptyGrid())}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
              Clear
            </button>
          </div>
        </div>
    
  )
}
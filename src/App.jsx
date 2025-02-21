import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import MazeVisualizer from './components/MazeVisualizer';
import { OrbitControls } from '@react-three/drei';

const App = () => {
  const [maze, setMaze] = useState([]);
  const [width, setWidth] = useState(11); //columns
  const [height, setHeight] = useState(11); //rows
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 }); //default position

  const createMaze = (width, height) => {
    const maze = Array.from({ length: height }, () => Array(width).fill(1)); // Initializes a grid with walls (1)
    const visited = new Set(); // Keeps track of visited cells
    const directions = [
      [0, -2], [0, 2], [-2, 0], [2, 0]
    ]; // Movement directions for maze generation (up, down, left, right)
    const isInBounds = (x, y) => x > 0 && y > 0 && x < width - 1 && y < height - 1; // Checks if the position is within bounds
    
    const carvePath = (x, y) => {
      visited.add(`${x},${y}`);
      maze[y][x] = 0;
      directions.sort(() => Math.random() - 0.5);

      for (const [dx, dy] of directions) {
        const nx = x + dx, ny = y + dy, mx = x + dx / 2, my = y + dy / 2;
        if (isInBounds(nx, ny) && !visited.has(`${nx},${ny}`)) {
          maze[my][mx] = 0;
          carvePath(nx, ny);
        }
      }
    };

    carvePath(1, 1);
    return maze;
  };

  const generateMaze = () => {
    setMaze(createMaze(width, height)); // Set the generated maze to the state
    setPlayerPosition({ x: 1, y: 1 }); // Reset player position to the starting point
  };

  const handleKeyDown = (event) => {
    const { x, y } = playerPosition; // Get current player position
    let newX = x, newY = y; // Default to current position

    // Update player position based on arrow key input
    switch (event.key) {
      case 'ArrowUp': newY += 1; break;
      case 'ArrowDown': newY -= 1; break;
      case 'ArrowLeft': newX -= 1; break;
      case 'ArrowRight': newX += 1; break;
      default: return; // Only handle arrow keys
    }

    // Ensure the new position is valid and within bounds
    if (newX > 0 && newX < width - 1 && newY > 0 && newY < height - 1 && maze[newY][newX] === 0) {
      setPlayerPosition({ x: newX, y: newY }); // Update player position
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, maze]); // Re-run effect when maze or player position changes

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      {/* UI Panel */}
      <div style={{
        padding: '10px',
        background: '#222',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px'
      }}>
        <label>Width:</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value) || 5)}
          min="5" max="20"
          style={{ padding: '5px', width: '50px' }}
        />

        <label>Height:</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(parseInt(e.target.value) || 5)}
          min="5" max="20"
          style={{ padding: '5px', width: '50px' }}
        />

        <button 
          onClick={generateMaze} 
          style={{ padding: '5px 10px', background: '#ff9800', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          Generate Maze
        </button>
      </div>

      {/* 3D Canvas Below */}
      <div style={{
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Canvas camera={{ position: [0, 10, 0], rotation: [-Math.PI / 2, 0, 0] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <MazeVisualizer maze={maze} playerPosition={playerPosition} /> {/*rendering the 3D maze and the player within the Canvas*/}
        </Canvas>
      </div>
    </div>
  );
};

export default App;

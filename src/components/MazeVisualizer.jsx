import React, { useMemo } from 'react';
import * as THREE from 'three';


const MazeVisualizer = ({ maze, playerPosition }) => {
  const cells = useMemo(() => { {/*memorize the maze walls*/}
    const cellSize = 1; //size of each wall cell
    const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize); //Each wall is created as a 3D box

    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });  // Black for walls

    return maze.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === 1 ) {
          const wall = new THREE.Mesh(geometry, wallMaterial);
          wall.position.set(colIndex, 0.5, -rowIndex); // Center walls(horiz pos , vert pos)
          return wall;
        }
        return null;
      })
    ).flat().filter(Boolean); // Remove null values (show only walls)
  }, [maze]);

  // Create player mesh
  const playerMesh = useMemo(() => {
    const playerGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7); // Slightly smaller size
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(playerPosition.x, 0.35, -playerPosition.y); // as props
    return player;
  }, [playerPosition]);

  return (
    <group>
      {cells.map((cell, index) => (
        <primitive key={index} object={cell} />
      ))}
      <primitive object={playerMesh} />
    </group>
  );
};

export default MazeVisualizer;

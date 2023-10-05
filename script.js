import { Grid } from "./grid.js"
import { Tile } from "./tile.js";

const gameBoard = document.getElementById('game-board')

const grid = new Grid(gameBoard)

grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))

setupInputOnce()

function setupInputOnce() {
    window.addEventListener('keydown', hendleInput, { once: true })
}

function hendleInput(e) {
    switch (e.key) {
        case 'ArrowUp':
            moveUp()
            break;
        case 'ArrowDown':
            moveDown()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
        case 'ArrowRight':
            moveRight()
            break;
        default:
            setupInputOnce()
            break;
    }
    const newTile = new Tile(gameBoard)
    grid.getRandomEmptyCell().linkTile(newTile)
    setupInputOnce()
}


function moveUp() {
    slideTiels(grid.cellsGroupedByColumn)
}
function moveDown() {
    slideTiels(grid.cellsGroupedByReversedColumn)
}
function moveLeft() {
    slideTiels(grid.cellsGroupedByRow)
}
function moveRight() {
    slideTiels(grid.cellsGroupedReversedRow)
}


function slideTiels(groupedCells) {
    groupedCells.forEach(group => slideTielsInGroup(group));

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles()
    })
}

function slideTielsInGroup(group) {
    for (let i = 1; i < group.length; i++) {
        if (group[i].isEmpty()) {
            continue
        }

        const cellWithTile = group[i]

        let targetCell
        let j = i - 1
        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j]
            j--
        }

        if (!targetCell) {
            continue
        }
        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile)
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile)
        }
        cellWithTile.unlinkTile()
    }
}
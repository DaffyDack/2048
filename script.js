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

async function hendleInput(e) {
    switch (e.key) {
        case 'ArrowUp':
            await moveUp()
            break;
        case 'ArrowDown':
            await moveDown()
            break;
        case 'ArrowLeft':
            await moveLeft()
            break;
        case 'ArrowRight':
            await moveRight()
            break;
        default:
            setupInputOnce()
            break;
    }
    const newTile = new Tile(gameBoard)
    grid.getRandomEmptyCell().linkTile(newTile)
    setupInputOnce()
}


async function moveUp() {
    await slideTiels(grid.cellsGroupedByColumn)
}
async function moveDown() {
    await slideTiels(grid.cellsGroupedByReversedColumn)
}
async function moveLeft() {
    await slideTiels(grid.cellsGroupedByRow)
}
async function moveRight() {
    await slideTiels(grid.cellsGroupedReversedRow)
}


async function slideTiels(groupedCells) {

    const promises = []
    groupedCells.forEach(group => slideTielsInGroup(group, promises));
    await Promise.all(promises)
    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles()
    })
}

function slideTielsInGroup(group, promises) {
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

        promises.push(cellWithTile.linkedTile.withFromTransitionsEnd())

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile)
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile)
        }
        cellWithTile.unlinkTile()
    }
}
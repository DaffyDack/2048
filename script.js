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
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInputOnce();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInputOnce();
                return;
            }
            await moveDown();
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInputOnce();
                return;
            }
            await moveLeft();
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInputOnce();
                return;
            }
            await moveRight();
            break;
        default:
            setupInputOnce()
            break;
    }
    const newTile = new Tile(gameBoard)
    grid.getRandomEmptyCell().linkTile(newTile)

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.withFromAnimationEnd()
        alert('Некуда ходить!')
        return
    }

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
    await slideTiels(grid.cellsGroupedByReversedRow)
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

function canMoveUp() {
    return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
    return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
    return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
    return group.some((cell, index) => {
        if (index === 0) {
            return false;
        }

        if (cell.isEmpty()) {
            return false;
        }

        const targetCell = group[index - 1];
        return targetCell.canAccept(cell.linkedTile);
    });
}
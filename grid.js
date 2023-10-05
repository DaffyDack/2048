import { Cell } from './cell.js'

const GRIDE_SIZE = 4
const CELLS_COUNT = GRIDE_SIZE * GRIDE_SIZE

export class Grid {
    constructor(gridElement) {
        this.cells = []
        for (let i = 0; i < CELLS_COUNT; i++) {
            this.cells.push(
                new Cell(gridElement, i % GRIDE_SIZE, Math.floor(i / GRIDE_SIZE))
            )
        }

        this.cellsGroupedByColumn = this.cellsGroupedByColumn()
        this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(col => [...col].reverse())
        this.cellsGroupedByRow = this.cellsGroupedByRow()
        this.cellsGroupedReversedRow = this.cellsGroupedByRow.map(row => [...row].reverse())
    }

    getRandomEmptyCell() {
        const emptyCells = this.cells.filter(cell => cell.isEmpty())
        const randomIndex = Math.floor(Math.random() * emptyCells.length)
        return emptyCells[randomIndex]
    }

    cellsGroupedByColumn() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || []
            groupedCells[cell.x][cell.y] = cell
            return groupedCells
        }, [])
    }
    cellsGroupedByRow() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || []
            groupedCells[cell.y][cell.x] = cell
            return groupedCells
        }, [])
    }
}
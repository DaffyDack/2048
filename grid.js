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
    }
}
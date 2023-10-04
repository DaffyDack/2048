export class Cell {
    constructor(grinElement, x, y) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        grinElement.append(cell)
        this.x = x
        this.y = y
    }
}
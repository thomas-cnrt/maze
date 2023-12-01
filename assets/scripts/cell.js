class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.visited = false;
        this.walls = [true, true, true, true]; // top, right, bottom, left
    }

    check_neighbors() {
        let neighbors = [];

        let top = grid[index(this.i, this.j - 1)];
        let right = grid[index(this.i + 1, this.j)];
        let bottom = grid[index(this.i, this.j + 1)];
        let left = grid[index(this.i - 1, this.j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            let r = floor(random(0, neighbors.length));
            return neighbors[r];
        } else {
            return undefined;
        }
    }

    show() {
        let x = this.i * cell_size;
        let y = this.j * cell_size;
        stroke(0);
        strokeWeight(4);

        // Top wall
        if (this.walls[0]) {
            line(x, y, x + cell_size, y);
        }
        // Right wall
        if (this.walls[1]) {
            line(x + cell_size, y, x + cell_size, y + cell_size);
        }
        // Bottom wall
        if (this.walls[2]) {
            line(x + cell_size, y + cell_size, x, y + cell_size);
        }
        // Left wall
        if (this.walls[3]) {
            line(x, y + cell_size, x, y);
        }

        // Highlight current cell
        if (this.visited) {
            noStroke();
            noFill();
            rect(x, y, cell_size, cell_size);
        }
    }
}

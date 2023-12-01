let cols, rows;
let cell_size = 20; // Width and height of each cell
let grid = [];
let stack = [];

var maze_graphics;
var player_graphics;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    cols = floor(width / cell_size);
    rows = floor(height / cell_size);

    // Initialize grid with cells
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let cell = new Cell(i, j);
            grid.push(cell);
        }
    }

    maze_graphics = createGraphics(window.innerWidth, window.innerHeight);
    player_graphics = createGraphics(window.innerWidth, window.innerHeight);
    setup_player();
    generate_maze();
}

function generate_maze() {
    // Reset visited property for each cell
    for (let i = 0; i < grid.length; i++) {
        grid[i].visited = false;
        grid[i].walls = [true, true, true, true];
    }

    // Set starting cell
    let start = grid[0];
    start.visited = true;

    // Reset stack
    stack = [];
    stack.push(start);

    // Recursive backtracking algorithm
    while (stack.length > 0) {
        let current = stack[stack.length - 1];
        current.visited = true;
        let next = current.check_neighbors();

        if (next) {
            next.visited = true;
            stack.push(next);
            remove_walls(current, next);
        } else {
            stack.pop();
        }
    }
}

function draw() {
    image(maze_graphics, 0, 0);
    image(player_graphics, 0, 0);

    // Change background color here if needed
    maze_graphics.background(110);

    update_player_graphics();

    // Display the final result
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }
}

function keyPressed() {
    if (keyCode === 32) { // Check if the key pressed is the space key
        generate_maze();
    }
}

function keyReleased() {
    triggeredBefore = 0;
}

function index(i, j) {
    if (i < 0 || j < 0 || i >= cols || j >= rows) {
        return -1;
    }
    return i + j * cols;
}

function remove_walls(a, b) {
    let x = a.i - b.i;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    let y = a.j - b.j;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function is_wall_present(player_position, wall_position) {
    return grid[player_position].walls[wall_position];
}
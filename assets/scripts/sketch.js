let cols, rows;
let cell_size = 20; // Width and height of each cell
let grid = [];
let stack = [];

var maze_graphics;
var player_graphics;
var show_alert = true;

function setup() {
    cols = floor((window.innerWidth - 10) / cell_size);
    rows = floor((window.innerHeight - 10) / cell_size);
    createCanvas(cols * cell_size, rows * cell_size);

    // Initialize grid with cells
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let cell = new Cell(i, j);
            grid.push(cell);
        }
    }

    maze_graphics = createGraphics(cols * cell_size, rows * cell_size);
    player_graphics = createGraphics(cols * cell_size, rows * cell_size);
    setup_player();
    generate_maze();
    add_randomness_to_maze();
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

function add_randomness_to_maze() {

    let center_maze_range = {
        min_x: floor(cols * 0.25),
        max_x: floor(cols * 0.75),
        min_y: floor(rows * 0.25),
        max_y: floor(rows * 0.75),
    };

    for (let i = 0; i < 50; i++) {
        let random_col = floor(random(center_maze_range.min_x, center_maze_range.max_x));
        let random_row = floor(random(center_maze_range.min_y, center_maze_range.max_y));
        console.log("random_row : " + random_row + " | random_col: " + random_col);
        let random_cell = grid[index(random_col, random_row)];
        console.log("random_cell: " + random_cell.i + " " + random_cell.j);

        // Get a random direction (0: top, 1: right, 2: bottom, 3: left)
        let random_direction = floor(random(0, 4));

        // Get the neighboring cell in the direction of the random wall index
        let neighbor = null;
        if (random_direction === 0 && random_cell.j > 0) {
            neighbor = grid[index(random_cell.i, random_cell.j - 1)];
        } else if (random_direction === 1 && random_cell.i < cols - 1) {
            neighbor = grid[index(random_cell.i + 1, random_cell.j)];
        } else if (random_direction === 2 && random_cell.j < rows - 1) {
            neighbor = grid[index(random_cell.i, random_cell.j + 1)];
        } else if (random_direction === 3 && random_cell.i > 0) {
            neighbor = grid[index(random_cell.i - 1, random_cell.j)];
        }

        // Remove the random wall
        if (neighbor) {
            remove_walls(random_cell, neighbor);
        }
    }
}

function draw() {
    image(maze_graphics, 0, 0);
    image(player_graphics, 0, 0);

    // Change background color here if needed
    maze_graphics.background(110);

    maze_graphics.strokeWeight(2);
    maze_graphics.fill(255, 0, 0);
    maze_graphics.stroke(10, 60, 10);
    maze_graphics.ellipse(cols * cell_size - cell_size / 2, rows * cell_size - cell_size / 2, cell_size / 2);

    // Display the final result
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    update_player_graphics();
    check_player_reach_exit();
}

function keyPressed() {
    if (keyCode === 32) { // Check if the key pressed is the space key
        restart();
    }
}

function restart() {
    // Reinitialize player and history
    player_position = 0;
    position_history = [0];

    show_alert = true;
    // Regenerate the maze
    generate_maze();
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
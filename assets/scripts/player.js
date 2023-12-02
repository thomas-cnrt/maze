let player_position;
let position_history = [0];
var last_pressed_ms;
const TRACK_COLOR = "#000064"; // Change this color as needed

function setup_player() {
    player_position = 0; // Set the initial player position
}

function update_player_graphics() {
    if (last_pressed_ms > millis() - 50) return;

    last_pressed_ms = millis();

    var px = get_position_x(player_position);
    var py = get_position_y(player_position);

    if (keyIsDown(UP_ARROW) && !is_wall_present(player_position, 0)) {
        py -= 1;
    } else if (keyIsDown(DOWN_ARROW) && !is_wall_present(player_position, 2)) {
        py += 1;
    } else if (keyIsDown(RIGHT_ARROW) && !is_wall_present(player_position, 1)) {
        px += 1;
    } else if (keyIsDown(LEFT_ARROW) && !is_wall_present(player_position, 3)) {
        px -= 1;
    }

    var new_position = index(px, py);

    if (new_position !== player_position) {
        player_position = new_position;
        position_history.push(new_position);
    }

    var draw_position_x = px * cell_size + cell_size / 2;
    var draw_position_y = py * cell_size + cell_size / 2;

    player_graphics.clear();

    for (let i = 0; i < position_history.length - 1; i++) {
        player_graphics.strokeWeight(cell_size / 3);
        player_graphics.stroke(TRACK_COLOR);
        var i1 = position_history[i];
        var x1 = get_position_x(i1) * cell_size + cell_size / 2;
        var y1 = get_position_y(i1) * cell_size + cell_size / 2;
        var i2 = position_history[i + 1];
        var x2 = get_position_x(i2) * cell_size + cell_size / 2;
        var y2 = get_position_y(i2) * cell_size + cell_size / 2;
        player_graphics.line(x1, y1, x2, y2);
    }

    player_graphics.strokeWeight(2);
    player_graphics.fill(0, 0, 255);
    player_graphics.stroke(10, 60, 10);
    player_graphics.ellipse(draw_position_x, draw_position_y, cell_size / 2);
}

function check_player_reach_exit() {
    if (player_position === index(cols - 1, rows - 1) && show_alert) {
        show_alert = false;
        if (confirm("Congratulations! You reached the end of the maze!")) {
            restart();
        }
    }
}

function getIndex(x, y) {
    return x + y * cols;
}
function get_position_x(i) {
    return i % cols;
}
function get_position_y(i) {
    return Math.floor(i / cols);
}


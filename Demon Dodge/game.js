let pipes = [];
let pipe_gap = 100;
let pipe_gap_distance = 200;
let pipe_distance = 400;
let pause = true;
let camera = 0;
let bird = {
    x: 0,
    y: 0,
    dx: 1,
    dy: 0
};
let gravity = 0.1;
let bird_div = document.getElementById('bird');

//Change bgm volume
let bgm = document.getElementById("bgm");
bgm.volume = 0.2;
function mute() {
    if (bgm.volume == "0.2") {
        bgm.volume = 0.0;
    }
    else {
        bgm.volume = 0.2;
    }
}


//Draws two  vertical pipes perpendicular from eachother 
function draw_pipes(p, ImPaused) {
    let pipe_display_top = document.getElementsByClassName('top');
    let pipe_display_bottom = document.getElementsByClassName('bottom');
    if (ImPaused) return;

    for (i = 0; i < pipe_display_top.length; i++) {
        pipe_display_top[i].style.left = ((i + 1) * pipe_distance - camera) + 'px';
        pipe_display_bottom[i].style.left = ((i + 1) * pipe_distance - camera) + 'px';
        pipe_display_top[i].style.height = p[i] + 'px';
        pipe_display_bottom[i].style.top = (p[i] + pipe_gap_distance) + 'px';
    }
}

//Animates the bird jumping and pipes moving across, also deals with the point system 
let score_sound = new Audio("audio/jump_sound.mp3");
score_sound.volume = 1.0;
let old_score = 0;
function animate() {
    if (pause == true) {
        requestAnimationFrame(animate);
        return;
    }

    let pipe_index = Math.floor(bird.x / pipe_distance) - 1;
    if (
        bird.x > 60 &&
        bird.x % pipe_distance < 90 &&
        (bird.y < pipes[pipe_index] || bird.y > pipes[pipe_index] + pipe_gap_distance)
    ) {
        if (pause == false) {
            document.getElementById('score').innerHTML += " GAMEOVER";
        }
        pause = true;
        return;
    }

    bird.x += bird.dx;
    bird.y += bird.dy;
    bird.dy += gravity;
    if (bird.x - camera > pipe_distance) camera += bird.dx;
    bird_div.style.left = (bird.x - camera) + 'px';
    bird_div.style.top = bird.y + 'px';

    draw_pipes(pipes, pause);

    let score = Math.floor(camera / pipe_distance);

    if(score > old_score) {
        score_sound.play();
        old_score = score;
        bird.dx += 0.5;
    }

    let formattedNumber = score.toLocaleString('en-US', {
        minimumIntegerDigits: 6,
        useGrouping: false
    });
    document.getElementById('score').innerHTML = formattedNumber;

    requestAnimationFrame(animate);
}

//Function that binds controls to certain keys
let jump = new Audio("audio/jump_sound.mp3");
jump.volume = 0.3;
function control(Event) {  
    if (Event.code === "Enter"){
        pause = !pause;
    }
    if (Event.code === "Space"){
        bird.dy = -2.5;
        jump.load();
        jump.play();
    }
}

//Randomizes the pipes 
function randomize_pipes(difficulty) {
    pipes = [];
    let html_text = '';
    for (let i = 0; i < 100; i++) {
        pipes.push(Math.random() * difficulty);
        html_text += '<div class="pipe top"></div><div class="pipe bottom"></div>';
    }
    document.getElementById('pipe_field').innerHTML = html_text;
}

randomize_pipes(200);
animate();
draw_pipes(pipes, true);
document.addEventListener('keydown', control);
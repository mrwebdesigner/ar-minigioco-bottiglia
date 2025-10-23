let video;
        let detector;
        let detections = [];
        let gameStarted = false;
        let fruits = [];
        let basket;
        let score = 0;
        let basketWidth = 100;
        let basketHeight = 50;
        let fruitSize = 30;
        let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        function setup() {
            createCanvas(windowWidth, windowHeight);
            video = createCapture(VIDEO);
            video.size(width, height);
            video.hide();

            // Initialize object detector with COCO-SSD
            detector = ml5.objectDetector('cocossd', modelReady);
        }

        function modelReady() {
            console.log('Model ready!');
            detect();
        }

        function detect() {  detector.detect(video, gotDetections);
        }

        function gotDetections(error, results) {
            if (error) {
                console.error(error);
                return;
            }
            detections = results;
            detect();
        }

        function draw() {
            // Draw video as background
            image(video, 0, 0, width, height);

            // Check for bottle detection
            let bottleDetected = false;
            for (let i = 0; i < detections.length; i++) {
                let object = detections[i];
                if (object.label === 'bottle') {
                    bottleDetected = true;
                    // Draw bounding box for bottle
                    stroke(0, 255, 0);
                    strokeWeight(4);
                    noFill();
                    rect(object.x, object.y, object.width, object.height);
                    break;
                }  }

            if (bottleDetected && !gameStarted) {
                gameStarted = true;
                // Initialize basket
                basket = { x: width / 2 - basketWidth / 2, y: height - 100 };
                // Start spawning fruits
                setInterval(spawnFruit, 1000);
            }

            if (gameStarted) {
                // Update basket position
                if (isMobile) {
                    // On mobile, basket follows touch
                    if (touches.length > 0) {
                        basket.x = touches[0].x - basketWidth / 2;
                    }
                } else {
                    basket.x = mouseX - basketWidth / 2;
                }
                basket.x = constrain(basket.x, 0, width - basketWidth);
                fill(139, 69, 19);
                rect(basket.x, basket.y, basketWidth, basketHeight);

                // Update and draw fruits for (let i = fruits.length - 1; i >= 0; i--) {
                    let fruit = fruits[i];
                    fruit.y += 5; // Fall speed
                    fill(255, 0, 0);
                    ellipse(fruit.x, fruit.y, fruitSize);

                    // Check collision with basket
                    if (fruit.y + fruitSize / 2 >= basket.y &&
                        fruit.x >= basket.x &&
                        fruit.x <= basket.x + basketWidth) {
                        score++;
                        fruits.splice(i, 1);
                    } else if (fruit.y > height) {
                        fruits.splice(i, 1);
                    }
                }

                // Update score display
                document.getElementById('score').innerText = 'Score: ' + score;
                document.getElementById('instructions').style.display = 'none';
            } else {
                document.getElementById('instructions').style.display = 'block';
            }
        }
function spawnFruit() {
            if (gameStarted) {
                let fruit = {
                    x: random(fruitSize / 2, width - fruitSize / 2),
                    y: -fruitSize / 2
                };
                fruits.push(fruit);
            }
        }

        function touchMoved() {
            // Prevent scrolling on mobile
            return false;
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
            video.size(width, height);
        }

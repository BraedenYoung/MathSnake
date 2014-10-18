/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;
	
			canvas = document.getElementById("canvas");
	
			canvas.width = windowWidth
			canvas.height = canvas.width
	
			var ctx = canvas.getContext("2d");
		
			var cw = canvas.width/10
			var d, food, score, snake_array;
			var foodPellets = [];
			var run = false;
			var gameSpeed = 160;
	
			if(jQuery.browser.mobile){
				gameSpeed = 180;
				$('#mobileWelcomeModal').modal('show');
			}else{
				$('#welcomeModal').modal('show');
			}
	
			function init(){
		
				d = "right"; //default direction
				create_snake();
				generateEquation();
				renderGrid(cw/40, "#EEEEEE");		
				score = 0;
		    	// Repaint at some particular interval
		    	if(typeof game_loop != "undefined") clearInterval(game_loop);
		    	
		    	game_loop = setInterval(paint, gameSpeed);
			}
	
	       	$(document).keydown(function(k){
	       		var key = k.which;
	    		if(key == 13 || key == 32){
					$('#welcomeModal').modal('hide');
					$('#myModal').modal('hide');
					run = true;
					return init();
				}
				else if(key == "37" && d != "right") d = "left";
				else if(key == "38" && d != "down") d = "up";
				else if(key == "39" && d != "left") d = "right";
				else if(key == "40" && d != "up") d = "down";
			});
	    	$(document).swipe({
	    		tap:function(){
	    			if(!run){
		    			$('#welcomeModal').modal('hide');
		    			$('#mobileWelcomeModal').modal('hide');
		    			$('#myModal').modal('hide');
		    			run = true;
		    			return init();
		    		}
	    		},
	    		threshold:5,
	    		swipe:function(event, direction, distance, duration, fingerCount) {
			    	d = direction 
			    },
			   //Default is 75px, set to 0 
			   threshold:0
	    	});
	
		    function create_snake(){
				//Length of initial snake
				var length = 5;
				snake_array = [];
				for(var i = length-1; i>=0; i--){
					snake_array.push({x: i, y:0});
				}
			}
			function create_food(value){
				// food can stack!!!!!!!! 
				return food = {
					x: Math.round(Math.random()*(canvas.width-cw)/cw), 
					y: Math.round(Math.random()*(canvas.height-cw)/cw),
					value:  value
				};
			}
	
			function check_collision(x, y, array){
				for(var i = 0; i < array.length; i++){
					if(array[i].x == x && array[i].y == y)
						return true;
				}
				return false;
			}
	
			function generateEquation(){
		    	// simple random equation generator 
		    	var eqn,op,ans,a,b;
	
		    	foodPellets = [];
		    	
		    	a = Math.floor(Math.random()*10);
		    	b = Math.floor(Math.random()*10);
		    	
		    	if(a<b){
		    		var tmp = b;
		    		b = a;
		    		a = tmp;
		    	}
		    	
		    	switch(Math.floor(Math.random() * 4) + 1){
		    		case 1:
		    		eqn = a+" \u002B "+b;
		    		ans = a+b;
		    		break;
		    		case 2:
		    		eqn = a+" \u2212 "+b;
		    		ans = a-b;
		    		break;
		    		case 3:
		    		eqn= a+" \u00D7 "+b;
		    		ans = a * b;
		    		break;
		    		case 4:
		    		if(b <= 0)b = 1;
		    		var p = a*b;
		    		eqn = p+" \u00F7 "+a;
		    		ans = b;
		    		break; 
		    		default:
		    		break;
		    	}
		    	// add food pellets for each of the possible answers 
		    	// This is the actual answer    
	
		    	foodPellets[0] = create_food(ans);
	
		    	var lesser = ans-Math.floor(Math.random()*3+1);
		    	var greater = ans+Math.floor(Math.random()*3+1)
		    	
		    	while(ans == lesser || ans == greater || greater == lesser){
		    		lesser = ans-Math.floor(Math.random()*3+1);
		    		greater = ans+Math.floor(Math.random()*3+1);
		    	}
		    	if(lesser < 0)
		    		lesser = greater -1;
		    	if(greater!= ans)
		    		foodPellets[1] = create_food(greater);
		    	if(lesser != greater || lesser != ans)
		    		foodPellets[2] = create_food(lesser);
	
	
		    	if(typeof foodPellets[0] == 'undefined' || foodPellets[0].value == null || foodPellets[0].value == foodPellets[1].value || foodPellets[0].value == foodPellets[2].value) 
		    		return generateEquation();
		    	
		    	$('#equation').text(eqn);
	
		    }
	
		    function paint(){
		    	if(run){
					// paint the canvas now
					ctx.fillStyle = "white";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.strokeStyle = "black";
					ctx.strokeRect(0, 0, canvas.width, canvas.height);
					
					// paint the grid
					renderGrid(cw, "#bab8b8");
	
					//The movement for the snake
					//Pop off the tail and place it infront of the head in the current direction
					var nx = snake_array[0].x;
					var ny = snake_array[0].y;
	
					if(d == "right") nx++;
					else if(d == "left") nx--;
					else if(d == "up") ny--;
					else if(d == "down") ny++;
					
					//Restart the game if the snake hits the wall or if the snake eats a bad pellet
					if(nx == -1 || nx == canvas.width/cw || ny == -1 || ny == canvas.height/cw || check_collision(nx, ny, snake_array)||nx == foodPellets[1].x && ny == foodPellets[1].y||nx == foodPellets[2].x && ny == foodPellets[2].y){
						//restart game
						reset();
					}
					else if(nx == foodPellets[0].x && ny == foodPellets[0].y){
						var tail = {x: nx, y: ny};
						score++;
						generateEquation();
					}
					else{
						var tail = snake_array.pop(); //pops out the last cell
						tail.x = nx; tail.y = ny;
					}
					//The snake can now eat the food.
					snake_array.unshift(tail); //puts back the tail as the first cell
	
					for(var i = 0; i < snake_array.length; i++){
						var c = snake_array[i];
						if(typeof c != 'undefined')
							paint_cell(c.x, c.y);
					}
					//paint the food
					for (var i = 2 ; i >= 0 ; i--){
						if(typeof(foodPellets[i]) != 'undefined' || foodPellets[i].value != null )
							paint_food(foodPellets[i].x, foodPellets[i].y, foodPellets[i].value);
						else{
							generateEquation();
							return paint;
						}
					}	
					//paint the score
					ctx.fillStyle = "#477282";
					var score_text = "Score: " + score;
					ctx.font="30px Arial";
					ctx.fillText(score_text, 5, canvas.height-5);
				}
			}
	
			function renderGrid(gridPixelSize, color){
				ctx.save();
				ctx.lineWidth = 0.2;
				ctx.strokeStyle = color;
			        // horizontal grid lines
			        for(var i = 0; i <= canvas.height; i = i + gridPixelSize){
			        	ctx.beginPath();
			        	ctx.moveTo(0, i);
			        	ctx.lineTo(canvas.width, i);
			        	ctx.closePath();
			        	ctx.stroke();
			        }
		        // vertical grid lines
		        for(var j = 0; j <= canvas.width; j = j + gridPixelSize){
		        	ctx.beginPath();
		        	ctx.moveTo(j, 0);
		        	ctx.lineTo(j, canvas.height);
		        	ctx.closePath();
		        	ctx.stroke();
		        }
		        ctx.restore();
		    }
	
		    //Lets first create a generic function to paint cells
		    function paint_cell(x, y){
		    	ctx.fillStyle = "#AEC6CF";
		    	ctx.fillRect(x*cw, y*cw, cw, cw);
		    	ctx.strokeStyle = "white";
		    	ctx.strokeRect(x*cw, y*cw, cw, cw);
		    }
	
		    function paint_food(x, y, v){
		    	ctx.fillStyle = "#77dd77";
		    	ctx.fillRect(x*cw, y*cw, cw, cw);
		    	ctx.strokeStyle = "white";
		    	ctx.strokeRect(x*cw, y*cw, cw, cw);
		    	ctx.fillStyle = "white";
		    	ctx.font="30px Arial";
		    	if(v>9)
		    		ctx.fillText(v, x*cw+7,y*cw+38);		
		    	else
		    		ctx.fillText(v, x*cw+22, y*cw+38);
		    }
	
		    function reset(){
		    	run = false;
		    	$('#myModal').modal('show');
		    	$('#scoreDisplay').text("Your score was: "+score);		    	
		    }
	
		

};

app.initialize();
# WORKFLOW

1. Create player with position and functions to draw the ball and update it
2. Provide gravity and add it to y velocity whenever the ball is not in bottom edge
3. Give controls using arrows using event listeners(keyup and keydown)
4. Handle platform collisions. When ball is on a platform it should not fall
5. Make platforms and ball scroll up by giving them a vertical velocity
6. Create platforms using a for loop and have a variable to track y-coordinate and increment it on each iteration of loop so that one platform is spawned below the other.
7. Life system:- Either hitting spikes or falling down would cost 1 life and we reset the position of ball on each death by changing its position and creating a new platform at that position

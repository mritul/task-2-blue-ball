# WORKFLOW

1. Create player with position and functions to draw the ball and update it
2. Provide gravity and add it to y velocity whenever the ball is not in bottom edge
3. Give controls using arrows using event listeners(keyup and keydown)
4. Handle platform collisions. When ball is on a platform it should not fall
5. Make platforms and ball scroll up by giving them a vertical velocity
6. Create platforms using a for loop and have a variable to track y-coordinate and increment it on each iteration of loop so that one platform is spawned below the other.
7. Life system:- Either hitting spikes or falling down would cost 1 life and we reset the position of ball on each death by changing its position and creating a new platform at that position
8. For spawning healthpacks:
   - First make a class for healthpack and draw a green circle as the pack
   - Every 20 platforms generated, a pack is spawned. So, push a healthpack class instance into the array healthpacks after generation of 20 platforms in the for loop.
   - The coordinates of the pack would be such that it is on top of the 20th platform that is generated
   - Do not forget to give a scroll velocity to healthpack too
   - Now, for collision detection of packs with the player ball, use simple math:
   - First see in horizontal axis... If y coordinates of the centers of healthpack and ball are same, start checking for collisions on the horizontal ends of the ball and if x coordinates of the centers of the balls are equal, then start checking for collisions on the y axis
   - To check for collision, use the mathematical fact that if the absolute distance between centers of two circles is less than the sum of radii of the two circles, that means they have collided. - So, immediately increase the lives by 1, remove the healthpack that has collided from the healthpacks array and then change innerHTML of the lives text.
9. Finally replace the circle we draw as ctx.draw() with draw Image and give it a width and height equals the radius of circle we used before(20). It will work the same in the end(collision detection,etc)

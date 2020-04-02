# js-game
1. A square we can move with left and right arrows
2. The square moves N cells down each second.
Don't use timeout/interval, we'd like to keep all movement logic in a single place. Keep y coordinate as a floating point, increment with a step during each update, check with Math.floor.
3. The square stops when bottom is reached or existing block is hit (introduce board)
4. A full row is removed from board.
5. Block can have different shape, it's randomly chosen on spawn.
6. Block can be rotated.
7. The square can be rapidly moved down using the down arrow.
8. Game finishes when top is touched.
9. Extras
- Show score
- Add sounds
- Show next piece
10. Optimization
- Only redraw what's changed on the screen
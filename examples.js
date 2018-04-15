var routes = require('./index.js')('AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7');


console.log(`Output #1: ${routes.find_exact_route('A', 'B', 'C').distance()}`);


console.log(`Output #2: ${routes.find_exact_route('A', 'D').distance()}`);


console.log(`Output #3: ${routes.find_exact_route('A', 'D', 'C').distance()}`);

console.log(`Output #4: ${routes.find_exact_route('A', 'E', 'B', 'C', 'D').distance()}`);


console.log(`Output #5: ${routes.find_exact_route('A', 'E', 'D')}`);


console.log(`Output #6: ${routes.find_routes('C', 'C', 3).length}`);


console.log(`Output #7: ${routes.find_routes_with_stops__count('A', 'C', 4).length}`);


console.log(`Output #8: ${routes.find_shortest_route('A', 'C').distance()}`);


console.log(`Output #9: ${routes.find_shortest_route('B', 'B').distance()}`);


console.log(`Output #10: ${routes.find_routes_less_than('C', 'C', 30).length}`);
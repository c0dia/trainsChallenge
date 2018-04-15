module.exports = function(routes_to_map) {
	var routes = {},
		cities = {};
	no_route = {
		stops: function() {
			return 0;
		},
		toString: function() {
			return 'NO SUCH ROUTE';
		}
	};

	routes_to_map = routes_to_map || '';

	routes.find_routes = function(origin, destination, max_stops) {
		destination = routes.city(destination);
		return routes.find_routes_from(origin, max_stops).filter(function(route) {
			return route.final_destination() === destination;
		});
	};

	routes.find_routes_with_stops__count = function(origin, destination, stops__count) {
		return routes.find_routes(origin, destination, stops__count).filter(function(route) {
			return route.stops() === stops__count;
		});
	};

	routes.find_shortest_route = function(origin, destination) {
		return routes.find_routes(origin, destination).reduce(function(route1, route2) {
			if (route1.distance() < route2.distance()) return route1;
			return route2;
		}, {
			distance: function() {
				return 999999;
			}
		});
	};

	routes.find_routes_less_than = function(origin, destination, max_distance) {
		return routes.find_routes(origin, destination).filter(function(route) {
			return route.distance() < max_distance;
		});
	};

	routes.find_routes_from = function(origin, max_stops) {
		max_stops = max_stops || 10;
		return routes.city(origin).all_routes(max_stops);
	};

	routes.find_exact_route = function() {
		var args = Array.prototype.slice.call(arguments);
		var route_cities = args.map(function(name) {
			return routes.city(name);
		});
		origin = route_cities[0];
		return origin.exact_route_to(route_cities.slice(1)) || no_route;
	};

	routes.route = function(origin, destination, distance) {
		var route = {},
			endpoint = {};

		endpoint.stops = function() {
			return 0;
		};
		endpoint.distance = function() {
			return 0;
		};
		endpoint.origins = function() {
			return '';
		};
		endpoint.final_destination = function() {
			return null;
		};
		endpoint.toString = function() {
			return 'end of the line';
		};

		route.origin = origin;
		route.destination = destination;

		route.stops = function() {
			return 1 + endpoint.stops();
		};

		route.distance = function() {
			return endpoint.distance() + distance;
		};

		route.connect_to = function(connecting_route) {
			if (connecting_route !== null) {
				endpoint = connecting_route;
			}
			return route;
		};

		route.origins = function() {
			return route.origin.toString() + endpoint.origins();
		};

		route.final_destination = function() {
			return endpoint.final_destination() || route.destination;
		};

		route.toString = function() {
			return route.origins() + route.final_destination().toString() + route.distance().toString();
		};

		return route;
	};

	routes.city = function(name) {
		var found = cities[name];
		if (found === undefined) {
			found = city(name);
			cities[name] = found;
		}
		return found;
	};

	var city = function(name) {
		var city = {},
			endpoints = {};

		city.name = name;

		function build_route(origin, endpoint) {
			return routes.route(origin, endpoint.city, endpoint.distance);
		}

		city.add_endpoint = function(endpoint) {
			endpoints[endpoint.city] = endpoint;
		};

		city.toString = function() {
			return city.name;
		};

		city.all_routes = function(max_stops, stops__count) {
			max_stops = max_stops || 10;
			stops__count = stops__count || 1;
			if (stops__count > max_stops) return [];
			return city.build_connecting_routes(max_stops, stops__count + 1);
		};

		city.build_connecting_routes = function(max_stops, stops__count) {
			var found = [],
				endpoint, connecting_routes;
			Object.keys(endpoints).forEach(function(key) {
				endpoint = endpoints[key];
				found.push(build_route(city, endpoint));
				endpoint.city.all_routes(max_stops, stops__count).forEach(function(connecting_route) {
					found.push(build_route(city, endpoint).connect_to(connecting_route));
				});
			});
			return found;
		};

		city.exact_route_to = function(destinations) {
			var endpoint = endpoints[destinations[0]],
				route = null;
			if (endpoint !== undefined) {
				route = build_route(city, endpoint);
				route = city.build_endpoint_to(route, destinations.slice(1));
			}
			return route;
		};

		city.build_endpoint_to = function(route, remaining_destinations) {
			if (remaining_destinations.length < 1) return route;
			if (route.destination.connects_to(remaining_destinations[0])) {
				return route.connect_to(route.destination.exact_route_to(remaining_destinations));
			}
			return null;
		};

		city.connects_to = function(other_city) {
			return endpoints[other_city] !== undefined;
		};

		return city;
	};

	(function(routes_to_map) {
		var pattern = /[a-zA-Z]{2}\d/g;
		routes_to_map.match(pattern).forEach(function(route) {
			var origin = routes.city(route.charAt(0)),
				destination = routes.city(route.charAt(1)),
				distance = parseInt(route.charAt(2), 10);
			origin.add_endpoint({
				city: destination,
				distance: distance
			});
		});
	})(routes_to_map);

	return routes;
};

Object.keys = function(obj) {
	var array = new Array();
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			array.push(prop);
		}
	}
	return array;
};
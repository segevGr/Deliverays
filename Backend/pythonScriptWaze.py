
import sys
import networkx as nx
import WazeRouteCalculator

myList = sys.argv[2].split("|")
myList = list(dict.fromkeys(myList)) # remove duplicates
unreachable = []

def createGraph(addressList):
    graph = nx.Graph()
    graph.add_nodes_from(addressList)

    for i in addressList:
        from_address = i
        for j in addressList[addressList.index(i):]:
            to_address = j
            if i == j:
                continue
            route = WazeRouteCalculator.WazeRouteCalculator(from_address, to_address, 'IL')
            minutes = route.calc_route_info()[0] # minutes between nodes
            # km = route.calc_route_info()[1] # distance between nodes
            graph.add_edge(i, j, weight=float("%.2f" % minutes))
    return graph

def greedy_algorithm(graph, start_node, weight_limit):
    path = [start_node] # Store the selected path, and track the visited nodes
    current_weight = 0
    current_node = start_node 

    while current_weight <= weight_limit:
        next_node = None
        min_weight = float('inf')

        # Find the next unvisited node with the minimum edge weight
        for neighbor, edge_data in graph[current_node].items():
            if neighbor not in path:
                weight = edge_data['weight']
                if weight < min_weight:
                    min_weight = weight
                    next_node = neighbor
                else:
                    unreachable.append(neighbor)
        
        # If there are no unvisited neighbors, the algorithm terminates
        if next_node is None:
            break

        # Move to the next node
        current_weight += min_weight
        if current_weight <= weight_limit:
            path.append(next_node)
            current_node = next_node

    return path, current_weight


starting_node = myList[0]  # Assuming string node labels
weight_limit = int(float(sys.argv[1]) * 60) # working time is received in hours, while route is calculated in minutes

graph = createGraph(myList)
route, route_weight = greedy_algorithm(graph, starting_node, weight_limit)
# Total_weight = sum(graph[u][v]['weight'] for u, v in graph.edges) # total weight of the graph

result = ''
unreachable = list(dict.fromkeys(unreachable)) # remove duplicates

for node in route:
    result += "|" + node
result += "|" + str(route_weight)
resultEncoded = result.encode("UTF-8")
sys.stdout.buffer.write(resultEncoded)

#sys.stdout.reconfigure(encoding='utf-16')

sys.stdout.flush()
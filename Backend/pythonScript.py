
import sys
import networkx as nx
import requests
from geopy.geocoders import Nominatim
import json
from datetime import datetime
import time

myList = sys.argv[2].split("|")
myList = list(dict.fromkeys(myList)) # remove duplicates
unreachable = []

def createGraph(addressList, weight_limit):
    graph = nx.Graph()
    graph.add_nodes_from(addressList)

    for i in addressList:
        json_data = get_travel_time(addressList, i, weight_limit)
        if json_data is None:
            continue

        try:
            for j in json_data["results"][0]["locations"]:
                if i == j["id"]: # same address
                    continue
                
                graph.add_edge(i, j["id"], weight= j["properties"][0]["travel_time"]) # return travel time from i to j. can change to "distance"
        except: #incase python crash
            resultEncoded = (str(json_data)).encode("UTF-8")
            sys.stdout.buffer.write(resultEncoded)
            sys.stdout.flush()
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
        
        # If there are no unvisited neighbors, the algorithm terminates
        if next_node is None:
            break

        # Move to the next node
        current_weight += min_weight
        if current_weight <= weight_limit:
            path.append(next_node)
            current_node = next_node

    return path, current_weight

def get_lan_lat(address):
    key = "39986966c86840049f4e10cb99853648"
    response = requests.get('https://api.opencagedata.com/geocode/v1/json?q={}&key={}&language=he&pretty=1'.format(address, key))
    time.sleep(1.01) # must wait 1 second between API requests
    resp_json_payload = response.json()
    
    if resp_json_payload["total_results"] == 0:
        unreachable.append(address)
        return "empty"
    else:
        coords = resp_json_payload["results"][0]["geometry"]
        lat, lng = coords["lat"], coords["lng"]
        
        json = {
                "id": address,
                "coords": {
                  "lat": lat,
                  "lng": lng
                }
               }
        return json
    
def get_travel_time(addressList, starting_node, weight_limit):    
    cordsList = []
    for i in addressList:
        coords = get_lan_lat(i)
        if coords == "empty":
            continue
        else:
            cordsList.append(get_lan_lat(i))
    if starting_node in unreachable:
        return None
    
    x = time.time()
    date_time = datetime.fromtimestamp(x)
    str_date_time = date_time.strftime("%Y-%m-%dT%H:%M:%SZ")
    
    data_json = {
          "locations": cordsList,
          "departure_searches": [
            {
              "id": "One-to-many Matrix",
              "departure_location_id": starting_node,
              "arrival_location_ids": [i for i in addressList if i not in unreachable],
              "departure_time": str_date_time,
              "travel_time": weight_limit,
              "properties": [
                "travel_time",
                "distance"
              ],
              "transportation": {
                "type": "driving"
              }
            }
          ]
        }

    payload = json.loads(json.dumps(data_json))
    
    headers = {'X-Application-Id':'b6b1aab0',
               'X-Api-Key':'e2cfb4987a78e195db29ff491fdf30fc'} # auth tokens for API requests
    response = requests.post('https://api.traveltimeapp.com/v4/time-filter', json=payload, headers=headers) # url, json payload and headers to send

    resp_json_payload = response.json()
    return resp_json_payload

  
starting_node = myList[0]  # Assuming string node labels
weight_limit = int(float(sys.argv[1]) * 60 * 60) # working time is received in hours, while route is calculated in seconds

graph = createGraph(myList, weight_limit)
route, route_weight = greedy_algorithm(graph, starting_node, weight_limit)
# Total_weight = sum(graph[u][v]['weight'] for u, v in graph.edges) # total weight of the graph

result = ''
unreachable = list(dict.fromkeys(unreachable)) # remove duplicates

for node in route:
    result += "|" + node
result += "|" + str(route_weight/60) + "~" + "^".join(unreachable)
resultEncoded = result.encode("UTF-8")

sys.stdout.buffer.write(resultEncoded)
sys.stdout.flush()

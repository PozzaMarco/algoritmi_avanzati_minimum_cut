import createGraphsFromFile from "./typecript_files/read_file_methods"
import {karger} from "./typecript_files/karger";

let graphList = createGraphsFromFile();
let graph = graphList[3];

console.log("Optimal cut: " + graph.getOptimalCut());
console.log("Random cut: " + karger(graph, 1));
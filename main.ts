import createGraphsFromFile from "./typecript_files/read_file_methods"
import {karger} from "./typecript_files/karger";


let graphList = createGraphsFromFile();
let graph = graphList[1];
let randomCut, kargerTime, fcTime, discoveryTime;

[randomCut, kargerTime, fcTime, discoveryTime] = karger(graph,3)
console.log("TotalTime: " + kargerTime/1000);
console.log("FullContraction mean time: " + fcTime/1000);
console.log("Discvery Time: " + discoveryTime/1000);
console.log("Random cut: " + randomCut);
console.log("Optimal cut: " + graph.optimalCut)
console.log("Error: " + (randomCut-graph.optimalCut)/graph.optimalCut);


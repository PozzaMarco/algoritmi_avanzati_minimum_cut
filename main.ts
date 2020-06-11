import fs from "fs";
import createGraphsFromFile from "./typecript_files/read_file_methods"
import {karger} from "./typecript_files/karger";


let graphList = createGraphsFromFile();

//──── Karger per minCut ────────────────────────────────────────────────
for(let index = 0; index < 12; index++){
    let randomCut, kargerTime, fullContractionTime, discoveryTime, numberOfRepetitions;
    let d_constant = 3;
    let graph = graphList[index];

    console.log("Processando: " + graph.getName() + " " + (index+1) + "/" + graphList.length);

    [randomCut, kargerTime, fullContractionTime, discoveryTime, numberOfRepetitions] = karger(graph,d_constant);

    let content = 
    `${index + 1}) ${graph.getName()}
    Total time: ${kargerTime/1000} s
    Constant d: ${d_constant}
    Number of repetitions required: ${numberOfRepetitions}
    FullContraction AVG time: ${fullContractionTime/1000} s
    Discovery time: ${discoveryTime/1000} s
    Karger cut: ${randomCut}
    Optimal cut: ${graph.getOptimalCut()}
    Error: ${(randomCut-graph.getOptimalCut())/graph.getOptimalCut()} %
    ------------------
    `
    writeOnFile("karger_results", content);
}

async function writeOnFile(fileName: string, text: string){
    await fs.appendFile(fileName+".txt", text+"\r\n", function(err) {
        if (err)
            return console.error(err);  
    });
}
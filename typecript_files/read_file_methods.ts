//========================================================================================
/*                                                                                      *
 * Metodi utilizzati per la lettura e gestione delle informazioni che compongono        *
 * il dataset di grafi reso disponibile in formato .txt.                                *
 *                                                                                      */
//========================================================================================
import fs from "fs";
import Graph from "./graph";

//──── Methods ───────────────────────────────────────────────────────────────────────────
function getInputFileName(): Array<string> {
  let fileNameList: Array<string> = new Array();

  fs.readdirSync("dataset/input/").forEach((fileName) => {
    fileNameList.push(fileName);
  });
  return fileNameList;
}
function getOutputFileName(): Array<string> {
  let fileNameList: Array<string> = new Array();

  fs.readdirSync("dataset/output/").forEach((fileName) => {
    fileNameList.push(fileName);
  });
  return fileNameList;
}

function createGraphsFromFile() {
  let inputFileName = getInputFileName();
  let outputFileName = getOutputFileName();
  let graphList = new Array<Graph>();

  for(let index = 0; index < inputFileName.length; index++){

    let graphInputValues = fs.readFileSync(
        "dataset/input/" + inputFileName[index],
        "utf8"
      );

      let graphOutputValues = fs.readFileSync(
        "dataset/output/" + outputFileName[index],
        "utf8"
      );
      
      let graph = new Graph();
      graph.setName(inputFileName[index].substring(0, inputFileName[index].length - 4));
      graph.createGraph(graphInputValues);
      graph.setOptimalCut(parseInt(graphOutputValues));
      
      graphList.push(graph);
  }
    
  return graphList;
}

export default createGraphsFromFile
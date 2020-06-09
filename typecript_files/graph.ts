//========================================================================================
/*                                                                                      *
 * Modella le liste di adiacenza che rappresentano i singoli grafi.                     *
 * Oltre alla lista di adiacenza vera e propria, teniamo traccia anche del              *
 * numero di nodi e di archi nel grafo                                                  *
 *                                                                                      */
//========================================================================================
import Edge from "./edge";
import { indexOf } from "core-js/fn/array";

export default class Graph {
  name: string;
  numberOfNodes: number;
  numberOfEdges: number;
  adjacencyList: Map<string, string[]>;
  edgeList: Array<Edge>;
  optimalCut: number;

  constructor() {
    this.name = "";
    this.numberOfEdges = this.numberOfNodes = 0;
    this.adjacencyList = new Map<string, string[]>();
    this.edgeList = new Array<Edge>();
    this.optimalCut = Infinity;
  }

  setName(graphName: string){
    this.name = graphName;
  }

  getName(): string{
    return this.name;
  }
  
  getNumberOfNodes(): number {
    return this.numberOfNodes;
  }

  getNumberOfEdges(): number {
    return this.numberOfEdges;
  }

  getList(): Map<string, string[]> {
    return this.adjacencyList;
  }

  getEdges(): Array<Edge> {
    return this.edgeList;
  }

  setOptimalCut(optimalCut: number){
      this.optimalCut = optimalCut;
  }

  getOptimalCut(): number{
      return this.optimalCut;
  }

  weightBetween(firstNode: string, secondNode: string): number {
    let minWeight = Infinity;
    let found : boolean = false;

    for(let index = 0; index < this.numberOfEdges && !found; index++){
      if(this.edgeList[index].equalToNodes(firstNode,secondNode)){
        minWeight = this.edgeList[index].weight;
        found = true;
      }
    }

    return minWeight
  }

  //Controllo se c'è un lato che connette due nodi
  areNodeConnected(firstNode: string, secondNode: string): boolean {
    return this.weightBetween(firstNode, secondNode) != Infinity ? true : false;
  }
  
  addToAdjacencyList(node: string, adjacentNode: string) {
    if (!this.adjacencyList.has(node))
      //Se il nodo non è presente nella lista di adiacenza
      this.adjacencyList.set(node, []); // aggiungo il muovo nodo

    //Aggiungo un nuovo nodo alla lista di adiacenza
    //if(!this.adjacencyList.get(node).includes(adjacentNode))
      this.adjacencyList.get(node).push(adjacentNode);
  }

  createGraph(graphDescription: string) {
    //Divido graphDescription per righe e itero per creare la lista di adiacenza
    let descriptionLines = graphDescription.split("\n");

    descriptionLines.forEach((line) => {
      let nodeValues = line.split(" "); //Divido le linee in singoli valori
      
      if (!isNaN(parseInt(nodeValues[0]))) {
        for(let index = 1; index < nodeValues.length; index++){
            this.addToAdjacencyList(nodeValues[0], nodeValues[index]);

            let newEdge = new Edge();
            newEdge.createNewEdge(nodeValues[0], nodeValues[index],1);
            this.insertNewEdge(newEdge);
        }
      }
    });
    this.numberOfEdges = this.edgeList.length;
    this.numberOfNodes = this.adjacencyList.size;
  }

  getAdjacentNodesOf(node: string): string[] {
    let adjacentNodeList: string[] = [];

    if (this.adjacencyList.has(node))
      adjacentNodeList = this.adjacencyList.get(node);

    return adjacentNodeList;
  }

  getGraphTotalWeight(): number{
    let totalWeight : number = 0;

    this.edgeList.forEach(edge => {
      totalWeight += edge.weight;
    });

    return totalWeight;
  }

  insertNewEdge(newEdge: Edge){
      this.edgeList.push(newEdge);
  }

  deleteNode(node: string){
      //Operazioni su liste di adiacenza
      this.adjacencyList.delete(node); // rimuovo la lista di adiacenza del nodo

      this.adjacencyList.forEach(nodeAdjList => { // rimuovo il nodo dalle liste di adiacenza degli altri nodi
        let index = nodeAdjList.indexOf(node);

        while(index != -1){
          nodeAdjList.splice(index, 1);
          index = nodeAdjList.indexOf(node);
        }
        
      });
    
      //Operazioni su lista di lati
      for(let index = 0; index < this.edgeList.length; index++){
          if(this.edgeList[index].contains(node)){
            this.edgeList.splice(index, 1);
            index = index-1;
          }
      }

      this.numberOfEdges = this.edgeList.length;
      this.numberOfNodes = this.adjacencyList.size;
  }
  
  addNewNode(newNode: string, newAdjList: string[]){
      this.adjacencyList.set(newNode, newAdjList); // aggiungo il nuovo nodo e la nuova lista di adiacenza

      newAdjList.forEach(element => {
          this.addToAdjacencyList(element, newNode); // aggiungo il nuovo nodo alle liste di adiacenza degli altri elementi (element)

          let newEdge = new Edge();
          newEdge.createNewEdge(element, newNode, 1); // creo i lati tra newNode e gli altri elementi
          this.insertNewEdge(newEdge);
      });

      this.numberOfNodes = this.adjacencyList.size;
      this.numberOfEdges = this.edgeList.length;

  }
}

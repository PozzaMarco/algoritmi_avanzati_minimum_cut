//========================================================================================
/*                                                                                      *
 * Modella le liste di adiacenza che rappresentano i singoli grafi.                     *
 * Oltre alla lista di adiacenza vera e propria, teniamo traccia anche del              *
 * numero di nodi e di archi nel grafo                                                  *
 *                                                                                      */
//========================================================================================
import Edge from "./edge";

export default class Graph {
  name: string;
  numberOfNodes: number;
  numberOfEdges: number;
  adjacencyList: Map<number, number[]>;
  edgeList: Array<Edge>;
  optimalCut: number;

  constructor() {
    this.name = "";
    this.numberOfEdges = this.numberOfNodes = 0;
    this.adjacencyList = new Map<number, number[]>();
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

  getList(): Map<number, number[]> {
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

  weightBetween(firstNode: number, secondNode: number): number {
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
  areNodeConnected(firstNode: number, secondNode: number): boolean {
    return this.weightBetween(firstNode, secondNode) != Infinity ? true : false;
  }
  
  getSortedWeights(): Array<Edge> {
    return this.edgeList.sort(//Ordino l'array di lati usando i pesi
      (a: Edge, b: Edge) => a.getWeight() - b.getWeight()
    );
  }

  addToAdjacencyList(node: number, adjacentNode: number) {
    if (!this.adjacencyList.has(node))
      //Se il nodo non è presente nella lista di adiacenza
      this.adjacencyList.set(node, []); // aggiungo il muovo nodo

    //Aggiungo un nuovo nodo alla lista di adiacenza
    if(!this.adjacencyList.get(node).includes(adjacentNode))
      this.adjacencyList.get(node).push(adjacentNode);
  }

  createGraph(graphDescription: string) {
    //Divido graphDescription per righe e itero per creare la lista di adiacenza
    let descriptionLines = graphDescription.split("\n");

    descriptionLines.forEach((line) => {
      let nodeValues = line.split(" "); //Divido le linee in singoli valori
      
      if (!isNaN(parseInt(nodeValues[0]))) {
        for(let index = 1; index < nodeValues.length; index++){
            this.addToAdjacencyList(parseInt(nodeValues[0]), parseInt(nodeValues[index]));

            let newEdge = new Edge();
            newEdge.createNewEdge(parseInt(nodeValues[0]), parseInt(nodeValues[index]),1);
            this.insertNewEdge(newEdge);
        }
      }
    });
    this.numberOfEdges = this.edgeList.length;
    this.numberOfNodes = this.adjacencyList.size;
  }

  getAdjacentNodesOf(node: number): number[] {
    let adjacentNodeList: number[] = [];

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
    let found : boolean = false;

    //Itero su tutti i lati dell'array
    for(let index = 0; index < this.edgeList.length && !found; index++){
      //Se il lato è già presente e il nuovo lato ha peso minore, allora aggiorno solamente il peso
      if(newEdge.equalTo(this.edgeList[index]) && newEdge.isLighter(this.edgeList[index])){
        this.edgeList[index].weight = newEdge.weight;
        found = true;
      }
    }
    //Se il lato non è presente lo aggiungo
    if(!found)
      this.edgeList.push(newEdge);
  }
}

//========================================================================================
/*                                                                                      *
 * Implementazione dell'algoritmo randomico di Karger insieme a varie                   *
 * funzioni di utility.                                                                 *
 *                                                                                      */
//========================================================================================

import Graph from "./graph";
import Edge from "./edge";
import {performance} from "perf_hooks";

function karger(graph: Graph, d_constant: number): [number, number, number, number, number]{
    let fullContractionTime = 0; // fullContraction viene fatto k volte quindi il tempo ritornato è la media su tutti i tempi di fullContraction
    let kargerStartingTime = 0;
    let discoveryTime = 0;
    let minCut = Infinity;

    let k = optimal_k(graph.getNumberOfNodes(), d_constant);
    kargerStartingTime = performance.now();

    [minCut, fullContractionTime, discoveryTime] = karger_impl(graph, k);

    return [minCut, performance.now() - kargerStartingTime, fullContractionTime, discoveryTime, k];
}

function karger_impl(graph: Graph, repetitions: number): [number, number, number]{
    let minCut = Infinity;
    let fullContractionTotalTime = 0;
    let discoveryTime = 0;
    let discoveryStartingTime = performance.now();
    let startingTime = performance.now();

    if(performance.now() - startingTime < 200000){//Timer che limita le iterazioni a circa 3 minuti
        for(let repeat = 0; repeat < repetitions; repeat++){

            let fullContractionStartingTime = performance.now();
            let cut = fullContraction(graph);
            fullContractionTotalTime += performance.now() - fullContractionStartingTime;

            if(cut < minCut){
                minCut = cut;
                discoveryTime = performance.now() - discoveryStartingTime;
            }
        }
    }
    return [minCut, fullContractionTotalTime/repetitions, discoveryTime];
}

function fullContraction(graph: Graph): number{
    let contractedGraph : Graph = graph.makeCopy(); //Creo una copia dell'oggetto

    while(contractedGraph.getNumberOfNodes() > 2){
        let edge = randomEdge(contractedGraph.getEdges());
        contractedGraph = contraction(contractedGraph, edge);
    }

    return contractedGraph.getEdges().length;
}

function contraction(graph: Graph, edge: Edge): Graph{
    let firstNode, secondNode: string;

    [firstNode, secondNode] = edge.getNodes();
    //recupero le liste di adiacenza dei due nodi scelti
    let firstADJ = graph.getAdjacentNodesOf(firstNode);
    let secondADJ = graph.getAdjacentNodesOf(secondNode);
    
    //rimuovo tutte le occorrenze di secondNode da firstADJ e firstNode da secondADJ
    firstADJ = removeFrom(firstADJ, secondNode);
    secondADJ = removeFrom(secondADJ, firstNode);

    //elimino tutte le relazioni di firstNode e secondNode presenti nel grafo.
    //elimino quindi tutti i lati che contengono firstNode/secondNode ed elimino dalle liste di adiacenza tutte le occorrenze di firstNode e secondNode
    graph.deleteNode(firstNode);
    graph.deleteNode(secondNode)

    //creo il nuovo nodo e la sua nuova lista di adiacenza
    let newNode = firstNode + "," + secondNode;
    //questa lista di adiacenza non contiene nessun lato firstNode-secondNode perchè li ho eliminati prima con removeFrom
    let adjList = firstADJ.concat(secondADJ);

    //aggiungo al grafo il nuovo nodo e la lista di adiacenza.
    //questa operazione preve anche che ogni nodo che era precedentemente connesso con firstNode e/o secondNode ora venga connesso con newNode.
    //tutti i lati che avevano o firstNode o secondNode (non entrambi perchè sono stati eliminati) ora contengono newNode al loro posto.
    graph.addNewNode(newNode, adjList);

    return graph;
}

function randomEdge(edgeList: Array<Edge>): Edge{
    return edgeList[Math.floor(Math.random() * edgeList.length)];
}

//========================================================================================
/*                                                                                      *
 * Funzione che calcola il numero "k" di volte in cui far ripetere l'algoritmo di Karger*
 * Il numero di ripetizioni ottimale dipende dal numero di nodi del grafo e dalla costant*
 * "d" che vogliamo avere nella formula 1/n^d                                           *
 *                                                                                      */
//========================================================================================

function optimal_k(numberOfNodes: number, d_constant: number): number{
    let d = d_constant;
    let n = numberOfNodes;

    return Math.ceil(d * Math.pow(n, 2) / 2 * Math.log(n));
}

function removeFrom(list: string[], element: string): string[]{
    let index = list.indexOf(element);

    while(index != -1){
        list.splice(index, 1);
        index = list.indexOf(element);
    }

    return list
}

export{
    karger
};
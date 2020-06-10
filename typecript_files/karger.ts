//========================================================================================
/*                                                                                      *
 * Implementazione dell'algoritmo randomico di Karger insieme a varie                   *
 * funzioni di utility.                                                                 *
 *                                                                                      */
//========================================================================================

import Graph from "./graph";
import Edge from "./edge";
import {performance} from "perf_hooks";

function karger(graph: Graph, d_constant: number): [number, number, number, number]{
    let FCTime = Infinity; // tempo impiegato da fullContraction. Siccome viene fatto K volte allora ritorno la media
    let KTime = Infinity; // tempo impiegato da Karger
    let DTime = Infinity; // discovery time per trovare il mincut
    let minCut = Infinity;

    let k = optimal_k(graph.getNumberOfNodes(), d_constant);
    KTime  = performance.now();

    [minCut, FCTime, DTime] = karger_impl(graph, k);

    return [minCut, performance.now() - KTime, FCTime, DTime];
}

function karger_impl(graph: Graph, repetitions: number): [number, number, number]{
    let minCut = Infinity;
    let meanFCTime = 0;
    let DTime = 0;
    let startDTime = performance.now();

    for(let repeat = 0; repeat < repetitions; repeat++){
        let startFCTime = performance.now();
        let cut = fullContraction(graph);
        meanFCTime += performance.now() - startFCTime;

        if(cut < minCut){
            minCut = cut;
            DTime = performance.now() - startDTime;
        }
    }

    return [minCut, meanFCTime/repetitions, DTime];
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
    let firstADJ = graph.getAdjacentNodesOf(firstNode);
    let secondADJ = graph.getAdjacentNodesOf(secondNode);
    
    firstADJ = removeFrom(firstADJ, secondNode);
    secondADJ = removeFrom(secondADJ, firstNode);

    //elimino tutte le relazioni di firstNode e secondNode (sia lista di adiacenza che lati)
    graph.deleteNode(firstNode);
    graph.deleteNode(secondNode)

    //creo il nuovo nodo e la sua nuova lista di adiacenza
    let newNode = firstNode + "," + secondNode;
    let adjList = firstADJ.concat(secondADJ);

    //aggiungo il nuovo nodo e la sua nuova lista di adiacenza (anche relazioni sui lati)
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
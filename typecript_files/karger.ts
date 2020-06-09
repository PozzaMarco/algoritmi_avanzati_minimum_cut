//========================================================================================
/*                                                                                      *
 * Implementazione dell'algoritmo randomico di Karger insieme a varie                   *
 * funzioni di utility.                                                                 *
 *                                                                                      */
//========================================================================================

import Graph from "./graph";
import Edge from "./edge";

function karger(graph: Graph, d_constant: number): number{
    let k = optimal_k(graph.getNumberOfNodes(), d_constant);
    let minCut = karger_impl(graph, k);

    return minCut;
}

function karger_impl(graph: Graph, repetitions: number): number{
    let minCut = Infinity;

    for(let repeat = 0; repeat < repetitions; repeat++){
        let cut = fullContraction(graph);
        
        if(cut < minCut)
            minCut = cut;
    }

    return minCut;
}

function fullContraction(graph: Graph): number{
    let numberOfNodes = graph.getNumberOfNodes();
    let contractedGraph: Graph = graph;

    for(let node = 0; node != numberOfNodes - 2; node++){
        let edge = randomEdge(contractedGraph.getEdges());
        contractedGraph = contraction(contractedGraph, edge);
        console.log(contractedGraph.getEdges())
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
    let newNode = firstNode + "_" + secondNode;
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
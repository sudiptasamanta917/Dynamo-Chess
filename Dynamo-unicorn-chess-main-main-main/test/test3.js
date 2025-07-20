class TrieNode {
    constructor() {
      this.children = {}; // Map of child nodes
      this.isEndOfWord = false; // Indicates the end of a valid key
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode(); // Root node of the Trie
    }
  
    // Insert a key into the Trie
    insert(key) {
      let node = this.root;
  
      for (let char of key) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
  
    // Search for a key in the Trie
    search(key) {
      let node = this.root;
  
      for (let char of key) {
        if (!node.children[char]) {
          return false;
        }
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
  
    // Search for keys with a given prefix
    startsWith(prefix) {
      let node = this.root;
  
      for (let char of prefix) {
        if (!node.children[char]) {
          return false;
        }
        node = node.children[char];
      }
      return true;
    }
  }
  
  // Example Usage
  const trie = new Trie();
  
  trie.insert("apple");
  trie.insert("app");
  trie.insert("bat");
  trie.insert("ball");
  console.log("trie----------------------");
  
  console.log(trie.search("apple")); // Output: true
  console.log(trie.search("app"));   // Output: true
  console.log(trie.search("appl"));  // Output: false
  console.log(trie.startsWith("bat")); // Output: true
  console.log(trie.startsWith("ba"));  // Output: true
  console.log(trie.startsWith("b")); // Output: false
  

  class FenwickTree {
    constructor(size) {
      this.size = size;
      this.tree = new Array(size + 1).fill(0); // 1-based indexing
    }
  
    // Update the Fenwick Tree by adding a value at a given index
    update(index, value) {
      while (index <= this.size) {
        this.tree[index] += value;
        index += index & -index; // Move to the next index in the tree
      }
    }
  
    // Query the Fenwick Tree to get the prefix sum from 1 to the given index
    query(index) {
      let sum = 0;
      while (index > 0) {
        sum += this.tree[index];
        index -= index & -index; // Move to the parent index in the tree
      }
      return sum;
    }
  
    // Range sum from left to right (inclusive)
    rangeSum(left, right) {
      return this.query(right) - this.query(left - 1);
    }
  }
  
  // Example Usage
  const fenwickTree = new FenwickTree(10);
  
  // Update the Fenwick Tree
  fenwickTree.update(1, 5);   // Add 5 to index 1
  fenwickTree.update(2, 3);   // Add 3 to index 2
  fenwickTree.update(3, 7);   // Add 7 to index 3
  console.log("fenwickTree---------------");
  
  console.log(fenwickTree.query(7)); // Output: 15 (5 + 3 + 7)
  console.log(fenwickTree.rangeSum(2, 3)); // Output: 10 (3 + 7)


  class Node {
    constructor(value) {
      this.value = value;
      this.next = null;
    }
  }
  
  class Queue {
    constructor() {
      this.front = null; // Reference to the front node
      this.rear = null;  // Reference to the rear node
      this.length = 0;   // Number of elements in the queue
    }
  
    // Add an element to the queue
    enqueue(value) {
      const newNode = new Node(value);
      if (this.isEmpty()) {
        this.front = newNode;  // If the queue is empty, the new node is the front
        this.rear = newNode;   // and the rear
      } else {
        this.rear.next = newNode; // Link the new node to the current rear
        this.rear = newNode;      // Update the rear to the new node
      }
      this.length++;
    }
  
    // Remove an element from the queue
    dequeue() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      const removedNode = this.front;
      this.front = this.front.next; // Move front to the next node
      this.length--;
  
      if (this.isEmpty()) {
        this.rear = null; // If the queue becomes empty, reset rear as well
      }
  
      return removedNode.value;
    }
  
    // Check if the queue is empty
    isEmpty() {
      return this.length === 0;
    }
  
    // Get the size of the queue
    size() {
      return this.length;
    }
  
    // Get the front element of the queue
    getFront() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.front.value;
    }
  
    // Print the queue elements
    printQueue() {
      let current = this.front;
      let result = '';
      while (current) {
        result += current.value + ' ';
        current = current.next;
      }
      console.log(result.trim());
    }
  }
  
  // Example Usage
  const queue = new Queue();
  
  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);
  queue.printQueue(); // Output: 10 20 30
  
  console.log("Queue------------------");
  
  console.log(queue.dequeue()); // Output: 10
  queue.printQueue(); // Output: 20 30
  
  console.log(queue.getFront()); // Output: 20
  console.log(queue.size()); // Output: 2
  console.log(queue.isEmpty()); // Output: false


  class Graph {
    constructor() {
      this.adjacencyList = {}; // Stores the graph as an adjacency list
    }
  
    // Add a vertex (node) to the graph
    addVertex(vertex) {
      if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
      }
    }
  
    // Add an edge (connection) between two vertices
    addEdge(vertex1, vertex2) {
      if (this.adjacencyList[vertex1]) {
        this.adjacencyList[vertex1].push(vertex2);
      }
      if (this.adjacencyList[vertex2]) {
        this.adjacencyList[vertex2].push(vertex1); // Comment this line for a directed graph
      }
    }
  
    // Remove an edge (connection) between two vertices
    removeEdge(vertex1, vertex2) {
      if (this.adjacencyList[vertex1]) {
        this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
          (v) => v !== vertex2
        );
      }
      if (this.adjacencyList[vertex2]) {
        this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
          (v) => v !== vertex1
        );
      }
    }
  
    // Remove a vertex (node) from the graph
    removeVertex(vertex) {
      while (this.adjacencyList[vertex].length) {
        const adjacentVertex = this.adjacencyList[vertex].pop();
        this.removeEdge(vertex, adjacentVertex);
      }
      delete this.adjacencyList[vertex];
    }
  
    // Depth-First Search (DFS)
    depthFirstSearch(start) {
      const result = [];
      const visited = {};
      const adjacencyList = this.adjacencyList;
  
      (function dfs(vertex) {
        if (!vertex) return null;
        visited[vertex] = true;
        result.push(vertex);
        adjacencyList[vertex].forEach((neighbor) => {
          if (!visited[neighbor]) {
            return dfs(neighbor);
          }
        });
      })(start);
  
      return result;
    }
  
    // Breadth-First Search (BFS)
    breadthFirstSearch(start) {
      const queue = [start];
      const result = [];
      const visited = {};
      let currentVertex;
  
      visited[start] = true;
  
      while (queue.length) {
        currentVertex = queue.shift();
        result.push(currentVertex);
  
        this.adjacencyList[currentVertex].forEach((neighbor) => {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
          }
        });
      }
  
      return result;
    }
  
    // Print the adjacency list
    printGraph() {
      for (let vertex in this.adjacencyList) {
        console.log(`${vertex} -> ${this.adjacencyList[vertex].join(', ')}`);
      }
    }
  }
  
  // Example Usage
  const graph = new Graph();
  
  graph.addVertex('A');
  graph.addVertex('B');
  graph.addVertex('C');
  graph.addVertex('D');
  graph.addVertex('E');
  graph.addVertex('F');
  
  graph.addEdge('A', 'B');
  graph.addEdge('A', 'C');
  graph.addEdge('B', 'D');
  graph.addEdge('C', 'E');
  graph.addEdge('D', 'E');
  graph.addEdge('D', 'F');
  graph.addEdge('E', 'F');
  
  graph.printGraph();
  // Output:
  // A -> B, C
  // B -> A, D
  // C -> A, E
  // D -> B, E, F
  // E -> C, D, F
  // F -> D, E
  
  console.log("Graph---------------");
  
  console.log(graph.depthFirstSearch('A'));
  // Output: ['A', 'B', 'D', 'E', 'C', 'F']
  
  console.log(graph.breadthFirstSearch('A'));
  // Output: ['A', 'B', 'C', 'D', 'E', 'F']
  
  
  console.log("Doubly linked list");
  
  class Node1 {
    constructor(value) {
      this.value = value;   // The data stored in the node
      this.next = null;     // Reference to the next node
      this.prev = null;     // Reference to the previous node
    }
  }
  
  class DoublyLinkedList {
    constructor() {
      this.head = null;     // Reference to the first node in the list
      this.tail = null;     // Reference to the last node in the list
      this.size = 0;        // Keeps track of the number of elements in the list
    }
  
    // Add a node at the end of the list
    append(value) {
      const newNode = new Node1(value);
  
      if (!this.head) {
        this.head = newNode;   // If the list is empty, make this node the head
        this.tail = newNode;   // Since there's only one node, it's also the tail
      } else {
        this.tail.next = newNode;   // Link the current tail to the new node
        newNode.prev = this.tail;   // Link the new node back to the current tail
        this.tail = newNode;        // Update the tail to be the new node
      }
  
      this.size++;
    }
  
    // Add a node at the beginning of the list
    prepend(value) {
      const newNode = new Node1(value);
  
      if (!this.head) {
        this.head = newNode;   // If the list is empty, make this node the head
        this.tail = newNode;   // Since there's only one node, it's also the tail
      } else {
        newNode.next = this.head;   // Link the new node to the current head
        this.head.prev = newNode;   // Link the current head back to the new node
        this.head = newNode;        // Update the head to be the new node
      }
  
      this.size++;
    }
  
    // Insert a node at a specific index
    insert(value, index) {
      if (index < 0 || index > this.size) {
        return null; // Index out of bounds
      }
  
      if (index === 0) {
        this.prepend(value); // Insert at the beginning
        return;
      }
  
      if (index === this.size) {
        this.append(value); // Insert at the end
        return;
      }
  
      const newNode = new Node1(value);
      let current = this.head;
      let count = 0;
  
      while (count < index) {
        current = current.next;
        count++;
      }
  
      newNode.next = current;       // Set the new node's next to the current node
      newNode.prev = current.prev;  // Set the new node's prev to the current's prev
      current.prev.next = newNode;  // Set the previous node's next to the new node
      current.prev = newNode;       // Set the current node's prev to the new node
  
      this.size++;
    }
  
    // Remove a node from a specific index
    remove(index) {
      if (index < 0 || index >= this.size) {
        return null; // Index out of bounds
      }
  
      let current = this.head;
  
      if (index === 0) {
        this.head = current.next; // Move head to the next node
        if (this.head) {
          this.head.prev = null;  // Remove reference to the previous node
        } else {
          this.tail = null;       // List is now empty, so clear the tail
        }
      } else if (index === this.size - 1) {
        current = this.tail;
        this.tail = current.prev; // Move tail to the previous node
        this.tail.next = null;    // Remove reference to the next node
      } else {
        let count = 0;
        while (count < index) {
          current = current.next;
          count++;
        }
  
        current.prev.next = current.next; // Bypass the current node
        current.next.prev = current.prev; // Bypass the current node
      }
  
      this.size--;
      return current.value;
    }
  
    // Print the list forwards
    printList() {
      let current = this.head;
      let list = '';
  
      while (current) {
        list += `${current.value} -> `;
        current = current.next;
      }
  
      console.log(list + 'null');
    }
  
    // Print the list backwards
    printListReverse() {
      let current = this.tail;
      let list = '';
  
      while (current) {
        list += `${current.value} -> `;
        current = current.prev;
      }
  
      console.log(list + 'null');
    }
  }
  
  // Example Usage
  const dll = new DoublyLinkedList();
  dll.append(10);
  dll.append(20);
  dll.prepend(5);
  dll.insert(15, 2);
  dll.printList(); // Output: 5 -> 10 -> 15 -> 20 -> null
  
  console.log(dll.remove(2)); // Output: 15
  dll.printList(); // Output: 5 -> 10 -> 20 -> null
  
  dll.printListReverse(); // Output: 20 -> 10 -> 5 -> null
  


  console.log("single linked list");
  

  class Node2 {
    constructor(value) {
      this.value = value;      // The data stored in the node
      this.next = null;        // Reference to the next node
    }
  }
  
  class LinkedList {
    constructor() {
      this.head = null;        // Reference to the first node in the list
      this.size = 0;           // Keeps track of the number of elements in the list
    }
  
    // Add a node at the end of the list
    append(value) {
      const newNode = new Node2(value);
  
      if (!this.head) {
        this.head = newNode;   // If the list is empty, make this node the head
      } else {
        let current = this.head;
        while (current.next) {
          current = current.next; // Traverse to the end of the list
        }
        current.next = newNode;   // Append the new node at the end
      }
  
      this.size++;
    }
  
    // Add a node at the beginning of the list
    prepend(value) {
      const newNode = new Node2(value);
      newNode.next = this.head;
      this.head = newNode;
  
      this.size++;
    }
  
    // Insert a node at a specific index
    insert(value, index) {
      if (index < 0 || index > this.size) {
        return null; // Index out of bounds
      }
  
      const newNode = new Node2(value);
  
      if (index === 0) {
        this.prepend(value); // Insert at the beginning
      } else {
        let current = this.head;
        let previous;
        let count = 0;
  
        while (count < index) {
          previous = current;      // Node before the index
          current = current.next;  // Node at the index
          count++;
        }
  
        newNode.next = current;
        previous.next = newNode;
        this.size++;
      }
    }
  
    // Remove a node from a specific index
    remove(index) {
      if (index < 0 || index >= this.size) {
        return null; // Index out of bounds
      }
  
      let current = this.head;
      let previous;
      let count = 0;
  
      if (index === 0) {
        this.head = current.next; // Remove the head
      } else {
        while (count < index) {
          previous = current;
          current = current.next;
          count++;
        }
  
        previous.next = current.next; // Bypass the node to remove it
      }
  
      this.size--;
      return current.value;
    }
  
    // Find the value at a specific index
    getAt(index) {
      if (index < 0 || index >= this.size) {
        return null; // Index out of bounds
      }
  
      let current = this.head;
      let count = 0;
  
      while (current) {
        if (count === index) {
          return current.value;
        }
        count++;
        current = current.next;
      }
  
      return null;
    }
  
    // Print the linked list
    printList() {
      let current = this.head;
      let list = '';
  
      while (current) {
        list += `${current.value} -> `;
        current = current.next;
      }
  
      console.log(list + 'null');
    }
  }
  
  // Example Usage
  const linkedList = new LinkedList();
  linkedList.append(10);
  linkedList.append(20);
  linkedList.prepend(5);
  linkedList.insert(15, 2);
  linkedList.printList(); // Output: 5 -> 10 -> 15 -> 20 -> null
  
  console.log(linkedList.getAt(2)); // Output: 15
  
  linkedList.remove(2);
  linkedList.printList(); // Output: 5 -> 10 -> 20 -> null
  
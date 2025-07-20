function findChangedPosition(prevArray, currentArray) {
    let changes = [];

    for (let i = 0; i < prevArray.length; i++) {
        for (let j = 0; j < prevArray[i].length; j++) {
            if (prevArray[i][j] !== currentArray[i][j]) {
                if (prevArray[i][j] !== '') {
                    changes.push({
                        piece: prevArray[i][j],
                        from: [i, j]
                    });
                }
                if (currentArray[i][j] !== '') {
                    changes.push({
                        piece: currentArray[i][j],
                        to: [i, j]
                    });
                }
            }
        }
    }

    return changes;
}

let PrevArray = [
    ['wr', 'wn', 'wb', 'wm', 'wq', 'wk', 'wm', 'wb', 'wn', 'wr'],
    ['', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['wp', '', '', '', '', '', '', '', '', ''],
    ['', 'bp', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['bp', '', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['br', 'bn', 'bb', 'bm', 'bq', 'bk', 'bm', 'bb', 'bn', 'br']
];

let currentArray = [
    ['wr', 'wn', 'wb', 'wm', 'wq', 'wk', 'wm', 'wb', 'wn', 'wr'],
    ['', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', 'wp', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['bp', '', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['br', 'bn', 'bb', 'bm', 'bq', 'bk', 'bm', 'bb', 'bn', 'br']
];

console.log(findChangedPosition(PrevArray, currentArray));
let fromi;
const positions=[
    {from: [1, 0]},
    {to : [3, 0]}
]
fromi=toString(positions[0].from[0])



const array =[
   1,2,3,5,7
  ];
  const s=[]
   s.push(array.pop()) // Replace this with the data you want to push

  
//   array[index].push(newData);
  
  console.log(s);
  const data=["abc","abO"]
  const str=data[data.length-1].split('')
  const result=str.includes('O')
  console.log(result);


let originalArray= [1, 2, 3, 4, 5,6,7,8,9,10,11,12 ];
let testArray=[]
let currentIndex=4


  if(currentIndex>(originalArray.length+testArray.length)){
    console.log("out of bound");
}
console.log(currentIndex)
if(currentIndex==originalArray.length-1){
    console.log(originalArray,testArray,"fghfhgfhrtyer")
}
if(testArray.length==0){
    console.log("hahahhahah")
    for(let i=currentIndex+1;i<originalArray.length;i++){
        testArray.push(originalArray[i])
    }
originalArray=originalArray.slice(0,currentIndex+1)
    console.log(originalArray,testArray)
}
if(currentIndex>originalArray.length-1){
    let tempCurrentIndex=currentIndex-originalArray.length
    for(let i=0;i<=tempCurrentIndex;i++){
       console.log( testArray[i])
        originalArray.push(testArray[i])
    }
    testArray=testArray.slice(tempCurrentIndex+1)
    console.log(originalArray,testArray)
}else{
    if(currentIndex<originalArray.length-1){
        for(let i=currentIndex+1; i<originalArray.length;i++){
            testArray.unshift(originalArray[i])
        }
        originalArray=originalArray.slice(0,currentIndex+1)
    }
    console.log(originalArray,testArray)
}


const move = ["a1", "b1", ["w1", "g1", "f2"], "j3", "j4"];
let position = [1, 2, 3, 4, 5, 6, 7];
let undonemove = [];
let index = 6;
function updateArrays(index) {
    if (index >= 0 && index < position.length) {
        // Move elements from position to undonemove starting from index
        const elements = position.splice(index);
        undonemove = [...elements, ...undonemove]; // Prepend elements to undonemove
    } else if (index >= position.length) {
        // Calculate the number of elements to move back from undonemove to position
        const numElementsToMoveBack = index - position.length + 1;
        if (numElementsToMoveBack <= undonemove.length) {
            const elements = undonemove.splice(0, numElementsToMoveBack);
            position.push(...elements);
        }
    }
}

// Initial state
console.log(`Initial Index: ${index}`);
console.log(`Initial Position: ${position}`);
console.log(`Initial Undone Move: ${undonemove}`);

// Step 1: index = 3 (Move elements from position to undonemove)
index = 3;
updateArrays(index);
console.log(`Index: ${index}`);
console.log(`Position: ${position}`);
console.log(`Undone Move: ${undonemove}`);

// Step 2: index = 4 (Move elements from position to undonemove)
index = 4;
updateArrays(index);
console.log(`Index: ${index}`);
console.log(`Position: ${position}`);
console.log(`Undone Move: ${undonemove}`);

// Step 3: index = 2 (Move elements from position to undonemove)
index = 2;
updateArrays(index);
console.log(`Index: ${index}`);
console.log(`Position: ${position}`);
console.log(`Undone Move: ${undonemove}`);

// Step 4: index = 5 (Move elements back from undonemove to position)
index = 5;
updateArrays(index);
console.log(`Index: ${index}`);
console.log(`Position: ${position}`);
console.log(`Undone Move: ${undonemove}`);

const move1 = ["a1", "b1", ["w1", "g1", "f2"], "j3", "j4",["w1", "g1", "f2"]];


move1.map((item,key)=>{
    if(Array.isArray(item)){
        item.push("hd")
        console.log(item,"if part");
    }
    else{
        console.log(item,"else part");
    }
})

const fs = require('fs');
let directions = fs.readFileSync('./input.txt');
 
//-------------------------------------------------------------------
 
function question1() {
    console.time('question1');
    directions = directions.toString();
 
    let instructionNum = 0, floor = 0;
    while (instructionNum < directions.length)
    {
        if (directions[instructionNum] === '(') 
            { ++floor; }
        else
            { --floor; }
 
        ++instructionNum;
    }
 
    console.timeEnd('question1');
    console.log(floor);
}

question1();

// const file = fs.readFileSync('./hello.txt');
// console.log('2', file.toString());

// fs.appendFile('./hello.txt', ' My name is Ryan', err => {
//     if(err){
//         console.log(err)
//     }
// })

// fs.writeFile('bye.txt', "I'll miss you", err => {
//     if(err){
//          console.log(err)
//     }
// })

// fs.unlink('./bye.txt', err => {
//     if(err){
//         console.log(err)
//     }
// })
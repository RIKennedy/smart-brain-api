const fs = require('fs');
let directions = fs.readFileSync('./input.txt');
 
function question1() {
    console.time( 'Time','question1');
    directions = directions.toString();
 
    let floor = 0;
    for (let directionNumber = 0; directionNumber < directions.length; directionNumber++) {
        if (directions[directionNumber] === '(') 
            { ++floor; }
        else
            { --floor; }
    }
 
    console.timeEnd('Time','question1');
    console.log('Floor =', floor);
}

question1();
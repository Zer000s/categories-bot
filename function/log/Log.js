const fs = require('fs');

const setLog = (log) => {
    try{
        fs.appendFileSync('./files/log.txt', `\nText: ${log.message.text} | Name: ${log.message.first_name} | Username: ${log.message.from.username} | Time: ${new Date().toLocaleDateString() +' '+ new Date().toLocaleTimeString()}`);
    }
    catch(e){
        console.log(e);
    }
}

module.exports = setLog;
const fs = require('fs')


const writeBulkDataToFile = (data,fileName,pageNo) => {
    const writeStream = fs.createWriteStream(fileName,{flags: 'a',autoClose:true})
    writeStream.write(data)
    writeStream.on('close', () => {
        console.log(`Written data successfully on Page: ${pageNo}`);
    });
    // writeStream.end()
}


module.exports = {
    writeBulkDataToFile
}
const fs = require('fs');

const json = fs.readFileSync("data.json", "utf-8")
const data = JSON.parse(json)

for(const d of data) {
    d.text = d.text.replaceAll(' ', '&nbsp;')
}

fs.writeFileSync('data2.json', JSON.stringify(data));
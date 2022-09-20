const screen = document.querySelector('#game-view')

let page = 'top'
let prevChapter = 1
let prevNum = 1
let json = null
let datalist = null

;(async () => {
    json = await fetch('data.json').then(res => res.json())
    datalist = await fetch('datalist.json').then(res => res.json())
    // if(page == 'top') topPage()
    // else if (page == 'question') questionPage(prevChapter, prevNum)
    topPage()
})();

const topPage = () => {
    let list = Array(100).fill().map((_, i) => ({chapter: '', count: 0}))
    for(const data of json) {
        list[Number(data.chapter.split('.')[0])].chapter = data.chapter
        list[Number(data.chapter.split('.')[0])].count++
    }

    let li = ''
    for(const [i, ob] of Object.entries(list)) {
        if(ob.count) {
            li += `
                <li data-v-6e3555a4="" onclick="questionPage(${i}, 1)">
                    <div class="flex" data-v-6e3555a4="">${ob.chapter.split(' - ')[0]}
                        <span class="count" data-v-6e3555a4="">（全${ob.count}問）</span>
                    </div>
                    <span class="description" data-v-6e3555a4="">${ob.chapter.split(' - ')[1]}</span>
                </li>
            `
        }
    }

    const html = `
        <div id="genre-menu" data-v-6e3555a4="" data-v-336ba400="">
            <div class="card" data-v-6e3555a4="">
                <div class="card-title" data-v-6e3555a4="">ジャンルで仕訳</div>
                <div class="card-contents" data-v-6e3555a4="">
                    <div class="card-list" data-v-6e3555a4="">
                        <div data-v-6e3555a4="">
                            <div class="set-title" data-v-6e3555a4="">商業簿記</div>
                            <ol data-v-6e3555a4="">
                                ${li}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div class="center-button" data-v-6e3555a4="">
                <button class="back-btn" data-v-6e3555a4="">戻る</button>
            </div>
        </div>
    `

    screen.innerHTML = ''
    screen.insertAdjacentHTML('beforeend', html)
}

const questionPage = (chapter, num) => {
    [prevChapter, prevNum] = [chapter, num]
    const data = chapterData(chapter)

    document.querySelector('#page-title').innerText = data[0].chapter

    const html =  `
        <div id="game-box-screen" class="" data-v-65a5ecf0="" data-v-336ba400="">
            ${progressBar(num, data.length)}
            <div class="questions-box" data-v-4be91447="" data-v-65a5ecf0="">
                ${questionBox(data[num - 1].text)}
                ${gameTable(data[num - 1].ans)}
            </div>
        </div>

        <div class="controls-panel" data-v-be05385e="" data-v-65a5ecf0="">
            <div class="inner" data-v-be05385e="">
                <div class="center-button" data-v-be05385e="">
                    <button class="${data.length == num ? 'last' : ''} submit-btn mb00" onclick="check(this)" data-v-be05385e="">解答する
                    </button>
                </div>
            </div>
        </div>
    `

    screen.innerHTML = ''
    screen.insertAdjacentHTML('beforeend', html)
}

function chapterData(chapter) {
    const data = []
    for(const val of json) {
        if(val.chapter.startsWith(chapter)) data.push(val)
    }

    return data
}

function progressBar(now, size) {
    return `
        <div class="progress-bar" data-v-20f4f412="" data-v-65a5ecf0="">
            <div class="bar" data-v-20f4f412=""><span id="loading" data-v-20f4f412=""
                style="width: ${now / size * 100}%;">loading</span></div>
            <div class="legend" data-v-20f4f412="">${now}/${size}</div>
        </div>
    `
}

function questionBox(text) {
    return `
        <div class="question-box" data-v-4be91447="">
            <p data-v-4be91447="">${text.replace('\\n', '<br><br>')}</p>
        </div>
    `
}

function gameTable(data) {
    const table = []
    // let keyList = []

    // const trTemplate = `
    //     <tr id="question_1_0_0" data-v-4be91447="">
    //         <td class="select" data-v-4be91447="">
    //             <!-- <input type="text" list="list" class="left_select" data-v-4be91447=""> -->
    //             <select class="left_select" data-v-4be91447="">
                    
    //             </select>
    //         </td>
    //         <td class="number" data-v-4be91447="">
    //             <input class="left_input" inputmode="numeric" 
    //                     pattern="([0-9]{1,3}),([0-9]{1,3})" data-v-4be91447=""
    //                     onchange="handleChange(this)">
    //         </td>
    //         <td class="select" data-v-4be91447="">
    //             <!-- <input type="text" list="list" class="right_select" data-v-4be91447=""> -->
    //             <select class="left_select" data-v-4be91447="">
                    
    //             </select> 
    //         </td>
    //         <td class="number" data-v-4be91447="">
    //             <input class="right_input" inputmode="numeric" 
    //                     pattern="([0-9]{1,3}),([0-9]{1,3})" data-v-4be91447=""
    //                     onchange="handleChange(this)">
    //         </td>
    //     </tr>
    // `
    for(const key in data) {
        let tr = ''
        let trAns = ''
        let keyList = []

        for(let i = 0; i < 5; i++) {
            if(i == 4 && !data[key].left[i] && !data[key].right[i]) break
            if(data[key].left[i] && !(data[key].left[i] in keyList)) keyList.push(data[key].left[i].select)
            if(data[key].right[i] && !(data[key].right[i] in keyList)) keyList.push(data[key].right[i].select)
        }

        const keyListOptionString = getKeyListOptionString(keyList)
        console.log(keyListOptionString)

        for(let i = 0; i < 5; i++) {

            if(i == 4 && !data[key].left[i] && !data[key].right[i]) break

            tr += `
                <tr id="question_1_0_0" data-v-4be91447="">
                    <td class="select" data-v-4be91447="">
                        <!-- <input type="text" list="list" class="left_select" data-v-4be91447=""> -->
                        <select class="left_select input" data-v-4be91447="">
                            ${keyListOptionString}
                        </select>
                    </td>
                    <td class="number" data-v-4be91447="">
                        <input class="left_input input" inputmode="numeric" 
                                pattern="([0-9]{1,3}),([0-9]{1,3})" data-v-4be91447=""
                                onchange="handleChange(this)">
                    </td>
                    <td class="select" data-v-4be91447="">
                        <!-- <input type="text" list="list" class="right_select input" data-v-4be91447=""> -->
                        <select class="left_select input" data-v-4be91447="">
                            ${keyListOptionString}
                        </select> 
                    </td>
                    <td class="number" data-v-4be91447="">
                        <input class="right_input input" inputmode="numeric" 
                                pattern="([0-9]{1,3}),([0-9]{1,3})" data-v-4be91447=""
                                onchange="handleChange(this)">
                    </td>
                </tr>
            `
            trAns += `
                <tr id="question_1_0_0" data-v-4be91447="">
                    <td class="select" data-v-4be91447="">
                        <input type="text" list="list" class="left_select input" data-v-4be91447=""
                            value=${data[key].left[i] ? data[key].left[i].select : ''}>
                    </td>
                    <td class="number" data-v-4be91447="">
                        <input class="left_input input" inputmode="numeric" data-v-4be91447=""
                                pattern="([0-9]{1,3}),([0-9]{1,3})" data-v-4be91447=""
                                value=${data[key].left[i] ? data[key].left[i].number : ''}>
                    </td>
                    <td class="select" data-v-4be91447="">
                        <input type="text" list="list" class="right_select input" data-v-4be91447=""
                            value=${data[key].right[i] ? data[key].right[i].select : ''}>    
                    </td>
                    <td class="number" data-v-4be91447="">
                        <input class="right_input input" inputmode="numeric" 
                                pattern="([0-9]{1,3}),([0-9]{1,3})" data-v-4be91447=""
                                value=${data[key].right[i] ? data[key].right[i].number : ""}>
                    </td>
                </tr>
            `

            if(data[key].left[i] && !(data[key].left[i] in keyList)) keyList.push(data[key].left[i].select)
            if(data[key].right[i] && !(data[key].right[i] in keyList)) keyList.push(data[key].right[i].select)
        }

        table.push(`
            <div class = "key">${key}</div>
            <table class="question" data-v-4be91447="">
                <thead data-v-4be91447="">
                    <tr data-v-4be91447="">
                        <th data-v-4be91447="">借方科目</th>
                        <th data-v-4be91447="">金額</th>
                        <th data-v-4be91447="">貸方科目</th>
                        <th data-v-4be91447="">金額</th>
                    </tr>
                </thead>
                <tbody data-v-4be91447="">
                    ${tr}
                </tbody>
            </table>

            <table class="answer hide" data-v-4be91447="">
                <thead data-v-4be91447="">
                    <tr data-v-4be91447="">
                        <th data-v-4be91447="">借方科目</th>
                        <th data-v-4be91447="">金額</th>
                        <th data-v-4be91447="">貸方科目</th>
                        <th data-v-4be91447="">金額</th>
                    </tr>
                </thead>
                <tbody data-v-4be91447="">
                    ${trAns}
                </tbody>
            </table>
        `)
    }

    // keyList = keyList.map(val => `<option>${val}</option>`)

    return `
        <div class="game-table-wrap" data-v-4be91447="">
            ${table.join('')}
        </div>
    `

    // <datalist id="list">
    //     ${keyList.join('')}
    // </datalist>
}

function replaceFormatNumber(numberText) {
    if (!numberText) {
      return ''
    }
    return String(numberText).replace(/\d+/, function (m) {
      return m.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,")
    });
}

function replaceNumberText(formatNumber) {
    if (!formatNumber) {
        return ''
    }
    return formatNumber.replace(/,/g, '')
}

function handleChange(t) {
    let v = t.value
    v = String(replaceNumberText(v));
    v = replaceFormatNumber(v);
    t.value = v
}

function check(t) {
    if(t.innerText == '次へ') {
        questionPage(prevChapter, ++prevNum)
        return
    } else if(t.innerText == '終了') {
        topPage()
    }


    document.querySelectorAll('table.hide').forEach(table => table.classList.remove('hide'))
    const table = document.querySelectorAll('table')
    const keys = document.querySelectorAll('.key')

    for(let i = 0; i < table.length; i += 2) {
        const inputTr = table[i].querySelectorAll('tbody tr')
        const ansTr = table[i + 1].querySelectorAll('tbody tr')
        let input = {left: [], right: []}
        let ans = {left: [], right: []}

        for(let i = 0; i < inputTr.length; i++) {
            const inputTd = inputTr[i].querySelectorAll('td .input')
            const ansTd = ansTr[i].querySelectorAll('td input')

            if(inputTd[0].value) input.left.push({select: inputTd[0].value, number: inputTd[1].value})
            if(inputTd[2].value) input.right.push({select: inputTd[2].value, number: inputTd[3].value})
            if(ansTd[0].value) ans.left.push({select: ansTd[0].value, number: ansTd[1].value})
            if(ansTd[2].value) ans.right.push({select: ansTd[2].value, number: ansTd[3].value})
        }

        if(JSON.stringify(input.left.sort()) == JSON.stringify(ans.left.sort())
            && JSON.stringify(input.right.sort()) == JSON.stringify(ans.right.sort())) keys[i / 2].classList.add('correct')
        else keys[i / 2].classList.add('wrong')
    }

    if(t.classList.contains('last')) t.innerText = '終了'
    else t.innerText = '次へ'
}

function getKeyListOptionString(keyList) {
    const chapterKey = []
    for(const key of Object.keys(datalist)) {
        if(datalist[key].includes(prevChapter)) chapterKey.push(key)
    }

    for(const key of chapterKey) {
        if(!(key in keyList) && keyList.length < 8) keyList.push(key)
    }

    datalistArray = Object.entries(datalist)
    while(keyList.length < 8) {
        const i = Math.floor(Math.random() * datalistArray.length)
        if(!(datalistArray[i][0] in keyList)) keyList.push(datalistArray[i][0])
    }

    keyList = arrayShuffle(keyList)
    keyList.unshift('')

    return keyList.map(val => `<option>${val}</option>`)
}

function arrayShuffle(array) {
    for(let i = (array.length - 1); 0 < i; i--){
  
      let r = Math.floor(Math.random() * (i + 1));
  
      let tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
  }
document.addEventListener('DOMContentLoaded', () => {
    let boxLength = 40;
    let boxesInRow = 10;
    let noBombs = 9

    // updates time
    function updateTime() {
        let time = document.getElementsByClassName('time')
        if (time.length > 0) {
            time[0].innerHTML++
        }
    }
    setInterval(function () { updateTime() }, 1000)

    function noClass(className) {
        let element = document.getElementsByClassName(className)
        element[0].className = ''
    }

    function setContainerDimensions(boxes) {
        let cssClass = document.querySelector(".container");
        cssClass.style.height = String((boxLength * boxesInRow) + (boxesInRow * 2)) + 'px';
        cssClass.style.width = String((boxLength * boxesInRow) + (boxesInRow * 2)) + 'px';
    }

    // creates boxes in the container
    function createSquares(boxes, classes, parent) {
        let outer = document.getElementsByClassName(parent)[0]
        let squares = []
        for (let i = 0; i < boxes; i++) {
            row = []
            for (let j = 0; j < boxes; j++) {
                let square = document.createElement('div')
                square.className = classes
                outer.appendChild(square)
                row.push(square)
            }
            squares.push(row)
        }
        return squares
    }

    setContainerDimensions(boxesInRow)
    let squares = createSquares(boxesInRow, 'box-layer-1', 'container-layer-1')
    console.log('squares layer 1', squares)

    //checks if list1 contains list2
    function hasList(list1, list2) {
        for (let i = 0; i < list1.length; i++) {
            if (list1[i][0] == list2[0] && list1[i][1] == list2[1]) {
                return true
            }
        }
        return false
    }

    // puts bombs in random locations
    function addBombs() {
        const bombs = []
        while (bombs.length != noBombs) {
            x = Math.floor(Math.random() * boxesInRow)
            y = Math.floor(Math.random() * boxesInRow)
            if (!(hasList(bombs, [x, y]))) {
                squares[x][y].className += ' bomb'
                squares[x][y].innerHTML += "<div class='icon fa fa-3x fa-bomb'></div>"
                // console.log([x, y])
                bombs.push([x, y])
            }
        }
        return bombs
    }
    let bombs = addBombs()
    console.log('bombs', bombs)

    // puts numbers according to touching bombs
    function addCounting(bombs) {
        while (bombs.length > 0) {
            current = bombs.pop()
            x = current[0]
            y = current[1]

            for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, boxesInRow - 1); i++) {
                for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, boxesInRow - 1); j++) {
                    if (squares[i][j].classList.contains('bomb')) {

                    }
                    else if (squares[i][j].innerHTML == '') {
                        squares[i][j].className += ' text'
                        squares[i][j].innerHTML = 1
                    }
                    else {
                        squares[i][j].innerHTML++

                    }
                }
            }
        }
    }

    addCounting(bombs)

    let userSquares = createSquares(boxesInRow, 'box-layer-2-structure box-layer-2-style', 'container-layer-2')
    // userSquares[9][9].className = 'box-layer-2-structure'
    console.log(userSquares)

    // shows the content of all consecutive empty blocks
    function showSquares(index) {
        // userSquares[index[0]][index[1]].className = 'box-layer-2-structure'
        if (!(userSquares[index[0]][index[1]].classList.contains('flag'))) {
            if (!(squares[index[0]][index[1]].innerHTML == '')) {
                userSquares[index[0]][index[1]].className = 'box-layer-2-structure'
            }
            else {
                toDo = [index]
                while (toDo.length > 0) {
                    current = toDo.pop()
                    x = current[0]
                    y = current[1]

                    for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, boxesInRow - 1); i++) {
                        for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, boxesInRow - 1); j++) {
                            if (!(userSquares[i][j].classList.contains('flag'))) {
                                if (squares[i][j].innerHTML == '' && userSquares[i][j].classList.contains('box-layer-2-style')) {
                                    toDo.push([i, j])
                                }
                                userSquares[i][j].className = 'box-layer-2-structure'
                            }

                        }
                    }
                }
            }
        }
    }

    function checkForBomb(index) {
        if (squares[index[0]][index[1]].classList.contains('bomb') && !(userSquares[index[0]][index[1]].classList.contains('flag'))) {
            return false
        }
        else {
            return true
        }
    }

    function getIndex(item) {
        for (let i = 0; i <= boxesInRow; i++) {
            if (!(userSquares[i].indexOf(item) == -1)) {
                return [i, userSquares[i].indexOf(item)]
            }
        }
    }

    function showAll() {
        for (i = 0; i < squares.length; i++) {
            for (j = 0; j < squares[i].length; j++) {
                if (!(userSquares[i][j].classList.contains('flag') && squares[i][j].classList.contains('bomb'))) {
                    userSquares[i][j].className = 'box-layer-2-structure'
                }
            }
        }
    }

    //checks if only bombs are left
    function onlyBombsLeft() {
        for (i = 0; i < squares.length; i++) {
            for (j = 0; j < squares[i].length; j++) {
                if (userSquares[i][j].classList.contains('box-layer-2-style') && !((squares[i][j].classList.contains('bomb')))) {
                    return false
                }
            }
        }
        return true
    }

    // adds or removes flag
    function addRemoveFlag(index) {
        if (userSquares[index[0]][index[1]].classList.contains('box-layer-2-style')) {
            if (userSquares[index[0]][index[1]].classList.contains('flag')) {
                userSquares[index[0]][index[1]].innerHTML = ""
                userSquares[index[0]][index[1]].classList.remove('flag')
                incDecFlag(true)
            }
            else {
                userSquares[index[0]][index[1]].className += ' flag'
                userSquares[index[0]][index[1]].innerHTML += "<div class='icon fa fa-3x fa-flag'></div>"
                incDecFlag(false)
            }
        }
    }

    function incDecFlag(param) {
        let flag = document.getElementsByClassName('bomb-count')
        if (param) {
            flag[0].innerHTML++
        }
        else {
            flag[0].innerHTML--
        }
    }

    function printWinLose(param) {
        let winLose = document.getElementsByClassName('win-info')
        winLose[0].innerHTML = param

    }

    document.querySelectorAll('.box-layer-2-style').forEach(item => {
        item.addEventListener('click', function () {
            index = getIndex(item)
            if (checkForBomb(index)) {
                if (!(userSquares[index[0]][index[1]].classList.contains('mark'))) {
                    showSquares(index)
                    if (onlyBombsLeft()) {
                        document.getElementsByClassName("container-layer-2")[0].remove()
                        noClass('time')
                        printWinLose('You Win')
                        console.log('Game Won')
                    }
                }
            }
            else {
                // showAll()
                document.getElementsByClassName("container-layer-2")[0].remove()
                noClass('time')
                printWinLose('You Lose')
                console.log('Game Lost')
            }
        })
    })

    document.querySelectorAll('.box-layer-2-style').forEach(item => {
        item.addEventListener('contextmenu', function (event) {
            event.preventDefault()
            index = getIndex(item)
            addRemoveFlag(index)
        })
    })

    document.getElementById('btn').addEventListener('click', function () {
        location.reload()
    })

})
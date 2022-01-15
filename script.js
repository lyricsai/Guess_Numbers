function start() {

    const execute = document.querySelector('#execute')
    const hint = document.querySelector('#hint')
    const result = document.querySelector('#result')
    const randomNumber = document.querySelector('#randomNumber')
    const input = document.querySelector('#numbers')
    const modal = document.querySelector(".modal")
    const modal__2 = document.querySelector(".modal__2")
    const closeBtn = document.getElementsByClassName("close")[0]
    const closeBtnHistory = document.getElementsByClassName("close")[1]
    const userName = document.getElementById("userName")
    const history = document.getElementById("history")
    const showHistory = document.getElementById("show__history")
    const output = document.getElementById("output")

    const generateNumbers = (min, max) => {

        let totalNumbers = max - min + 1
        let tempRandomNumber
        const arrayTotalNumbers = []
        const arrayRandomNumbers = []

        while (totalNumbers--) {
            arrayTotalNumbers.push(totalNumbers + min)
        }
        while (arrayTotalNumbers.length) {
            tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1))
            arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber])
            arrayTotalNumbers.splice(tempRandomNumber, 1)
        }
        arrayRandomNumbers.length = 4

        if (arrayRandomNumbers[0] === 0) {
            arrayRandomNumbers[0] = arrayRandomNumbers[3]
            arrayRandomNumbers[3] = 0
        }
        return arrayRandomNumbers
    }

    let generatedNumbers = generateNumbers(0, 9)
    let sheep = 0
    let ram = 0
    let checks = 0
    let players = []

    if (localStorage.getItem('players')) players = JSON.parse(localStorage.getItem('players'))

    function checkNumbers(e) {

        e.preventDefault()
        hint.style.color = "#f1f0ec"
        sheep = 0
        ram = 0
        checks++

        let numbers = Array.from(input.value)

        if (numbers.length !== 4 || +numbers[0] === 0) { return hint.style.color = "red" }

        numbers = numbers.map(e => +e)
        for (let i = 0; i < generatedNumbers.length; i++) {
            if (generatedNumbers[i] === numbers[i]) {
                ram++
            }
        }
        let arr2 = generatedNumbers.filter(e => !~numbers.indexOf(e))
        sheep = 4 - arr2.length - ram

        output.innerHTML = `FULL GUESS: ${ram} <br><br> and NOT IN A RIGHT PLACE: ${sheep}`

        if (ram === 4) {
            result.innerText = `Awesome! Your guess was right on ${checks} time. Type in your name, and you'll stay in history!`
            modal.style.display = "block"

            userName.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault()
                    userNameValue = userName.value

                    players.push({ 'user': userNameValue, 'moves': checks })
                    players = players.filter(e => {
                        return e.user !== ''
                    })
                    localStorage.setItem('players', JSON.stringify(players))
                    document.querySelector('#userName').value = ''
                    modal.style.display = "none"
                    checks = 0
                    sheep = 0
                    ram = 0
                    generatedNumbers = generateNumbers(0, 9)
                }
            })
            document.querySelector('#numbers').value = ''
            randomNumber.innerText = ``
            output.innerText = ''
        }
    }

    show.addEventListener('click', (e) => {
        e.preventDefault()
        randomNumber.innerText ? randomNumber.innerText = `` : randomNumber.innerText = `${generatedNumbers.join('')}`
    })

    execute.addEventListener('click', checkNumbers)

    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            checkNumbers(event)
        }
    })

    closeBtn.addEventListener('click', () => {
        document.querySelector('#userName').value = ''
        modal.style.display = "none"
        checks = 0
    })

    showHistory.addEventListener('click', (e) => {
        e.preventDefault()

        players = JSON.parse(localStorage.getItem('players'))
        players.sort((a, b) => a.moves - b.moves)
        if (players.length > 10) players.length = 10
        modal__2.style.display = "block"
        history.innerHTML = ''
        for (let i = 0; i < players.length; i++) {
            history.innerHTML += `<li>${players[i].user} - ${players[i].moves} moves</li>`
        }
    })
    closeBtnHistory.addEventListener('click', () => {
        modal__2.style.display = "none"
    })
}
document.addEventListener("DOMContentLoaded", start)

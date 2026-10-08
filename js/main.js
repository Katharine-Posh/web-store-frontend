let cart = [],
    messages = [],
    inputForName,
    inputForSurname,
    inputStreet,
    inputHouseNum,
    inputFlat,
    inputForDataDeliv,
    secForPresent,
    buttonSubmit,
    secError,
    secForBook,
    windowOrder,
    orderTitle,
    orderDelivery,
    orderHouse,
    orderFlat,
    orderCustomer,
    buttonDeleteWindow,
    formAction

function init() {
    inputForName = document.querySelector("#name")
    inputForSurname = document.querySelector("#surname")
    inputStreet = document.querySelector("#street")
    inputHouseNum = document.querySelector("#house")
    inputFlat = document.querySelector("#flat")
    inputForDataDeliv = document.querySelector("#date")
    secForPresent = document.querySelector("#multiple")
    buttonSubmit = document.querySelector(".button-submit")
    secError = document.querySelector(".show-error")
    secForBook = document.querySelector(".section-for-book")
    windowOrder = document.querySelector(".window-order")
    orderTitle = document.querySelector(".order-title")
    orderDelivery = document.querySelector(".order-delivery")
    orderHouse = document.querySelector(".order-house")
    orderFlat = document.querySelector(".order-flat")
    orderCustomer = document.querySelector(".order-customer")
    buttonDeleteWindow = document.querySelector(".button-delete-window")
    formAction = document.querySelector(".form-action")

    cart = JSON.parse(localStorage.getItem("cart")) || {list: []}

    formAction.addEventListener("blur", validBlur, true)
    formAction.addEventListener("submit", (e) => e.preventDefault())

    secForPresent.addEventListener("change", checkSelect)
    buttonDeleteWindow.addEventListener("click", removeModal)

    renderCart()
}

function validationName(e) {
    let regName = /^[a-z]{4,}$/gi

    if (!regName.test(inputForName.value)) {
        messages.push("Error 1")
        if (!inputForName.classList.contains("invalid") && (inputForName == e.target)) {
            inputForName.classList.add("invalid")
            secError.textContent = 'Please enter a valid name'
        }
    } else {
        if (inputForName.classList.contains("invalid")) {
            inputForName.classList.remove("invalid")
            secError.textContent = ''
        }
    }
}

function validationSurname(e) {
    let regSurname = /^[a-z]{5,}$/gi
    if (!regSurname.test(inputForSurname.value)) {
        messages.push("Error 2")
        if (!inputForSurname.classList.contains("invalid") && (inputForSurname == e.target)) {
            inputForSurname.classList.add("invalid")
            secError.textContent = 'Please enter a valid surname'
        }
    } else {
        if (inputForSurname.classList.contains("invalid")) {
            inputForSurname.classList.remove("invalid")
            secError.textContent = ''
        }
    }
}

function validationStreet(e) {
    let regStreet = /^[a-z\d\s]{5,}$/gi
    if (!regStreet.test(inputStreet.value)) {
        messages.push("Error 3")
        if (!inputStreet.classList.contains("invalid") && (inputStreet == e.target)) {
            inputStreet.classList.add("invalid")
            secError.textContent = 'Please enter a valid street'
        }

    } else {
        if (inputStreet.classList.contains("invalid")) {
            inputStreet.classList.remove("invalid")
            secError.textContent = ''
        }
    }
}

function validationHouse(e) {
    let regHouseNum = /^[\d]{0,}$/gi

    if (!regHouseNum.test(Number(inputHouseNum.value)) || inputHouseNum.value == "") {
        messages.push("Error 4")
        if (!inputHouseNum.classList.contains("invalid") && (inputHouseNum == e.target)) {
            inputHouseNum.classList.add("invalid")
            secError.textContent = 'Please enter a valid house'
        }
    } else {
        if (inputHouseNum.classList.contains("invalid")) {
            inputHouseNum.classList.remove("invalid")
            secError.textContent = ''
        }
    }
}

function validationFlat(e) {
    let regFlatNum = /^\d+-*\d*$/g
    let check = regFlatNum.test(inputFlat.value)
    if (!check) {
        messages.push("Error 5")
        if (!inputFlat.classList.contains("invalid") && (inputFlat == e.target)) {
            inputFlat.classList.add("invalid")
            secError.textContent = 'Please enter a valid flat'
        }
    } else {
        if (inputFlat.classList.contains("invalid")) {
            inputFlat.classList.remove("invalid")
            secError.textContent = ''
        }
    }
}

function validationDate(e) {
    let a = new Date()
    a = new Date(a.getFullYear(), a.getMonth(), a.getDate())
    let date = new Date(inputForDataDeliv.value)
    a.setDate(a.getDate() + 1)
    if (a > date) {
        messages.push("Error 6")
        if (!inputForDataDeliv.classList.contains("invalid") && (inputForDataDeliv == e.target)) {
            inputForDataDeliv.classList.add("invalid")
            secError.textContent = 'Please enter a valid data'
        }
    } else {
        if (inputForDataDeliv.classList.contains("invalid")) {
            inputForDataDeliv.classList.remove("invalid")
            secError.textContent = ''
        }
    }
}

function validBlur(e) {
    messages = []
    validationName(e)
    validationSurname(e)
    validationStreet(e)
    validationHouse(e)
    validationFlat(e)
    validationDate(e)
    makeButtonAvaluable()
}

function makeButtonAvaluable() {
    if (!messages.length) {
        buttonSubmit.disabled = false
        buttonSubmit.onclick = popupOrder
    }
}

function checkSelect(e) {
    let count = 0
    let options = Array.from(secForPresent.children)
    options.forEach(option => {
        if (option.selected) count++
    })
    if (count > 2) {
        options.forEach(option => {
            option.selected = false
        })
    }
}

function renderCart() {
    let Allprice = 0

    secForBook.replaceChildren()

    cart.list.forEach((book, index) => {
        let itemWraper = document.createElement("section")
        itemWraper.classList.add("text-wraprt")

        let imgSec = document.createElement("img")
        imgSec.classList.add("imgCard")
        imgSec.setAttribute('src', new URL(yarns[book].imageLink, DATA_ROOT).href)

        let buttonDelete = document.createElement("button")
        buttonDelete.type = "button"
        buttonDelete.classList.add("button-delete")
        buttonDelete.innerText = "X"

        let infoBooks = document.createElement("section")
        infoBooks.classList.add("info-yarns-order")

        let titleBook = document.createElement("section")
        titleBook.classList.add("title-author")

        let titleLabel = document.createElement("b")
        titleLabel.textContent = "Title:"
        titleBook.append(titleLabel, " " + yarns[book].title)

        let priceBook = document.createElement("section")

        let priceLabel = document.createElement("b")
        priceLabel.textContent = "Цена:"
        priceBook.append(priceLabel, " " + yarns[book].price + " ₽")

        buttonDelete.onclick = () => {
            cart.list.splice(index, 1)
            localStorage.setItem("cart", JSON.stringify(cart))
            renderCart()
        }

        Allprice += yarns[book].price

        infoBooks.append(titleBook)
        infoBooks.append(priceBook)
        infoBooks.append(buttonDelete)

        itemWraper.append(imgSec)
        itemWraper.append(infoBooks)

        secForBook.append(itemWraper)
    })

    let totalPrice = document.createElement('span')
    totalPrice.classList.add("total-price")

    let totalLabel = document.createElement("b")
    totalLabel.textContent = "Total price:"
    totalPrice.append(totalLabel, " " + Allprice + " ₽")
    secForBook.append(totalPrice)
}

function appendOrderLine(parent, label, value) {
    let lineLabel = document.createElement("b")
    lineLabel.textContent = label
    parent.replaceChildren(lineLabel, " " + value)
}

function popupOrder() {
    appendOrderLine(orderTitle, "Create order", "")
    appendOrderLine(orderDelivery, "Delivery address:", inputStreet.value)
    appendOrderLine(orderHouse, "House:", inputHouseNum.value)
    appendOrderLine(orderFlat, "Flat:", inputFlat.value)
    appendOrderLine(orderCustomer, "Customer:", inputForName.value + " " + inputForSurname.value)

    showWin()
}

function showWin() {
    windowOrder.classList.add("show-window")
}

function removeModal() {
    windowOrder.classList.remove("show-window")
}

window.onload = init;

let cart = [],
    messages = [],
    inputForName,
    inputForDataDeliv,
    inputForPickup,
    buttonSubmit,
    secError,
    cartList,
    formAction,
    windowOrder,
    orderTitle,
    orderDate,
    orderPickup,
    orderCustomer,
    buttonDeleteWindow

function init() {
    inputForName = document.querySelector("#name")
    inputForDataDeliv = document.querySelector("#date")
    inputForPickup = document.querySelector("#pickup-point")
    buttonSubmit = document.querySelector(".button-submit")
    secError = document.querySelector(".show-error")
    cartList = document.querySelector(".cart-list")
    formAction = document.querySelector(".order-form")
    windowOrder = document.querySelector(".window-order")
    orderTitle = document.querySelector(".order-title")
    orderDate = document.querySelector(".order-date")
    orderPickup = document.querySelector(".order-pickup")
    orderCustomer = document.querySelector(".order-customer")
    buttonDeleteWindow = document.querySelector(".button-delete-window")

    cart = JSON.parse(localStorage.getItem("cart")) || {list: []}

    formAction.addEventListener("blur", validBlur, true)
    buttonDeleteWindow.addEventListener("click", removeModal)

    renderCart()
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
}

function renderCart() {
    cartList.innerHTML = ""

    if (!cart.list.length) {
        let empty = document.createElement("p")
        empty.classList.add("cart-item-empty")
        empty.innerText = "Корзина пуста"
        cartList.append(empty)
        return
    }

    let summa = 0

    cart.list.forEach((bookId, index) => {
        let book = books[bookId]

        let item = document.createElement("section")
        item.classList.add("cart-item")

        let imgSec = document.createElement("img")
        imgSec.classList.add("cart-item-img")
        imgSec.setAttribute('src', book.imageLink)

        let infoBooks = document.createElement("section")
        infoBooks.classList.add("cart-item-info")

        let authorBook = document.createElement("section")
        authorBook.innerHTML = "<b>" + "Author:" + "</b>" + " " + book.author

        let titleBook = document.createElement("section")
        titleBook.classList.add("cart-item-title")
        titleBook.innerHTML = "<b>" + "Title:" + "</b>" + " " + book.title

        let priceBook = document.createElement("section")
        priceBook.classList.add("cart-item-price")
        priceBook.innerHTML = "<b>" + "Цена:" + "</b>" + " " + book.price + " ₽"

        let buttonDelete = document.createElement("button")
        buttonDelete.classList.add("button-delete")
        buttonDelete.innerText = "X"

        buttonDelete.onclick = () => {
            cart.list.splice(index, 1)
            saveCart()
            renderCart()
        }

        infoBooks.append(authorBook)
        infoBooks.append(titleBook)
        infoBooks.append(priceBook)

        item.append(imgSec)
        item.append(infoBooks)
        item.append(buttonDelete)

        cartList.append(item)

        summa += book.price
    })

    let totalPrice = document.createElement("p")
    totalPrice.classList.add("cart-total")
    totalPrice.innerHTML = "<b>" + "Total price:" + "</b>" + " " + summa + " ₽"
    cartList.append(totalPrice)
}

function validationName(e) {
    let regName = /^[а-яa-z\s]{4,}$/i

    if (!regName.test(inputForName.value)) {
        messages.push("Error 1")
        if (!inputForName.classList.contains("invalid") && (inputForName == e.target)) {
            inputForName.classList.add("invalid")
            secError.innerHTML = 'Please enter your full name'
        }
    } else {
        if (inputForName.classList.contains("invalid")) {
            inputForName.classList.remove("invalid")
            secError.innerHTML = ''
        }
    }
}

function validationDate(e) {
    let a = new Date()
    a = new Date(a.getFullYear(), a.getMonth(), a.getDate())
    let date = new Date(inputForDataDeliv.value)
    a.setDate(a.getDate() + 1)

    if (a > date) {
        messages.push("Error 3")
        if (!inputForDataDeliv.classList.contains("invalid") && (inputForDataDeliv == e.target)) {
            inputForDataDeliv.classList.add("invalid")
            secError.innerHTML = 'Please enter a valid data'
        }
    } else {
        if (inputForDataDeliv.classList.contains("invalid")) {
            inputForDataDeliv.classList.remove("invalid")
            secError.innerHTML = ''
        }
    }
}

function validBlur(e) {
    messages = []
    validationName(e)
    validationDate(e)
    makeButtonAvaluable()
}

function makeButtonAvaluable() {
    if (!messages.length) {
        buttonSubmit.disabled = false
        buttonSubmit.onclick = popupOrder
    }
}

function popupOrder() {
    orderTitle.innerHTML = "<b>" + "Create order" + "</b>"
    orderDate.innerHTML = "<b>" + "Delivery date:" + "</b>" + " " + inputForDataDeliv.value
    orderPickup.innerHTML = "<b>" + "Пункт выдачи:" + "</b>" + " " + inputForPickup.options[inputForPickup.selectedIndex].text
    orderCustomer.innerHTML = "<b>" + "Customer:" + "</b>" + " " + inputForName.value

    showWin()
}

function showWin() {
    windowOrder.classList.add("show-window")
}

function removeModal() {
    windowOrder.classList.remove("show-window")
}

window.onload = init;

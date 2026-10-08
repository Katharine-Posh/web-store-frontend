let cart = {list: []},
    messages = [],
    inputForName,
    inputForSurname,
    inputForPhone,
    inputForAddress,
    inputForPickup,
    buttonSubmit,
    buttonOrder,
    secError,
    cartList,
    formAction,
    windowOrder,
    orderTitle,
    orderPhone,
    orderAddress,
    orderPickup,
    orderCustomer,
    buttonDeleteWindow

function init() {
    inputForName = document.querySelector("#name")
    inputForSurname = document.querySelector("#surname")
    inputForPhone = document.querySelector("#phone")
    inputForAddress = document.querySelector("#address")
    inputForPickup = document.querySelector("#pickup-point")
    buttonSubmit = document.querySelector(".button-submit")
    buttonOrder = document.querySelector(".button-order")
    secError = document.querySelector(".show-error")
    cartList = document.querySelector(".cart-list")
    formAction = document.querySelector(".order-form")
    windowOrder = document.querySelector(".window-order")
    orderTitle = document.querySelector(".order-title")
    orderPhone = document.querySelector(".order-phone")
    orderAddress = document.querySelector(".order-address")
    orderPickup = document.querySelector(".order-pickup")
    orderCustomer = document.querySelector(".order-customer")
    buttonDeleteWindow = document.querySelector(".button-delete-window")

    cart = JSON.parse(localStorage.getItem("cart")) || {list: []}
    if (!Array.isArray(cart.list)) cart = {list: []}
    cart.list = cart.list.map(String)

    formAction.addEventListener("blur", validBlur, true)
    formAction.addEventListener("submit", (e) => e.preventDefault())
    buttonOrder.addEventListener("click", openForm)
    buttonSubmit.addEventListener("click", popupOrder)
    buttonDeleteWindow.addEventListener("click", removeModal)

    if (new URLSearchParams(window.location.search).get("order") === "1") openForm()

    renderCart()
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
}

function openForm() {
    formAction.hidden = false
    buttonOrder.hidden = true
    inputForName.focus()
}

function renderCart() {
    cartList.replaceChildren()

    if (!cart.list.length) {
        let empty = document.createElement("p")
        empty.classList.add("cart-item-empty")
        empty.innerText = "Корзина пуста"
        cartList.append(empty)
        return
    }

    let groups = {},
        order = []

    cart.list.forEach((bookId) => {
        if (!(bookId in groups)) {
            groups[bookId] = 0
            order.push(bookId)
        }
        groups[bookId]++
    })

    let summa = 0

    order.forEach((bookId) => {
        let book = yarns[bookId],
            qty = groups[bookId]

        if (!book) return

        let item = document.createElement("article")
        item.classList.add("cart-item")

        let imgItem = document.createElement("img")
        imgItem.classList.add("cart-item-img")
        imgItem.setAttribute("src", book.imageLink)
        imgItem.setAttribute("alt", book.title)

        let infoBooks = document.createElement("div")
        infoBooks.classList.add("cart-item-info")

        let titleBook = document.createElement("p")
        titleBook.classList.add("cart-item-title")

        let titleLabel = document.createElement("b")
        titleLabel.textContent = "Название:"
        titleBook.append(titleLabel, " " + book.title)

        let priceBook = document.createElement("p")
        priceBook.classList.add("cart-item-price")

        let priceLabel = document.createElement("b")
        priceLabel.textContent = "Цена:"
        priceBook.append(priceLabel, " " + book.price + " ₽")

        let qtyBlock = document.createElement("div")
        qtyBlock.classList.add("cart-item-qty")

        let buttonDec = document.createElement("button")
        buttonDec.type = "button"
        buttonDec.classList.add("qty-btn")
        buttonDec.innerText = "−"
        buttonDec.disabled = qty <= 1
        buttonDec.setAttribute("aria-label", "Уменьшить количество")
        buttonDec.onclick = () => changeQty(bookId, -1)

        let qtyValue = document.createElement("span")
        qtyValue.classList.add("qty-value")
        qtyValue.innerText = qty

        let buttonInc = document.createElement("button")
        buttonInc.type = "button"
        buttonInc.classList.add("qty-btn")
        buttonInc.innerText = "+"
        buttonInc.setAttribute("aria-label", "Увеличить количество")
        buttonInc.onclick = () => changeQty(bookId, 1)

        let subtotal = document.createElement("span")
        subtotal.classList.add("cart-item-subtotal")
        subtotal.innerText = book.price * qty + " ₽"

        qtyBlock.append(buttonDec, qtyValue, buttonInc, subtotal)

        let buttonDelete = document.createElement("button")
        buttonDelete.type = "button"
        buttonDelete.classList.add("button-delete")
        buttonDelete.innerText = "X"
        buttonDelete.setAttribute("aria-label", "Удалить товар")
        buttonDelete.onclick = () => removeFromCart(bookId)

        infoBooks.append(titleBook, priceBook, qtyBlock)

        item.append(imgItem, infoBooks, buttonDelete)

        cartList.append(item)

        summa += book.price * qty
    })

    let totalPrice = document.createElement("p")
    totalPrice.classList.add("cart-total")

    let totalLabel = document.createElement("b")
    totalLabel.textContent = "Итого:"
    totalPrice.append(totalLabel, " " + summa + " ₽")
    cartList.append(totalPrice)
}

function changeQty(bookId, delta) {
    if (delta > 0) {
        cart.list.push(bookId)
    } else {
        let index = cart.list.indexOf(bookId)
        if (index !== -1) cart.list.splice(index, 1)
    }

    saveCart()
    renderCart()
}

function removeFromCart(bookId) {
    cart.list = cart.list.filter((id) => id !== bookId)
    saveCart()
    renderCart()
}

function clearFieldError(input) {
    if (input.classList.contains("invalid")) {
        input.classList.remove("invalid")
        secError.textContent = ""
    }
}

function validationName(e) {
    let regName = /^[а-яёa-z-]{2,}$/i

    if (!regName.test(inputForName.value.trim())) {
        messages.push("Error name")
        if (inputForName == e.target) {
            inputForName.classList.add("invalid")
            secError.textContent = "Введите корректное имя"
        }
    } else {
        clearFieldError(inputForName)
    }
}

function validationSurname(e) {
    let regSurname = /^[а-яёa-z-]{2,}$/i

    if (!regSurname.test(inputForSurname.value.trim())) {
        messages.push("Error surname")
        if (inputForSurname == e.target) {
            inputForSurname.classList.add("invalid")
            secError.textContent = "Введите корректную фамилию"
        }
    } else {
        clearFieldError(inputForSurname)
    }
}

function validationPhone(e) {
    let digits = inputForPhone.value.replace(/\D/g, "")

    if (digits.length < 10 || digits.length > 15) {
        messages.push("Error phone")
        if (inputForPhone == e.target) {
            inputForPhone.classList.add("invalid")
            secError.textContent = "Введите корректный номер телефона"
        }
    } else {
        clearFieldError(inputForPhone)
    }
}

function validationAddress(e) {
    if (inputForAddress.value.trim().length < 5) {
        messages.push("Error address")
        if (inputForAddress == e.target) {
            inputForAddress.classList.add("invalid")
            secError.textContent = "Введите адрес доставки"
        }
    } else {
        clearFieldError(inputForAddress)
    }
}

function validBlur(e) {
    messages = []
    validationName(e)
    validationSurname(e)
    validationPhone(e)
    validationAddress(e)
    makeButtonAvaluable()
}

function makeButtonAvaluable() {
    buttonSubmit.disabled = messages.length > 0
}

function popupOrder() {
    orderTitle.innerText = "Заказ создан!"
    orderCustomer.innerText = "Заказчик: " + inputForName.value.trim() + " " + inputForSurname.value.trim()
    orderPhone.innerText = "Телефон: " + inputForPhone.value.trim()
    orderAddress.innerText = "Адрес: " + inputForAddress.value.trim()
    orderPickup.innerText = inputForPickup.value
        ? "Пункт выдачи: " + inputForPickup.options[inputForPickup.selectedIndex].text
        : ""

    showWin()

    cart = {list: []}
    saveCart()
    renderCart()

    formAction.reset()
    formAction.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"))
    secError.textContent = ""
    formAction.hidden = true
    buttonOrder.hidden = false
    buttonSubmit.disabled = true
}

function showWin() {
    windowOrder.classList.add("show-window")
}

function removeModal() {
    windowOrder.classList.remove("show-window")
}

window.onload = init;

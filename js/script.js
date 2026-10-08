let cart = [],
    bookList,
    bagBook,
    cartCount

function init() {
    cart = (JSON.parse(localStorage.getItem("cart")) || {list: []}).list
    if (!Array.isArray(cart)) cart = []

    bookList = document.querySelector(".main-content")
    bagBook = document.querySelector(".bag-book")
    cartCount = document.querySelector(".cart-count")

    yarns.forEach((book, bookId) => {
        let bookElem = addBook(book, bookId)

        bookElem.append(popup(book))
        bookList.append(bookElem)

        initPopupOnHover(bookElem)
    })

    makeEventAddBook()
    makeEventDragOnBag()
    makeEventOpenOrder()
    updateCartCount()
}

function addBook(book, bookId) {
    let bookElem = document.createElement("article")
    bookElem.classList.add("book-card")

    bookElem.draggable = true
    bookElem.dataset.bookId = bookId

    let imgBook = document.createElement("img")
    imgBook.classList.add("imgCard")
    imgBook.setAttribute('src', new URL(book.imageLink, DATA_ROOT).href)
    imgBook.draggable = false
    bookElem.append(imgBook);

    let nameBook = document.createElement("h3")
    nameBook.classList.add("name-book")
    nameBook.textContent = book.title
    bookElem.append(nameBook)

    let priceBook = document.createElement("p")
    priceBook.classList.add("price-book")

    let priceLabel = document.createElement("b")
    priceLabel.textContent = "Цена:"

    let currency = document.createElement("span")
    currency.classList.add("currency")
    currency.textContent = "₽"

    priceBook.append(priceLabel, ` ${book.price} `, currency)
    bookElem.append(priceBook)

    let sectionForButton = document.createElement("div")
    sectionForButton.classList.add("section-for-button")

    let showMore = document.createElement("button")
    showMore.type = "button"
    showMore.classList.add("show-more")
    showMore.innerText = "Подробнее"

    let addBookBag = document.createElement("button")
    addBookBag.type = "button"
    addBookBag.classList.add("add-bag")
    addBookBag.innerText = "Добавить в корзину"

    sectionForButton.append(showMore)
    sectionForButton.append(addBookBag)

    bookElem.append(sectionForButton)

    bookElem.ondragstart = drag;

    return bookElem
}

function popup(book) {
    let modalWin = document.createElement("section")
    modalWin.classList.add("modal-win")

    let nameBookMod = document.createElement("h3")
    nameBookMod.classList.add("name-book-mod")
    nameBookMod.textContent = book.title

    let describeBook = document.createElement("p")
    describeBook.classList.add("describe-book")
    describeBook.textContent = book.description

    modalWin.append(nameBookMod, describeBook)

    return modalWin
}

function initPopupOnHover(bookElem) {
    let modalWin = bookElem.querySelector(".modal-win")
    let showMore = bookElem.querySelector(".show-more")
    let hideTimer

    let show = () => {
        clearTimeout(hideTimer)
        modalWin.classList.add("show-win")
    }

    let hide = () => {
        clearTimeout(hideTimer)
        hideTimer = setTimeout(() => modalWin.classList.remove("show-win"), 200)
    }

    showMore.addEventListener("mouseenter", show)
    showMore.addEventListener("mouseleave", hide)
    modalWin.addEventListener("mouseenter", show)
    modalWin.addEventListener("mouseleave", hide)
}

function makeEventAddBook() {
    let allButton = document.querySelectorAll(".add-bag")
    for (let elem of allButton) {
        let card = elem.closest(".book-card")
        elem.addEventListener("click", () => {
            addToCart(card.dataset.bookId)
        })
    }
}

function makeEventDragOnBag() {
    bagBook.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    bagBook.addEventListener("drop", drop)
    bagBook.addEventListener("click", openCart)
}

function makeEventOpenOrder() {
    let buttonOrder = document.querySelector(".button-order-open")
    if (buttonOrder) buttonOrder.addEventListener("click", createOrder)
}

function drag(e) {
    e.dataTransfer.setData("id", e.currentTarget.dataset.bookId)
}

function drop(e) {
    e.preventDefault();
    addToCart(e.dataTransfer.getData("id"))
    e.currentTarget.classList.add("over")
    setTimeout(() => e.currentTarget.classList.remove("over"), 400)
}

function addToCart(bookId) {
    cart.push(bookId)
    saveCart()
    updateCartCount()
}

function updateCartCount() {
    if (!cartCount) return
    cartCount.innerText = cart.length
    cartCount.hidden = cart.length === 0
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify({list: cart}))
}

function openCart() {
    saveCart()
    window.location.href = "cart/cart.html"
}

function createOrder() {
    saveCart()
    window.location.href = "cart/cart.html?order=1"
}

window.onload = init;

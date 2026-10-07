let cart = [],
    bookList,
    bagBook

function init() {
    cart = (JSON.parse(localStorage.getItem("cart")) || {list: []}).list

    bookList = document.querySelector(".main-content")
    bagBook = document.querySelector(".bag-book")

    books.forEach((book, bookId) => {
        let bookElem = addBook(book, bookId)

        bookElem.append(popup(book))
        bookList.append(bookElem)

        initPopupOnHover(bookElem)
    })

    makeEventAddBook()
    makeEventDragOnBag()
}

function addBook(book, bookId) {
    let bookElem = document.createElement("section")
    bookElem.classList.add("book-card")

    bookElem.draggable = true
    bookElem.dataset.bookId = bookId

    let imgBook = document.createElement("img")
    imgBook.classList.add("imgCard")
    imgBook.setAttribute('src', book.imageLink)
    imgBook.draggable = false
    bookElem.append(imgBook);

    let nameBook = document.createElement("h3")
    nameBook.classList.add("name-book")
    nameBook.innerHTML = book.title
    bookElem.append(nameBook)

    let priceBook = document.createElement("p")
    priceBook.classList.add("price-book")
    priceBook.innerHTML = `<b>Цена:</b> ${book.price} <span class="currency">₽</span>`
    bookElem.append(priceBook)

    let sectionForButton = document.createElement("div")
    sectionForButton.classList.add("section-for-button")

    let showMore = document.createElement("span")
    showMore.classList.add("show-more")
    showMore.innerText = "Подробнее"

    let addBookBag = document.createElement("button")
    addBookBag.classList.add("add-bag")
    addBookBag.innerText = "В корзину"

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
    nameBookMod.innerHTML = book.title

    let describeBook = document.createElement("p")
    describeBook.classList.add("describe-book")
    describeBook.innerHTML = book.description

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

function drag(e) {
    e.dataTransfer.setData("id", e.currentTarget.dataset.bookId)
    e.currentTarget.classList.add('over');
}

function drop(e) {
    e.preventDefault();
    addToCart(e.dataTransfer.getData("id"))
    e.currentTarget.classList.add('over');
}

function addToCart(bookId) {
    cart.push(bookId)
    saveCart()
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
    window.location.href = "cart/cart.html"
}

window.onload = init;

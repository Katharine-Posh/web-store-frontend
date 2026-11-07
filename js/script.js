let cart = [],
    yarnList,
    bagYarn

function init() {
    cart = (JSON.parse(localStorage.getItem("cart")) || {list: []}).list
    if (!Array.isArray(cart)) cart = []

    yarnList = document.querySelector(".main-content")
    bagYarn = document.querySelector(".bag-yarn")

    yarns.forEach((yarn, yarnId) => {
        let yarnElem = addYarn(yarn, yarnId)

        yarnElem.append(popup(yarn))
        yarnList.append(yarnElem)

        initPopupOnHover(yarnElem)
    })

    makeEventAddYarn()
    makeEventDragOnBag()
}

function addYarn(yarn, yarnId) {
    let yarnElem = document.createElement("article")
    yarnElem.classList.add("yarn-card")

    yarnElem.draggable = true
    yarnElem.dataset.yarnId = yarnId

    let imgYarn = document.createElement("img")
    imgYarn.classList.add("imgCard")
    imgYarn.setAttribute('src', new URL(yarn.imageLink, DATA_ROOT).href)
    imgYarn.draggable = false
    yarnElem.append(imgYarn);

    let nameYarn = document.createElement("h3")
    nameYarn.classList.add("name-yarn")
    nameYarn.textContent = yarn.title
    yarnElem.append(nameYarn)

    let priceYarn = document.createElement("p")
    priceYarn.classList.add("price-yarn")

    let priceLabel = document.createElement("b")
    priceLabel.textContent = "Цена:"

    let currency = document.createElement("span")
    currency.classList.add("currency")
    currency.textContent = "₽"

    priceYarn.append(priceLabel, ` ${yarn.price} `, currency)
    yarnElem.append(priceYarn)

    let sectionForButton = document.createElement("div")
    sectionForButton.classList.add("section-for-button")

    let showMore = document.createElement("button")
    showMore.type = "button"
    showMore.classList.add("show-more")
    showMore.innerText = "Подробнее"

    let addYarnBag = document.createElement("button")
    addYarnBag.type = "button"
    addYarnBag.classList.add("add-bag")
    addYarnBag.innerText = "Добавить в корзину"

    sectionForButton.append(showMore)
    sectionForButton.append(addYarnBag)

    yarnElem.append(sectionForButton)

    yarnElem.ondragstart = drag;

    return yarnElem
}

function popup(yarn) {
    let modalWin = document.createElement("section")
    modalWin.classList.add("modal-win")

    let nameYarnMod = document.createElement("h3")
    nameYarnMod.classList.add("name-yarn-mod")
    nameYarnMod.textContent = yarn.title

    let describeYarn = document.createElement("p")
    describeYarn.classList.add("describe-yarn")
    describeYarn.textContent = yarn.description

    modalWin.append(nameYarnMod, describeYarn)

    return modalWin
}

function initPopupOnHover(yarnElem) {
    let modalWin = yarnElem.querySelector(".modal-win")
    let showMore = yarnElem.querySelector(".show-more")
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

function makeEventAddYarn() {
    let allButton = document.querySelectorAll(".add-bag")
    for (let elem of allButton) {
        let card = elem.closest(".yarn-card")
        elem.addEventListener("click", () => {
            addToCart(card.dataset.yarnId)
        })
    }
}

function makeEventDragOnBag() {
    bagYarn.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    bagYarn.addEventListener("drop", drop)
    bagYarn.addEventListener("click", openCart)
}

function drag(e) {
    e.dataTransfer.setData("id", e.currentTarget.dataset.yarnId)
}

function drop(e) {
    e.preventDefault();
    addToCart(e.dataTransfer.getData("id"))
    e.currentTarget.classList.add("over")
    setTimeout(() => e.currentTarget.classList.remove("over"), 400)
}

function addToCart(yarnId) {
    cart.push(yarnId)
    saveCart()
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify({list: cart}))
}

function openCart() {
    saveCart()
    window.location.href = "cart/cart.html"
}

window.onload = init;

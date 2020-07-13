
// Book Class

class Book {
  constructor(title, author, pages, read, description = "", flipped = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.description = description;
    this.flipped = flipped;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read" : "not read yet"}`;
  }
  
  toggleRead() {
    this.read = !this.read;
    saveLibrary();
  }
}

// Script

let myLibrary = [];
const book1 = new Book("A Game of Thrones", "George R R Martin", 694 , true, "The first book of the series A Song of Ice and Fire");
const book2 = new Book("A Clash of Kings", "George R R Martin", 761 , false, "The second book of the series A Song of Ice and Fire");
const book3 = new Book("A Storm of Swords", "George R R Martin", 973 , false, "The third book of the series A Song of Ice and Fire");
myLibrary = [book1, book2, book3];
loadLibrary();

document.querySelector(".card-front").addEventListener("click", function() {
  flip(this.parentElement);
})
document.querySelector(".cancel").addEventListener("click", function(e) {
  e.preventDefault();
  flip(this.closest(".card"));
})
document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  addBookToLibrary();
})

render();

// Events

function deleteBook(index) {
  myLibrary.splice(index, 1);
  saveLibrary();
}

function closeForm() {
  document.getElementById("bookForm").style.display = "none";
}

function flip(item) {
  if (item.classList.contains("flip")) {
    item.classList.remove("flip")
    if (item.dataset.index) {
        myLibrary[item.dataset.index].flipped = false;
    }
  } else {
    item.classList.add("flip");
    if (item.dataset.index) {
      myLibrary[item.dataset.index].flipped = true;
    }
  }
  saveLibrary();
}

// Save/Load

function saveLibrary() {
  localStorage.library = JSON.stringify(myLibrary);
}

function loadLibrary() {
  if (localStorage.library) {
    libraryInfo = JSON.parse(localStorage.library);
    for (let i=0; i<libraryInfo.length; i++) {
      book = libraryInfo[i];
      myLibrary[i] = new Book(book.title, book.author, book.pages, book.read, book.description, book.flipped);
    }
  }
}

// Helpers

function addBookToLibrary() {
  var title = document.getElementById("title");
  if (!title.checkValidity()) {
    return;
  }
  title = title.value;
  const author = document.getElementById("author").value;
  var pages = document.getElementById("pages");
  if (!pages.checkValidity()) {
    return;
  }
  pages = pages.value;
  var read = document.getElementById("read");
  if (!read.checkValidity()) {
    return;
  }
  read = read.checked
  const description = document.getElementById("description").value;
  myLibrary.push(new Book(title, author, pages, read, description));
  // saveLibrary();
  flip(document.getElementById("add-book"));
  render();
}

function createItem(element, klass, parent) {
  item = document.createElement(element);
  klassList = klass.split(" ");
  klassList.forEach(element => {
    item.classList.add(element);
  });
  if (parent) {
    parent.appendChild(item);
  }
  return item;
}

function createDeleteButton(index, card) {
  deleteButton = document.createElement("input");
  deleteButton.type = "button";
  deleteButton.value = "Delete";
  deleteButton.dataset.index = index;
  deleteButton.addEventListener("click", function() {
    event.stopPropagation();
    deleteBook(this.dataset.index);
    render();
  })
  card.appendChild(deleteButton);
  return deleteButton;
}

function createBookElement(itemName, index, card) {
  item = document.createElement("p");
  item.innerHTML = myLibrary[index][itemName];
  if (itemName == "pages") {
    item.innerHTML = item.innerHTML + " pages";
  }
  item.id = itemName + index;
  item.classList.add(itemName);
  card.appendChild(item);
  return item;
}

function createMarkAsReadButton(index, card) {
  markButton = document.createElement("input");
  markButton.type = "button";
  markButton.value = `Mark as ${myLibrary[index].read ? "unread" : "read"}`;
  markButton.addEventListener("click", function() {
    event.stopPropagation();
    card = this.closest(".card");
    myLibrary[card.dataset.index].toggleRead();
    this.value = `Mark as ${myLibrary[card.dataset.index].read ? "unread" : "read"}`;
    addReadClass(card.dataset.index, card);
    addReadClass(card.dataset.index, card.querySelector(".card-back"));
    // render();
  })
  card.appendChild(markButton);
  return markButton;
}

function addButtons(index, parent) {
  container = createItem("div", "form-group card-buttons", parent);
  createMarkAsReadButton(index, container);
  createDeleteButton(index, container);
}

function addReadClass(index, element) {
  if (myLibrary[index].read) {
    element.classList.add("read");
  } else {
    element.classList.remove("read");
  }
}

function createCardFront(index, parent) {
  cardFront = createItem("div", "card-front", parent);
  createBookElement("title", index, cardFront);
  createBookElement("author", index, cardFront);
  return cardFront;
}

function createCardBack(index, parent) {
  cardBack = createItem("div", "card-back", parent);
  createBookElement("title", index, cardBack);
  createBookElement("author", index, cardBack);
  createBookElement("pages", index, cardBack);
  createBookElement("description", index, cardBack);
  addButtons(index, cardBack);
  addReadClass(index, cardBack);
  return cardBack;
}

function createCard(index) {
  card = createItem("div", "card", wrapper);
  if (myLibrary[index].flipped) {
    card.classList.add("flip");
  }
  card.dataset.index = index;
  card.addEventListener("click", function() {
    flip(this);
  })
  addReadClass(index, card);
  return card;
}

function addCardFromLibrary(index) {
  wrapper = createItem("div", "wrapper", false);
  card = createCard(index);
  cardFront = createCardFront(index, card);
  cardBack = createCardBack(index, card);
  
  if (myLibrary[index].read) {
    card.classList.add("read");
    cardBack.classList.add("read");
  }
  
  document.getElementById("container").appendChild(wrapper);
}

function render() {
  container = document.getElementById("container")
  while (container.childNodes.length > 2) {
    container.removeChild(container.lastChild);
  }
  for (let i=0; i<myLibrary.length; i++) {
    addCardFromLibrary(i);
  }
}


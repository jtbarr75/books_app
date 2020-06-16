
const book1 = new Book("A Game of Thrones", "George R R Martin", 694 , true);
const book2 = new Book("A Clash of Kings", "George R R Martin", 761 , false);
const book3 = new Book("A Storm of Swords", "George R R Martin", 973 , false);
let myLibrary = [book1, book2, book3];


document.querySelector(".card-front").addEventListener("click", function() {
  flip(this.parentElement);
})
document.querySelector(".cancel").addEventListener("click", function() {
  flip(this.closest(".card"));
})

function Book(title, author, pages, read, description = "") {
  this.title = title;
  this.author = author;
  this.pages = pages + " pages";
  this.read = read;
  this.description = description;
  this.flipped = false;
  this.info = function() {
    return `${title} by ${author}, ${pages} pages, ${read ? "read" : "not read yet"}`;
  }
}

function addBookToLibrary() {
  title = document.getElementById("title").value;
  author = document.getElementById("author").value;
  pages = document.getElementById("pages").value;
  read = document.getElementById("read").checked;
  description = document.getElementById("description").value;
  myLibrary.push(new Book(title, author, pages, read, description));
  flip(document.getElementById("add-book"));
  render();
}

function deleteBook(index) {
  myLibrary.splice(index, 1);
}

function createDeleteButton(index) {
  deleteButton = document.createElement("input");
  deleteButton.type = "button";
  deleteButton.value = "Delete";
  deleteButton.dataset.index = index;
  deleteButton.addEventListener("click", function() {
    deleteBook(this.dataset.index);
    render();
  })
  return deleteButton;
}

function createBookElement(itemName, index, card) {
  item = document.createElement("p");
  item.innerHTML = myLibrary[index][itemName];
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
    myLibrary[this.closest(".card").dataset.index].toggleRead();
    render();
  })
  card.appendChild(markButton);
  return markButton;
}

function createItem(element, klass, parent) {
  item = document.createElement(element);
  item.classList.add(klass);
  if (parent) {
    parent.appendChild(item);
  }
  return item;
}

function addCardFromLibrary(index) {
  wrapper = createItem("div", "wrapper", false);
  card = createItem("div", "card", wrapper);
  if (myLibrary[index].flipped) {
    card.classList.add("flip");
  }
  
  card.dataset.index = index;
  card.addEventListener("click", function() {
    flip(this);
  })

  cardFront = createItem("div", "card-front", card);
  createBookElement("title", index, cardFront);
  createBookElement("author", index, cardFront);

  cardBack = createItem("div", "card-back", card);
  createBookElement("title", index, cardBack);
  createBookElement("author", index, cardBack);
  createBookElement("pages", index, cardBack);
  createBookElement("description", index, cardBack);
  read = document.createElement("p");
  read.innerHTML = myLibrary[index]["read"] ? "I've read this book" : "I haven't read this yet";
  cardBack.appendChild(read);
  createMarkAsReadButton(index, cardBack);

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
}

function openForm() {
  document.getElementById("bookForm").style.display = "flex";
}

function closeForm() {
  document.getElementById("bookForm").style.display = "none";
}

Book.prototype.toggleRead = function() {
  this.read = !this.read;
}

render();
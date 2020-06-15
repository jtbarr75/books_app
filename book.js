
const book1 = new Book("A Game of Thrones", "George R R Martin", 694 , true);
const book2 = new Book("A Clash of Kings", "George R R Martin", 761 , false);
const book3 = new Book("A Storm of Swords", "George R R Martin", 973 , false);
let myLibrary = [book1, book2, book3];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function() {
    return `${title} by ${author}, ${pages} pages, ${read ? "read" : "not read yet"}`;
  }
}

function addBookToLibrary() {
  title = document.getElementById("title").value;
  author = document.getElementById("author").value;
  pages = document.getElementById("pages").value;
  read = document.getElementById("read").checked;
  myLibrary.push(new Book(title, author, pages, read));
  closeForm();
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
  console.log(item.id);
  card.appendChild(item);
}

function createMarkAsReadButton(index, card) {
  container = card.querySelector(`#read${index}`);
  console.log(`read${index}`);
  markButton = document.createElement("input");
  markButton.type = "button";
  markButton.value = `Mark as ${myLibrary[index].read ? "unread" : "read"}`;
  markButton.dataset.index = index;
  markButton.addEventListener("click", function() {
    myLibrary[this.dataset.index].toggleRead();
    render();
  })
  container.appendChild(markButton);
  return container;
}

function addRowFromLibrary(index) {
  wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");
  card = document.createElement("div");
  card.classList.add("card");
  wrapper.appendChild(card);

  createBookElement("title", index, card);
  createBookElement("author", index, card);
  // createBookElement("pages", index, content);
  // createBookElement("read", index, content);
  // markButton = createMarkAsReadButton(index, content);
  // content.appendChild(markButton);
  // deleteButton = createDeleteButton(index);
  // content.appendChild(deleteButton);
  
  document.getElementById("main").appendChild(wrapper);
}

function render() {
  container = document.getElementById("main")
  while (container.childNodes.length > 2) {
    container.removeChild(container.lastChild);
  }
  for (let i=0; i<myLibrary.length; i++) {
    addRowFromLibrary(i);
  }
}

function openForm() {
  document.getElementById("bookForm").style.display = "block";
}

function closeForm() {
  document.getElementById("bookForm").style.display = "none";
}

Book.prototype.toggleRead = function() {
  this.read = !this.read;
}

render();

// Book class: Represents a book
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

// UI Class: handle UI tasks
class UI {
	static displayBooks() {

		const books = Store.getBooks();

		books.forEach(book => UI.addBookToList(book));
	}

	static addBookToList(book) {
		const list = document.querySelector("#book-list");

		const row = document.createElement("tr");

		row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn--red delete">&times;</a></td>
        `;
		list.appendChild(row);
	}

	static showAlert(message, className) {
			const div = document.createElement("div");
			div.className = `alert alert--${className}`;
			div.appendChild(document.createTextNode(message));
			const container = document.querySelector(".inner-content");
			const form = document.querySelector("#book-form");
			container.insertBefore(div, form);

			// Vanish in 3 seconds
			setTimeout(() => document.querySelector(".alert").remove(), 3000);
	}

	static clearField() {
		document.querySelector("#title").value = "";
		document.querySelector("#author").value = "";
		document.querySelector("#isbn").value = "";
	}

	static deleteBook(el) {
		if (el.classList.contains("delete")) {
			el.parentElement.parentElement.remove();
		}
	}
}

// storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static remove(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
                return;
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a book
document.querySelector("#book-form").addEventListener("submit", e => {
	e.preventDefault();
	console.log("Submit button clicked");

	// Get form value
	const title = document.querySelector("#title").value.toUpperCase();
	const author = document.querySelector("#author").value.toUpperCase();
	const isbn = document.querySelector("#isbn").value.toUpperCase();

	// Validate
	if (title === "" || author === "" || isbn === "") {
		UI.showAlert("Please fill in all fields", "danger");
	} else {
		// Instantiate Book
		const book = new Book(title, author, isbn);

		// Add Book to UI
        UI.addBookToList(book);
        
        // Add book to store
        Store.addBook(book);

		// Show success message
		UI.showAlert("Book Added", "success");

		// Clear fields
		UI.clearField();
	}
});

// Event: Remove a book
document.querySelector("#book-list").addEventListener("click", e => {
    UI.deleteBook(e.target);
    
    // Remove book from store
    Store.remove(e.target.parentElement.previousElementSibling.textContent);

	// Show success message
	UI.showAlert("Book Removed", "success");
});

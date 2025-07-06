// Load from Local storage or initialize with defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" },
];

// Load quotes from local storage if available
const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes) {
  quotes = JSON.parse(storedQuotes);
}

// Fuction to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories(){
   const categories = [...new Set(quotes.map(q => q.category))];
  const dropdown = document.getElementById('categoryFilter');
  dropdown.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  const savedCategory = localStorage.getItem('lastSelectedCategory');
  if (savedCategory) {
    dropdown.value = savedCategory;
  }
}

function fetchQuotesFromServer() {
  return fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
    .then(response => response.json())
    .then(data => {
      return data.map(item => ({
        text: item.title,
        category: "Server"
      }));
    });
}


function postQuoteToServer(quote) {
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote)
  });
}
function getLastCategory() {
  return localStorage.getItem("latCategory")|| "all";
}
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available. Add one!";
    return;
  }
  const selectedCategory = document.getElementById('categoryFilter')?.value || 'all';
  const filteredQuotes= selectedCategory ==="all"
     ? quotes
     : quotes.filter((q) => q.category === selectedCategory);

  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available in this category. Add one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><em>— ${quote.category}</em>`;

  // Optional session storage: save last quote
  sessionStorage.setItem("lastQuote", JSON.stringify(quote) )
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill out both the quote and category fields.");
    return;
  }

  // Add the new quote to the array
  quotes.push({ text, category });
  saveQuotes();

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  showRandomQuote();
}

function filterQuotes() {
 const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastSelectedCategory', selectedCategory);
  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  // update DOM logic... 
}


// Notify user of sync or conflict resolution
function showNotification(message) {
  const notification = document.getElementById(notification);
  notification.innerText = message;
  notification.style.display = 'block';
  setTimeout(() =>{
     notification.style.display ='none';
  }, 3000);
}


function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], {type: "application/json"  });
  const url = URL.createObjectURL(blob);


  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}


function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("invalid format");
      quotes.push(...importedQuotes);
      saveQuotes();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch(err) {
      alert("Error importing file: " +err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function syncQuotes(){
  fetchQuotesFromServer().then(serverQuotes => {
    let updated = false;
    serverQuotes.forEach(serverQuote => {
      if (!quotes.find(q => q.text === serverQuote.text)) {
        quotes.push(serverQuote);
        updated = true;
      }
    });
    if (updated) {
      saveQuotes();
      showNotification('Quotes synced from server.');
      populateCategories();
      filterQuotes();
    }
  });
  setInterval(syncQuotes, 10000); // Sync every 10 seconds
}


// Event listener 
window.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  showRandomQuote();
  setInterval(syncWithServer, 10000); // Sync every 10 seconds (for simulation)
});
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

document.getElementById("categoryFilter").addEventListener("change", filterQuotes);


// Initialize app
populateCategories();

const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  document.getElementById('quoteDisplay').innerHTML =
  `<p>"${quote.text}"</p><em>— ${quote.category}</em>`;
} else {
  showRandomQuote();
}

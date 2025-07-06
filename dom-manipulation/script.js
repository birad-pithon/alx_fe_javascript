// Dynamic Quote Generator with Web Storage, Filtering, JSON Import/Export, and Server Sync

let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const lastViewedKey = "lastViewedQuote";

// Load from Local storage or initialize with defaults
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else{
    quote= [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" },
  ];
  saveQuotes();
 }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

  
// Restore last selected category from localstorage
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  document.getElementById('categoryFilter').value = selectedCategory;
  filterQuotes();
});

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

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill out both the quote and category fields.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote);

  textInput.value = '';
  categoryInput.value = '';

  populateCategories();
  filterQuotes();
  showNotification('New quote added!');
}

// Fuction to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories(){
   const categorySet = new Set(['all']);
   quotes.forEach(q => categorySet.add(q.category));

   const categoryFilter = document.getElementById('categoryFilter');
   categoryFilter.innerHTML= '';
   categorySet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
   });
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


function getLastCategory() {
  return localStorage.getItem("latCategory")|| "all";
}
 = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><em>— ${quote.category}</em>`;

  // Optional session storage: save last quote
  sessionStorage.setItem("lastQuote", JSON.stringify(quote) );


function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  selectedCategory = category;
  localStorage.setItem('selectedCategory', category);
  showRandomQuote();
}


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

// --- Server Simulation Functions ---

function fetchQuotesFromServer(){
  return fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
    .then(response => response.json())
    .then(data => {
      return data.map(item => ({
        text: item.title,
        category: "Server"
      }));
    });
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
}

setInterval(syncQuotes, 10000); // Every 10 seconds


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

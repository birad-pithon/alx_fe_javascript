// Load from Local storage or initialize with defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" },
];


function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories(){
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  categoryFilter.innerHTML = categories
    .map(
      (cat) => `<option value="${cat}" ${getLastCategory() === cat ? "selected" : ""}>${cat}</option>`
    )
    .join("");
}

function getLastCategory() {
  return localStorage.getItem("latCategory")|| "all";
}
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const selectedCategory = getLastCategory();
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
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);
  showRandomQuote();
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
// Event listener 
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

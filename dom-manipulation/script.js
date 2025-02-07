const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL
let quotes = JSON.parse(localStorage.getItem("quotes")) || []; // Get quotes from local storage

// Function to render quotes
function renderQuotes() {
  const filterCategory = localStorage.getItem("filterCategory") || "all";
  const quotesList = document.getElementById("quotesList");
  quotesList.innerHTML = "";

  const filteredQuotes = filterCategory === "all"
    ? quotes
    : quotes.filter(quote => quote.category === filterCategory);

  filteredQuotes.forEach(quote => {
    const li = document.createElement("li");
    li.textContent = `${quote.text} (${quote.category})`;
    quotesList.appendChild(li);
  });
}

// Function to populate categories dropdown
function populateCategories() {
  const categories = new Set(quotes.map(quote => quote.category));
  const categoryFilter = document.getElementById("categoryFilter");

  categoryFilter.innerHTML = "<option value='all'>All Categories</option>";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastSelectedCategory = localStorage.getItem("filterCategory") || "all";
  categoryFilter.value = lastSelectedCategory;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes)); // Save to local storage
    renderQuotes();
    populateCategories();
    postQuoteToServer(newQuote);
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("filterCategory", selectedCategory);
  renderQuotes();
}

// Simulate fetching quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(post => ({ text: post.title, category: "ServerGenerated" }));
    syncQuotes(serverQuotes);
  } catch (error) {
    console.error("Error fetching data from the server", error);
  }
}

// Function to periodically fetch quotes from the server
function startServerSync() {
  setInterval(fetchQuotesFromServer, 10000);
}

startServerSync();

// Sync local quotes with server quotes
function syncQuotes(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = localQuotes.findIndex(
      quote => quote.category === serverQuote.category
    );

    if (existingQuoteIndex !== -1) {
      localQuotes[existingQuoteIndex] = serverQuote;
    } else {
      localQuotes.push(serverQuote);
    }
  });

  localStorage.setItem("quotes", JSON.stringify(localQuotes));
  renderQuotes();
  showSyncNotification();
}

// Function to show a notification when data is synced
function showSyncNotification() {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = "Quotes synced with server!";
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

// Function to resolve conflicts manually
function resolveConflictsManually() {
  console.log("Conflict resolution functionality to be added.");
  const message = document.createElement("div");
  message.classList.add("info-message");
  message.textContent = "Conflict resolution feature is coming soon!";
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 3000);
}

// Function to export quotes to a JSON file
function exportQuotes() {
  const quotesBlob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(quotesBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    renderQuotes();
    showSyncNotification();
  };
  fileReader.readAsText(event.target.files[0]);
}

// POST request to send the new quote to the mock API
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: quote.text, category: quote.category })
    });

    if (response.ok) {
      console.log("Quote successfully posted to the server!");
    } else {
      console.log("Failed to post quote to server!");
    }
  } catch (error) {
    console.error("Error posting data to the server", error);
  }
}

// Initial render and category population
renderQuotes();
populateCategories();

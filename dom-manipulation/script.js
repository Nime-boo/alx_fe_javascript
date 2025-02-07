const API_URL = "https://jsonplaceholder.typicode.com/posts";
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

function renderQuotes() {
  const filterCategory = localStorage.getItem("filterCategory") || "all";
  const quotesList = document.getElementById("quotesList");
  quotesList.innerHTML = "";

  const filteredQuotes = filterCategory === "all" ? quotes : quotes.filter(quote => quote.category === filterCategory);

  filteredQuotes.forEach(quote => {
    const li = document.createElement("li");
    li.textContent = `${quote.text} (${quote.category})`;
    quotesList.appendChild(li);
  });
}

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
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    renderQuotes();
    populateCategories();
    postQuoteToServer(newQuote);
    alert("New quote added successfully!");
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("filterCategory", selectedCategory);
  renderQuotes();
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "ServerGenerated"
    }));
    syncQuotes(serverQuotes);
  } catch (error) {
    console.error("Error fetching data from the server", error);
  }
}

function startServerSync() {
  setInterval(fetchQuotesFromServer, 10000);
}

startServerSync();

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
  alert("Quotes have been synced with the server!");
}

function showSyncNotification() {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = "Quotes synced with server!";
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

function exportQuotes() {
  const quotesBlob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(quotesBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
  alert("Quotes exported successfully!");
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    renderQuotes();
    showSyncNotification();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: quote.text,
        category: quote.category
      })
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

renderQuotes();
populateCategories();

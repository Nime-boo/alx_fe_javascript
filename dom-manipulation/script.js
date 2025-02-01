// Initialize the quotes array from localStorage if available, or use an empty array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes)); // Save quotes array to localStorage
}

// Function to show a random quote
function showRandomQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory
    };

    quotes.push(newQuote);
    saveQuotes(); // Save the updated quotes array to localStorage
    document.getElementById('newQuoteText').value = ''; // Clear input field
    document.getElementById('newQuoteCategory').value = ''; // Clear input field

    // Update the category dropdown dynamically
    populateCategories();

    alert('Quote added successfully!');
  } else {
    alert('Please enter both quote text and category!');
  }
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = new Set(); // To store unique categories

  // Loop through quotes and add categories to the set
  quotes.forEach(quote => {
    categories.add(quote.category);
  });

  // Clear the existing options except for "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add categories to the dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Retrieve the last selected category from localStorage and set it
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  categoryFilter.value = lastSelectedCategory;

  // Apply the filter initially based on the last selected category
  filterQuotes();
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  // Save the selected category to localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear the current display

  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Function to export quotes to JSON
function exportToJson() {
  const quotesJson = JSON.stringify(quotes, null, 2); // Convert quotes array to JSON string
  const blob = new Blob([quotesJson], { type: 'application/json' }); // Create a Blob
  const url = URL.createObjectURL(blob); // Create a temporary URL for the Blob

  const a = document.createElement('a'); // Create an <a> element
  a.href = url; // Set the URL as the href
  a.download = 'quotes.json'; // Set the download attribute to specify the filename
  document.body.appendChild(a); // Append the <a> element to the body
  a.click(); // Trigger the download by simulating a click
  document.body.removeChild(a); // Clean up by removing the <a> element
  URL.revokeObjectURL(url); // Revoke the object URL to free up memory
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes); // Add the imported quotes to the current quotes array
    saveQuotes(); // Save the updated quotes array to localStorage
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]); // Read the selected file as text
}

// Initialize event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote); // Display random quote on button click
document.getElementById('exportQuotes').addEventListener('click', exportToJson); // Export quotes when Export button is clicked

// Load existing quotes from localStorage when the page is loaded
window.onload = function() {
  if (quotes.length > 0) {
    populateCategories(); // Populate categories dropdown on load
    showRandomQuote(); // Show a random quote if there are quotes in localStorage
  }
};

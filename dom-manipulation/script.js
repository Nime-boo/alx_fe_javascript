// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to export quotes as a JSON file
  function exportToJson() {
    const quotesJson = JSON.stringify(quotes, null, 2); // Converts quotes array to JSON string
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
      try {
        const importedQuotes = JSON.parse(event.target.result); // Parse the JSON from the file
        quotes.push(...importedQuotes); // Add the imported quotes to the existing array
        saveQuotes(); // Save the updated quotes to localStorage
        alert('Quotes imported successfully!');
      } catch (error) {
        alert('Failed to import quotes. Please ensure the file is a valid JSON.');
      }
    };
    fileReader.readAsText(event.target.files[0]); // Read the file as text
  }
  
  // Function to create the add quote form
  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    
    // Create input for new quote text
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
  
    // Create input for quote category
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
  
    // Create add button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;
  
    // Append the inputs and button to the form container
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
  
    // Append the form container to the body or a specific div in your HTML
    document.body.appendChild(formContainer);
  }
  
  // Function to initialize and show random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    // Display the quote in the #quoteDisplay div
    document.getElementById('quoteDisplay').innerHTML = `
      <p><strong>Category:</strong> ${randomQuote.category}</p>
      <p>"${randomQuote.text}"</p>
    `;
  
    // Store the last viewed quote index in sessionStorage
    sessionStorage.setItem('lastViewedQuote', randomIndex);
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Check if both fields are filled
    if (newQuoteText && newQuoteCategory) {
      // Add new quote to the array
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      // Save the updated quotes array to localStorage
      saveQuotes();
  
      // Clear the input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Optionally show the newly added quote immediately
      showRandomQuote();
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // Function to load quotes from localStorage (if any)
  function loadQuotesFromLocalStorage() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      return JSON.parse(savedQuotes); // Parse the saved JSON string back to an array
    }
    return []; // Return an empty array if no quotes are stored
  }
  
  // Array to store quote objects (initialize with localStorage data)
  let quotes = loadQuotesFromLocalStorage();
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initialize by showing a random quote or last viewed quote
  if (quotes.length > 0) {
    // Check if there is any quote in localStorage and show the last viewed quote if possible
    const lastViewedQuoteIndex = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuoteIndex) {
      // Display the last viewed quote from sessionStorage
      document.getElementById('quoteDisplay').innerHTML = `
        <p><strong>Category:</strong> ${quotes[lastViewedQuoteIndex].category}</p>
        <p>"${quotes[lastViewedQuoteIndex].text}"</p>
      `;
    } else {
      showRandomQuote(); // Show a random quote if no last viewed quote is found
    }
  }
  
  // Call the function to create the add quote form
  createAddQuoteForm();
  
  // Add buttons for JSON Import and Export
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export Quotes to JSON';
  exportButton.onclick = exportToJson;
  document.body.appendChild(exportButton);
  
  const importButton = document.createElement('input');
  importButton.type = 'file';
  importButton.id = 'importFile';
  importButton.accept = '.json';
  importButton.onchange = importFromJsonFile;
  document.body.appendChild(importButton);
  
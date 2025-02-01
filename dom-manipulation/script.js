// Array to store quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspiration" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Display the quote in the #quoteDisplay div
    document.getElementById('quoteDisplay').innerHTML = `
      <p><strong>Category:</strong> ${randomQuote.category}</p>
      <p>"${randomQuote.text}"</p>
    `;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Check if both fields are filled
    if (newQuoteText && newQuoteCategory) {
      // Add new quote to the array
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      // Clear the input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Optionally show the newly added quote immediately
      showRandomQuote();
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initialize by showing a random quote
  showRandomQuote();
  
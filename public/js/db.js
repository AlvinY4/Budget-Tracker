 
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
}; 

request.onsuccess = function(event) {
    db = event.target.results; 
    if (navigator.onLine) {
        getTransaction(); 
    }
};

request.onerror = function(event) {
    console.log(event.target.errorcode); 
}; 

function getTransaction() {
    const transaction = db.transaction(["pending"], "readwrite");
    const budgetObjectStore = transaction.objectStore("pending");
    const getAll = budgetObjectStore.getAll();
  
    getAll.onsuccess = function() {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const budgetObjectStore = transaction.objectStore("pending");
          budgetObjectStore.clear();
        });
      }
    };
}

function saveRecord(record) {
    const transaction = db.transaction(["pending"], 'readwrite'); 
    const budgetObjectStore = transaction.objectstore("pending"); 
    budgetObjectStore.add(record); 
}; 

window.addEventListener('online', getTransaction); 
var searchInput = document.getElementById("searchInput");
var autocompleteItems = document.getElementById("autocompleteItems");

searchInput.addEventListener("input", function() {
    var input = this.value;
    if (input.length === 0) {
        autocompleteItems.innerHTML = "";
        autocompleteItems.style.display = "none";
        return;
    }

    // Simulate data for autocomplete
    var fruits = ["Apple", "Orange", "Banana", "Mango", "Strawberry"];
    var suggestions = fruits.filter(function(fruit) {
        return fruit.toLowerCase().startsWith(input.toLowerCase());
    });

    // Display autocomplete suggestions
    autocompleteItems.innerHTML = "";
    suggestions.forEach(function(suggestion) {
        var autocompleteItem = document.createElement("div");
        autocompleteItem.classList.add("autocomplete-item");
        autocompleteItem.textContent = suggestion;
        autocompleteItem.addEventListener("click", function() {
            searchInput.value = suggestion;
            autocompleteItems.innerHTML = "";
            autocompleteItems.style.display = "none";
            searchTable();
        });
        autocompleteItems.appendChild(autocompleteItem);
    });

    autocompleteItems.style.display = "block";
});


function searchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput").value.toLowerCase();
    table = document.getElementById("customerTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        var matchFound = false;
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(input) > -1) {
                    matchFound = true;
                    break; // Break loop if a match is found in any column
                }
            }
        }
        if (matchFound) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none"; // Hide the row if no match found
        }
    }
}

var userInfos = JSON.parse(localStorage.getItem("Customers")) || [];
        var editIndex = -1;  // To keep track of the row being edited

        // Function to update the table
        function register() {
            var tableBody = document.getElementById("customerTable").getElementsByTagName("tbody")[0];
            tableBody.innerHTML = "";

            userInfos.forEach(function(save, index) {
                var row = tableBody.insertRow();

                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);

                cell1.textContent = save.ID;
                cell2.textContent = save.UserName;
                cell3.textContent = save.NRC;
                cell4.textContent = save.Phone;
                cell5.textContent = save.Fruit;
                cell6.textContent = save.FruitPrice;

                // Add click event listener to the username cell
                cell1.addEventListener("click", function() {
                    editIndex = index;
                    localStorage.setItem("editIndex", editIndex);
                    document.getElementById("editButton").disabled = false;
                });
            });
        }

        function navigateToForm() {
            window.location.href = 'CustomerForm.html';
        }

        // Call register on page load to display any saved customers
        window.onload = register;
var selectedId;

// Function for Search
function searchTable() {
    var input, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput").value.toLowerCase();
    table = document.getElementById("customerTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {  // Start from 1 to skip the header row
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

// Function to show the stored data from the Database on the Table
// Function to fetch customers from the server
function fetchCustomers() {
    $.ajax({
        url: 'table.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            var tableBody = document.getElementById("customerTable").getElementsByTagName("tbody")[0];
            tableBody.innerHTML = "";
            // console.log("Receive", data);
            data.forEach(function(customer) {
                var row = tableBody.insertRow();

                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);

                cell1.textContent = customer.ID;
                cell2.textContent = customer.Name;
                cell3.textContent = customer.NRC;
                cell4.textContent = customer.Phone;
                cell5.textContent = customer.Fruit;
                cell6.textContent = customer.Price;

                // Add click event listener to the id cell
                cell1.addEventListener("click", function() {
                    document.getElementById("editButton").disabled = false;
                    document.getElementById("deleteButton").disabled = false;
                    selectedId = customer.ID;
                });
            });
        },
        error: function(xhr) {
            alert('Error: ' + xhr.responseText);
        }
    });
}

// Function for Delete
function deleteFunction() {
    $.ajax({
        url: 'delete.php',
        type: 'POST',
        data: {selectedId},
        dataType: 'json',
        success: function(response) {
            alert('Data deleted successfully');
        },
        error: function(xhr) {
            alert('Error: ' + xhr.responseText);
        }
    });
}

// Function for Delete All
function deleteAllFunction() {
    $.ajax({
        url: 'deleteall.php',
        type: 'POST',
        data: {},
        dataType: 'json',
        success: function(response) {
            alert('All the data deleted successfully');
        },
        error: function(xhr) {
            alert('Error: ' + xhr.responseText);
        }
    });
}

// Function when Create
function navigateToForm() {
    window.location.href = 'CustomerForm.html';
}

// Function when Edit
function navigateToFormEdit() {
    window.location.href = 'CustomerForm.html?id=' + selectedId;
}

window.onload = function() {
    fetchCustomers(); // Fetch customers from the server on page load
};

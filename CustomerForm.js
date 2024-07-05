$(document).ready(function() { 
    // ensure  HTML document is fully loaded before JS code is executed

    // To get parameter from the URL when Edit
    const para = window.location.search; // query string
    const Para = new URLSearchParams(para); // object -> allows to manipulate the query string
    const idPara = Para.get('id');

    // To check parameter
    if(Para.has('id')){
        console.log("Parameter exists in url...");
    }else
    {
    console.log("No parameter in url...");
    }

    // Calling the function when Edit is clicked and the parameter of ID is forwarded to the url of Form
    fetchCustomerData(idPara);

    // Function when saved
    $('#info').on('submit', function(event) {
        event.preventDefault();

        // Taking input data from the Form when created
        var username = $('#username').val();

        var nrcFormat1 = $('#nrcFormat1').val();
        var nrcFormat2 = $('#nrcFormat2').val();
        var nrcFormat3 = $('#nrcFormat3').val();
        var nrc = $('#nrc').val();

        var phFormat = $('#phFormat').val();
        var phNumber = $('#phNumber').val();

        var fruit = $('#products').val();
        var fruitPrice = $('#pdPrice').val();

        var pattern = /^\d+$/;
        var patternNrc = /^\d{6}$/;
        var patternPh = /^\d{3,9}$/;
        
        // for input validation
        if (!pattern.test(nrc)){
            $('#p1').html("*Enter only number*");
        } else if (!patternNrc.test(nrc)){
            $('#p1').html("*Must have only 6 digits*");
        } else {
            $('#p1').html("");
        };

        if (!pattern.test(phNumber)){  
            $('#p2').html("*Only number is allowed*");
        } else if (!patternPh.test(phNumber)){
            $('#p2').html("*Must have only 3 to 9 digits*");
        } else {
            $('#p2').html("");
        };

        if (!pattern.test(nrc) || !patternNrc.test(nrc) || !pattern.test(phNumber) || !patternPh.test(phNumber)){
            return;
        };

        // combining the formats 
        var nrcAll = nrcFormat1+nrcFormat2+nrcFormat3+nrc;
        var phAll = phFormat+phNumber;

        // Storing the input data into the object 
        var data = {
            UserName : username,
            NRC : nrcAll,
            PhoneFM : phFormat,
            Phone : phAll,
            Fruit : fruit,
            FruitPrice: fruitPrice
        };

        if(Para.has('id')){     // Condition for Edit if parameter exists in the URL
            data.ID = idPara;
            $.ajax({
                url: 'edit.php',
                type: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(response) {
                    alert(response.message);
                    if(response.message == "Data edited successfully"){
                        window.location.href = 'CustomerTable.html';
                    }
                },
                error: function(xhr) {
                    alert('Error: ' + xhr.responseText);
                }
            });
        }else {     // Condition for Create and Duplicate
        $.ajax({
            url: 'form.php',
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(response) {
                alert(response.message);
                if(response.message == "Data saved successfully"){
                    window.location.href = 'CustomerTable.html';
                }
            },
            error: function(xhr) {
                alert('Error: ' + xhr.responseText);
            }
            });
        }  
    });
});

// Function for Edit 
function fetchCustomerData(id) {
    console.log("fetching user data ... ");
    $.ajax({
        url: 'edit.php',
        type: 'GET',
        data: {id},
        dataType: 'json',
        success: function(customer) {
            // console.log(customer);

            //Regex for fetched data
            var nrcCut = customer.NRC;
            var rexNrc = nrcCut.match(/\d+$/);

            var phCut = customer.Phone;
            var rexPh = phCut.replace(/^\d{2}/, '');

            var nrcFormat1Cut = customer.NRC;
            var rexFormat1Nrc = nrcFormat1Cut.match(/^\d+\//);

            var nrcFormat2Cut = customer.NRC;
            var rexFormat2Nrc = nrcFormat2Cut.match(/[a-zA-Z]+/);

            var nrcFormat3Cut = customer.NRC;
            var rexFormat3Nrc = nrcFormat3Cut.match(/\([a-zA-Z]\)/);

            // Populate form fields with fetched data
            $('#username').val(customer.Name);
            $('#nrcFormat1').val(rexFormat1Nrc);
            $('#nrcFormat2').val(rexFormat2Nrc);
            $('#nrcFormat3').val(rexFormat3Nrc);
            $('#nrc').val(rexNrc);
            $('#phNumber').val(rexPh);

            // Select the correct option in the dropdown
            $('#products').val(customer.Fruit);
            $('#pdPrice').val(customer.Price);
        },
        error: function(xhr) {
            alert('Error: ' + xhr.responseText);
        }
    });
}

// Function for the Price of the selected fruits
function showPrice() {
    var fruitName = document.getElementById("products");
    var select = fruitName.options[fruitName.selectedIndex].id;
    var price;

    switch (select) {
        case "f1":
            price = "10$";
            break;
        case "f2":
            price = "20$";
            break;
        case "f3":
            price = "15$";
            break;
        case "f4":
            price = "25$";
            break;
        case "f5":
            price = "30$";
            break;
        default:
            price = "";
            break;
    }
    document.getElementById("pdPrice").value = price;
}

// Function for the Back button
function back() {
    window.location.href = "CustomerTable.html";
}
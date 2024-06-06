var userInfos = JSON.parse(localStorage.getItem("Customers")) || [];
        var id = userInfos.length > 0 ? userInfos[userInfos.length - 1].ID + 1 : 1;
        var editIndex = localStorage.getItem("editIndex") ? parseInt(localStorage.getItem("editIndex")) : -1;

        if (editIndex > -1) {
            var user = userInfos[editIndex];
            document.getElementById("username").value = user.UserName;
            document.getElementById("nrc").value = user.NRC;
            document.getElementById("phNumber").value = user.Phone;
            document.getElementById("products").value = user.Fruit;
            document.getElementById("pdPrice").value = user.FruitPrice;
        }

        document.getElementById("info").addEventListener("submit", function(prevent) {
            prevent.preventDefault();

            var username = document.getElementById("username").value;
            var nrc = document.getElementById("nrc").value;
            var phNumber = document.getElementById("phNumber").value;
            var fruit = document.getElementById("products").value;
            var fruitPrice = document.getElementById("pdPrice").value;

            var infos;
            
            if (editIndex > -1) {
            infos = {
            ID: userInfos[editIndex].ID,  // Preserve the existing ID
            UserName: username,
            NRC: nrc,
            Phone: phNumber,
            Fruit: fruit,
            FruitPrice: fruitPrice};
            } else {
                infos = {
                ID: id,
                UserName: username,
                NRC: nrc,
                Phone: phNumber,
                Fruit: fruit,
                FruitPrice: fruitPrice
                };
            }


            var duplicate = userInfos.some(function(saved, index) {
                if (editIndex > -1 && index === editIndex) {
                    return false;
                }
                return saved.UserName === infos.UserName ||
                    saved.NRC === infos.NRC ||
                    saved.Phone === infos.Phone;
            });

            if (duplicate) {
                alert("This is a duplicate!");
            } else {
                if (editIndex > -1) {
                    userInfos[editIndex] = infos;
                    localStorage.removeItem("editIndex");
                } else {
                    infos.ID = id;
                    id += 1;
                    userInfos.push(infos);
                }

                localStorage.setItem("Customers", JSON.stringify(userInfos));
                window.location.href = 'CustomerTable.html';
            }
        });

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

function back(){
    window.location.href = "CustomerTable.html";
}
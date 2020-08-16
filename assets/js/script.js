// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables
let budgetItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
let lastID = parseInt(localStorage.getItem("lastID")) || 0;

// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID

// normal function
// const updateStroage = function() {
//     localStorage.setItem("budgetItems",JSON.stringify(budgetItems));
//     localStorage.setItem("lastID",lastID);
// }

//arrow function
const updateStroage = () => {
    localStorage.setItem("budgetItems",JSON.stringify(budgetItems));
    localStorage.setItem("lastID",lastID);
}

// 5th: function to render budgetItems on table; each item should be rendered in this format:
// <tr data-id="2"><td>Oct 14, 2019 5:08 PM</td><td>November Rent</td><td>Rent/Mortgage</td><td>1300</td><td>Fill out lease renewal form!</td><td class="delete"><span>x</span></td></tr>
// also, update total amount spent on page (based on selected category):

const renderItems = function(items) {
    // if a different items array is passed in, use that
    // if no items array is passed in, default to the budget items
    if (!items) items = budgetItems;
    const tbody = $("#budgetItems tbody");
    let total = 0;

    tbody.empty();

    for (const {id,date,name,category,amount,notes} of items) {
        // const {id,date,name,category,amount,notes} = item;

        tbody.append(`<tr data-id=${id}><td>${date}</td><td>${name}</td><td>${category}</td><td>$${parseFloat(amount).toFixed(2)}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`);
        total += parseFloat(amount);
    }

    $("#total").text(`$${total.toFixed(2)}`)
}


// ======================
// MAIN PROCESS
// ======================

// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form
$("#toggleFormButton, #hideForm").click(function() {
    $("#addItemForm").toggle("slow", function() {
        $("#toggleFormButton").text($(this).is(":visible")? "Hide Form" : "Add New Budget Item")

        // if($(this).is(":visible")) {
        //     $("#toggleFormButton").text("Hide Form");
        // } else {
        //     $("#toggleFormButton").text("Add New Budget Item");
        // }
    });
})

// 3rd: wire up click event on 'Add Budget Item' button, gather user input and add item to budgetItems array (each item's object should include: id / date / name / category / amount / notes)... then clear the form fields and trigger localStorage update/budgetItems rerender functions, once created
$("#addItem").click(function(e) {
    e.preventDefault();

    const newItem = {
        id : ++lastID,
        date: moment().format("lll"), // "Jul 24, 2020 7:56 PM"
        name: $("#name").val().trim(),
        category: $("#category").val(),
        amount: $("#amount").val().trim(),
        notes: $("#notes").val().trim()
    };


    if (!newItem.name || !newItem.category || !newItem.amount) {
        return alert("Each budget item must have a valid name, category, and amount!");
    }
    
    budgetItems.push(newItem)
    // $("form input, form select").val(""); //clears out form pieces
    $("input, select").val(""); //clears out form pieces
    updateStroage();
    renderItems();

    // $("#addItemForm form")[0].reset(); //clears out form too

    console.log(newItem);
})

// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection
$("#categoryFilter").change(function() {
    const category = $(this).val();
    
    //arrowed array
    if (category) {
        const filteredItems = budgetItems.filter((item) => category === item.category)
        renderItems(filteredItems);
    } else {
        renderItems();
    }

})

// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem

// $(document).on("click", ".delete", function() {
    //target the table instead of the whole document 
$("#budgetItems").on("click", ".delete", function() {
    const id = $(this).parents("tr").data("id"); //returns number
    
    // remove item from the array
    const remainingItems = budgetItems.filter(item => item.id != id); // makes a new array without hurting the original array
    budgetItems = remainingItems;
    updateStroage();
    renderItems();
    $("#categoryFilter").val("");
})
    
    
renderItems();


////////// PLAYING AROUNG ////////////////////////
// let age = 19;
// console.log(age.toString() + " is " + (age >=21? "" : "not ") + "old enough to drink");

// console.log(`${age} is ${age >=21? "" : "not"} old enough to drink!`);


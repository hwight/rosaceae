function validateForm() {
    var checked_label = $('input[type=radio]:checked').closest('label').text();
    document.getElementById('species').value = checked_label;
} 

function validateForm2() {
    var x = document.forms["myForm"]["gene"].value;  
    var min = document.forms["myForm"]["min"].value; 
    var max = document.forms["myForm"]["min"].value; 
    var pass = document.forms["myForm"]["pass"].value; 
    if (x == "" ) {
        alert("Uh-oh, looks like some things are missing on this form.");
        return false;
    }
} 

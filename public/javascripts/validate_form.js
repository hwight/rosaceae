function validateForm() {
    var x = document.forms["myForm"]["gene"].value;
    var pass = document.forms["myForm"]["pass"].value; 
    if(pass != "rubusrules"){
        alert("Incorrect or missing password. Try Again.");
        return false;
    }  
    else if (x == "" || ($('input[type=radio]:checked').size() == 0)) {
        alert("Uh-oh, looks like some things are missing on this form.");
        return false;
    }

    var checked_label = $('input[type=radio]:checked').closest('label').text();
    document.getElementById('species').value = checked_label;
} 

function validateForm2() {
    var x = document.forms["myForm"]["gene"].value;  
    var min = document.forms["myForm"]["min"].value; 
    var max = document.forms["myForm"]["min"].value; 
    var pass = document.forms["myForm"]["pass"].value; 
    if(pass != "rubusrules"){
        alert("Incorrect or missing password. Try Again.");
        return false;
    }
    else if (x == "" ) {
        alert("Uh-oh, looks like some things are missing on this form.");
        return false;
    }
} 

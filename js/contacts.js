var contacts = [];
var page = 0; //Pagination count
var limit = 50; //Records per page

//Opens the add contact page as a popup
function showAddContactPage()
{
    addContactPage = window.open("add_contact.html");
    addContactPage.focus();
}

//Called after the add contact page closes
//Since backend is not persisting the data
//We are utilizing this function to update the element on front-end
function addContact(name, email, notes) {
	  contacts.push([name, email,notes]);
	  showContacts();
}


//Create the header row for the contacts table with 4 columns
function createHeader(table) {
	
	var row = table.insertRow(0);
        
  var nameCell = row.insertCell(0);
  var emailCell = row.insertCell(1);
  var notesCell = row.insertCell(2);
  var actionCell = row.insertCell(3);
  
  nameCell.innerHTML = "Name";
  emailCell.innerHTML = "Email";
  notesCell.innerHTML = "Notes";
  actionCell.innerHTML = "Actions";
}

//Show all contacts in the UI
//If no contacts found, show a message indicating how to add a new one
//For each row, add a delete button so we can delete the contact if desired

function showContacts() {
	
	//First load all contacts from backend
	loadContacts();
	
	var table = document.getElementById("contacts");
	
	//Clean the html table
	table.innerHTML = "";
	
	//Add the headers
	createHeader(table);
	
	//If no contacts show a message
	if(contacts.length == 0) {
		var messages = document.getElementById("messages");
		messages.innerHTML = "You have no contacts yet, click Add Contact to add one.";
	}
	else {
		//Iterate over and show each contact
		for (i = 0; i < contacts.length; i++) {
					len = table.rows.length;
					
			    contact = contacts[i];
			    var row = table.insertRow(len);
	        
	        var nameCell = row.insertCell(0);
	        var emailCell = row.insertCell(1);
	        var notesCell = row.insertCell(2);
	        var actionCell = row.insertCell(3);
	        
	        
	        var name = contact[0];
	        var email = contact[1];
	        var notes = contact[2];
	        
	        nameCell.innerHTML = name;
	        emailCell.innerHTML = email;
	        notesCell.innerHTML = notes;
	        actionCell.innerHTML = "<a href='javascript:deleteContact(" + i + ");'> Delete <a/>";
	        
	   }
	   
	 }
}

//Make a XMLHTTP call to backend python script get_contacts.py
//If the response has success set to True, retrieve the contacts from the json object
//Otherwise show the error message in the errors section in UI
function loadContacts() {			
	var data = new FormData();
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'get_contacts.py', true);
	xhr.onreadystatechange = function() {
		//Call a function when the state changes.
	    if(xhr.readyState == 4 && xhr.status == 200) {
	        var res = xhr.responseText;
	        try { 
		        var json = JSON.parse(xhr.responseText);
		        if(json["success"]) {
		        	contacts = json["contacts"];
		        }
		        else {
		        	message = json["message"];
		        	prompMessage(message);
		        }
		      }
		      catch(e) {
		      	console.log(e);
		      	success = false;
		      }
	    }
	}
	
	//Set pagination parameters before calling backend
	data.append('page', page++);
	data.append('limit', limit);
	
	xhr.send(data);
}

//Make a XMLHTTP call to backend python script delete_contact.py
//If the response has success set to True, remove the record from the UI
//Otherwise show the error message in the errors section in UI
function deleteContact(i) {
		
	var success = true;
				
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'delete_contact.py', true);
	xhr.onreadystatechange = function() {
		//Call a function when the state changes.
	    if(xhr.readyState == 4 && xhr.status == 200) {
	        var res = xhr.responseText;
	        try { 
		        var json = JSON.parse(xhr.responseText);
		        if(json["success"]) {
		        	contacts.splice(i, 1);
		        	showContacts();
		        }
		        else {
		        	message = json["message"];
		        	prompMessage(message);
		        }
		      }
		      catch(e) {
		      	console.log(e);
		      	success = false;
		      }
	    }
	}
	var data = new FormData();
	data.append('id', i);
	xhr.send(data); 		
	
	//This is added as a place holder, since actual call to backend won't complete during testing
  //this step is added to test the delete functionality from UI perspective
	if(success) {
			contacts.splice(i, 1);
			showContacts();
	}
}

function prompMessage(message) {
	document.getElementById("messages").innerHTML = message;
}
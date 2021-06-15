
//Collect user input from the form
//Do a basic validation and POST to server at save_contact.py end-point
//If the response was success, add the record to list of items on front-end
//since we are not actually loading data from backend, it is using window.opener to update the parent page
function saveContact()
{
	  //alert('hi');
	  if(window.opener != null && !window.opener.closed) 
    {
     		var name = document.getElementById("name").value;
     		var email = document.getElementById("email").value;
     		var notes = document.getElementById("notes").value;
     		
     		if(name == null || name == "") {
     			alert("Please enter a name");
     			return;
     		}
     		
     		if(email == null || email == "" || !email.includes("@")) {
     			alert("Please enter a valid email address such as john@me.com");
     			return;
     		}
     		
     		var data = new FormData();
				data.append('name', name);
				data.append('email', email);
				data.append('notes', notes);
				
				var success = true;
				
				var xhr = new XMLHttpRequest();
				xhr.open('POST', 'save_contact.py', true);
				xhr.onreadystatechange = function() {
					//Call a function when the state changes.
				    if(xhr.readyState == 4 && xhr.status == 200) {
				        var res = xhr.responseText;
				        try { 
					        json = JSON.parse(xhr.responseText);
					        if(json["success"]) {
					        		success = true;
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
				xhr.send(data);
     		
    		//This is added as a place holder, since actual call to backend won't complete during testing
  			//this step is added to test the add contact functionality from UI perspective
  			//Since we are on a popup page (add_contact), we need to add the new contact to our repository in the parent page     		
     		if(success) {
     			window.opener.addContact(name, email,notes);
     			window.close();     		
     		}
     		else {
     			window.opener.prompMessage(json["message"]);
     		}
        
    }
}
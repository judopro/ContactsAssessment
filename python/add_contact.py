import cgi

# Load the db connection
from db.py import mydb

"""
Check whether an email is valid
- It is not empty
- It contains '@' character
- May add more validation in the future
"""
def isEmailValid(email:str):
	if len(email) == 0:
		return False
	
	if email.find("@") == -1:
		return False
		
	return True
		
		
"""
Adds a contact to the database

Assumptions:
	- Anyone calling this method can add a record
	- Email address need not be unique, therefore no duplicate checks are done
	- Simple validation for email address (length > 0 and includes '@' char), could do more in the future

Return a json in the form of
	success: Boolean to indicate success/false for the operation
	message: Error message if there was any to show in front-end (ONLY if success is FALSE)
"""

def addContact(form):
	ret = dict()
	
	#Read the form values that were sent with the request
	name = form["name"]
	email = form["email"]
	notes = form["notes"]
	
	if len(name) == 0:
		ret["success"] = False
		ret["message"] = "Name can not be empty"
		return ret	
		
	elif not isEmailValid(email):
		ret["success"] = False
		ret["message"] = "Please enter a valid email address"
		return ret	
	
	mycursor = mydb.cursor()
	
	#use a prepared statement to execute the inserts for security purposes to avoid SQL injection attacks etc.
	sql = ('INSERT INTO contacts (name, email, notes) VALUES ''(%s, %s, %s)')
  
  try:
  	mycursor.execute(sql, (name, email, notes))
  	ret["success"] = True
  	
  except MySQLdb.Error, e:
		ret["success"] = False
  	ret["message"] = e.args[0]
	
	return ret

if __name__ == "__main__":

		form = cgi.FieldStorage()
		ret = addContact(form)
					
		print(json.dumps(ret))
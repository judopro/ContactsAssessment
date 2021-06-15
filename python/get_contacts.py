
# Load the db connection
from db.py import mydb

"""
Loads the contacts from the database
i.e. "select * from contacts"

Assumptions:
	- All data is accessible to all users in the system
	- Use pagination parameters (page,limit) to control how much data is returned
	
Return a json in the form of
	success: Boolean to indicate success/false for the operation
	contacts: an array of contacts loaded from database (ONLY if success if TRUE)
	message: error message if any occured (ONLY if success is FALSE)
"""

def loadContacts(form) {
	page = form["page"]
	limit = form["limit"]
	
	mycursor = mydb.cursor()
	mycursor.execute("SELECT name,email,notes FROM contacts LIMIT {},{}".format(page, limit))
	ret = dict()
	
	try:
		rows = mycursor.fetchall()		
		ret["success"] = True
		
		contacts = []
		for row in rows:
			record = []
			record["name"] = row[0]
			record["email"] = row[1]
			record["notes"] = row[2]
			
		  contacts.append(record)
		}
	
		ret["contacts"] = contacts
	
	except MySQLdb.Error, e:
		ret["success"] = False
  	ret["message"] = e.args[0]
  	
	return ret

if __name__ == "__main__":
	
	  form = cgi.FieldStorage()
		ret = loadContacts(form);
		print(json.dumps(ret))
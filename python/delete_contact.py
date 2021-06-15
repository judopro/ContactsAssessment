import cgi

# Load the db connection
from db.py import mydb

"""
Removes the contact from the database

Assumptions:
	- All data is accessible to all users in the system, no security check whether someone can delete a record

Return a json in the form of
	success: Boolean to indicate success/false for the operation
	message: Error message if there was any to show in front-end (ONLY if success is FALSE)
"""

def deleteContact(form) {
	ret = dict()
	
	#Read the form values that were sent with the request
	id = form["id"]
		
	mycursor = mydb.cursor()
	
	#use a prepared statement to execute the queries for security purposes to avoid SQL injection attacks etc.
	sql = ('DELETE from contacts where id=%s')
  
  ret = dict()
  try:
  	mycursor.execute(sql, (id))
  	ret["success"] = True
  	
  except MySQLdb.Error, e:
		ret["success"] = False
		ret["message"] = e.args[0]
		
	return ret

if __name__ == "__main__":
	
		form = cgi.FieldStorage()
		ret = deleteContact(form)
					
		print(json.dumps(ret))

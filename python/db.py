import mysql.connector

"""
Common code to share between python files for the database access

Assumptions: It's a MySQL database.
"""

mydb = mysql.connector.connect(
  host="localhost",
  user="username",
  password="password",
  database="mydatabase"
)

import os
from langchain_openai import OpenAI
from langchain.sql_database import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from apikey import apikey

dburi = "sqlite:///testDatabase.db" 
db = SQLDatabase.from_uri(dburi)
llm = OpenAI(temperature=0, api_key=apikey)

db_chain = SQLDatabaseChain(llm=llm, database = db, verbose = True)

db_chain.run("how many rows are in the ClimateData table of this db?")
db_chain.run("describe the ClimateData table?")
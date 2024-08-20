from flask import Flask, request, jsonify
from langchain_openai import OpenAI
from langchain.sql_database import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Initialize the database and LLM
dburi = "sqlite:///testDatabase.db" 
db = SQLDatabase.from_uri(dburi)
llm = OpenAI(temperature=0, api_key=os.getenv('OPENAI_API_KEY'))
db_chain = SQLDatabaseChain(llm=llm, database=db, verbose=True)

@app.route('/query', methods=['POST'])
def query():
    # Get the query from the request
    query = request.json.get('query', '')

    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Run the query
        result = db_chain.run(query)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

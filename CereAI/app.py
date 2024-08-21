from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import OpenAI
from langchain.sql_database import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from dotenv import load_dotenv
import os
import requests

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes by default

# Function to download the SQLite database file
def download_file(url, local_filename):
    with requests.get(url, stream=True) as r:
        r.raise_for_status()  # Check if the request was successful
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

# URL of the SQLite database file
db_url = 'https://cdn.dragon.cere.network/390/fs/testDatabase.db'
# Local file path to save the downloaded database
local_db_path = 'testDatabase.db'

# Download the file
download_file(db_url, local_db_path)
print(f'Database file downloaded and saved as {local_db_path}')

# Initialize the database and LLM
db = SQLDatabase.from_uri(f'sqlite:///{local_db_path}')
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
        print(result)  # For debugging purposes
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

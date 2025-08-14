from flask import Flask, request, jsonify
import google.generativeai as genai
import os
import PyPDF2 as pdf
from dotenv import load_dotenv
import json
from flask_cors import CORS
# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)
# Configure Google AI API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Function to get the response from the generative AI model
def get_gemini_response(input):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input)
    return response.text

# Function to extract text from a PDF file
def input_pdf_text(uploaded_file):
    reader = pdf.PdfReader(uploaded_file)
    text = ""
    for page in range(len(reader.pages)):
        page = reader.pages[page]
        text += str(page.extract_text())
    return text

# Prompt template
input_prompt = """
Hey Act Like a skilled or very experience ATS(Application Tracking System)
with a deep understanding of tech field, software engineering, data science, data analyst,
and big data engineer. Your task is to evaluate the resume based on the given job description.
You must consider the job market is very competitive and you should provide 
best assistance for improving the resumes. Assign the percentage Matching based 
on JD and the missing keywords with high accuracy.
resume:{text}
description:{jd}

I want the response in one single string having the structure
{{"JD Match":"%","MissingKeywords:[]","Profile Summary":""}}
"""

# Define API endpoint for handling file uploads and job description
@app.route('/analyze-resumes', methods=['POST'])
def process_resume():
    # Check if both the job description and file are provided
    if 'jd' not in request.form or 'files' not in request.files:
        return jsonify({"error": "Job description or files not provided"}), 400

    jd = request.form['jd']
    uploaded_files = request.files.getlist('files')

    results = []

    # Iterate over each uploaded file and process it
    for uploaded_file in uploaded_files:
        # Extract text from each PDF
        text = input_pdf_text(uploaded_file)
        
        # Format the input prompt with the extracted text and JD
        formatted_prompt = input_prompt.format(text=text, jd=jd)
        
        # Get response from generative AI model
        response = get_gemini_response(formatted_prompt)
        
        # Parse the response JSON string to extract specific elements
        try:
            response_data = json.loads(response)  # Convert response string to JSON
        except json.JSONDecodeError:
            return jsonify({"error": "Error parsing the AI response"}), 500
        
        # Store each result with the ATS Score for sorting
        ats_score = round(float(response_data["JD Match"].strip("%")))  # Convert percentage to integer for sorting
        results.append({
            "file_name": uploaded_file.filename,
            "ats_score": ats_score,
            "missing_keywords": response_data["MissingKeywords"],
            "profile_summary": response_data["Profile Summary"]
        })
    
    # Sort results by ATS Score in descending order
    sorted_results = sorted(results, key=lambda x: x["ats_score"], reverse=True)

    # Return the results as JSON
    return jsonify(sorted_results)


# Start Flask app
if __name__ == '__main__':
    app.run(debug=True)
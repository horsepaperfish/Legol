from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import tempfile
from urllib.parse import parse_qs
import cgi

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from file_parser import extract_text_from_file

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            # Parse multipart form data
            content_type = self.headers['Content-Type']

            if 'multipart/form-data' not in content_type:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = json.dumps({"error": "Invalid content type"})
                self.wfile.write(response.encode())
                return

            # Use cgi.FieldStorage to parse multipart data
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    'REQUEST_METHOD': 'POST',
                    'CONTENT_TYPE': content_type,
                }
            )

            uploaded_files = []

            # Process files
            if 'files' in form:
                files_field = form['files']

                # Handle both single file and multiple files
                if not isinstance(files_field, list):
                    files_field = [files_field]

                for file_item in files_field:
                    if file_item.filename:
                        # Create a temporary file
                        suffix = os.path.splitext(file_item.filename)[1]
                        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                            temp_file.write(file_item.file.read())
                            temp_path = temp_file.name

                        # Extract text content
                        file_content = extract_text_from_file(temp_path)

                        uploaded_files.append({
                            'filename': file_item.filename,
                            'path': temp_path,
                            'content': file_content.get('text'),
                            'pages': file_content.get('pages', 0),
                            'type': file_content.get('type', 'Unknown'),
                            'error': file_content.get('error')
                        })

                        # Clean up temp file
                        try:
                            os.unlink(temp_path)
                        except:
                            pass

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = json.dumps({
                "message": "Files uploaded successfully",
                "files": uploaded_files
            })
            self.wfile.write(response.encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps({"error": str(e)})
            self.wfile.write(response.encode())

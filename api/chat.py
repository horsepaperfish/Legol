from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from claude_integration import ClaudeIntegration

# Initialize Claude integration (singleton pattern for Vercel)
claude_integration = None

def get_claude_integration():
    global claude_integration
    if claude_integration is None:
        claude_integration = ClaudeIntegration()
    return claude_integration

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            query_text = data.get('query')
            conversation_history = data.get('history', [])
            file_contents = data.get('files', [])

            if not query_text:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = json.dumps({"error": "No query provided"})
                self.wfile.write(response.encode())
                return

            # Call Claude for conversational response with file content
            claude = get_claude_integration()
            answer = claude.chat(query_text, conversation_history, file_contents)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = json.dumps({"answer": answer})
            self.wfile.write(response.encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps({"error": str(e)})
            self.wfile.write(response.encode())

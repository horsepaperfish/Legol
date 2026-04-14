from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from graph_manager import GraphManager
from claude_integration import ClaudeIntegration

# Initialize managers (singleton pattern for Vercel)
graph_manager = None
claude_integration = None

def get_graph_manager():
    global graph_manager
    if graph_manager is None:
        graph_manager = GraphManager()
    return graph_manager

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

            if not query_text:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = json.dumps({"error": "No query provided"})
                self.wfile.write(response.encode())
                return

            # Get current graph context
            graph = get_graph_manager()
            current_data = graph.get_graph_data()

            # Call Claude
            claude = get_claude_integration()
            updates = claude.process_query(query_text, current_data)

            # Update Graph
            label_to_id = {node['data']['label']: node['id'] for node in current_data['nodes']}
            new_nodes_created = []

            for node in updates.get("new_nodes", []):
                if node['label'] in label_to_id:
                    continue

                new_id = graph.add_node(
                    node_type=node.get('type', 'action'),
                    label=node['label'],
                    description=node.get('description', ''),
                    source=node.get('source', 'AI Generated'),
                    status=node.get('status', 'pending'),
                    agency=node.get('agency'),
                    deadline=node.get('deadline'),
                    required_documents=node.get('required_documents', [])
                )
                label_to_id[node['label']] = new_id
                new_nodes_created.append(node)

            for edge in updates.get("new_edges", []):
                source_label = edge.get('source_label')
                target_label = edge.get('target_label')

                if source_label in label_to_id and target_label in label_to_id:
                    graph.add_edge(
                        source_id=label_to_id[source_label],
                        target_id=label_to_id[target_label],
                        edge_type=edge.get('type', 'dependency'),
                        description=edge.get('description', '')
                    )

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = json.dumps({
                "message": "Graph updated",
                "updates": updates,
                "graph": graph.get_graph_data()
            })
            self.wfile.write(response.encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps({"error": str(e)})
            self.wfile.write(response.encode())

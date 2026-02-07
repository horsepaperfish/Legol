from flask import Flask, request, jsonify
from flask_cors import CORS
from graph_manager import GraphManager
from claude_integration import ClaudeIntegration
import os

app = Flask(__name__)
CORS(app)

graph_manager = GraphManager()
claude_integration = ClaudeIntegration()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/graph', methods=['GET'])
def get_graph():
    data = graph_manager.get_graph_data()
    return jsonify(data), 200

@app.route('/query', methods=['POST'])
def query_graph():
    data = request.json
    query_text = data.get('query')
    
    if not query_text:
        return jsonify({"error": "No query provided"}), 400

    # 1. Get current graph context (simplified for prompt)
    current_data = graph_manager.get_graph_data()
    
    # 2. Call Claude
    updates = claude_integration.process_query(query_text, current_data)
    
    # 3. Update Graph
    # We need a mapping from label to ID to create edges, as Claude returns labels
    # Use existing nodes first
    label_to_id = {node['data']['label']: node['id'] for node in current_data['nodes']}
    
    new_nodes_created = []
    
    for node in updates.get("new_nodes", []):
        # Check if node with same label exists to avoid duplicates (basic check)
        if node['label'] in label_to_id:
            continue
            
        new_id = graph_manager.add_node(
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
            graph_manager.add_edge(
                source_id=label_to_id[source_label],
                target_id=label_to_id[target_label],
                edge_type=edge.get('type', 'dependency'),
                description=edge.get('description', '')
            )

    return jsonify({
        "message": "Graph updated", 
        "updates": updates,
        "graph": graph_manager.get_graph_data()
    }), 200

@app.route('/clear', methods=['POST'])
def clear_graph():
    graph_manager.clear_graph()
    return jsonify({"message": "Graph cleared"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)

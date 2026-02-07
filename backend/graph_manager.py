import networkx as nx
import json
import uuid

class GraphManager:
    def __init__(self):
        self.graph = nx.DiGraph()

    def add_node(self, node_type, label, description, source="Unknown", status="pending", 
                 agency=None, deadline=None, required_documents=None):
        """
        Adds a node to the graph.
        """
        node_id = str(uuid.uuid4())
        self.graph.add_node(node_id, 
                            type=node_type, 
                            label=label, 
                            description=description, 
                            source=source, 
                            status=status,
                            agency=agency,
                            deadline=deadline,
                            required_documents=required_documents or [])
        return node_id

    def add_edge(self, source_id, target_id, edge_type="dependency", description=""):
        """
        Adds an edge between two nodes.
        """
        edge_id = str(uuid.uuid4())
        self.graph.add_edge(source_id, target_id, 
                            id=edge_id,
                            type=edge_type,
                            description=description)
        return edge_id

    def get_graph_data(self):
        """
        Returns the graph data in a format suitable for React Flow.
        Allowed types for React Flow nodes: "document", "action", "agency", "event"
        """
        nodes = []
        # Simple layout strategy: 
        # We could use nx.spring_layout or similar if we want backend positioning,
        # but often frontend handles layout better (e.g. Elkjs or Dagre). 
        # For now, we'll just return nodes with a default position and let Frontend handle it or default it.
        
        # Using a simple layout for initial positioning to avoid all nodes stacking on 0,0
        try:
            pos = nx.spring_layout(self.graph, seed=42)
        except:
            pos = {}

        for node_id, data in self.graph.nodes(data=True):
            x, y = pos.get(node_id, (0, 0))
            nodes.append({
                "id": node_id,
                "type": data.get("type", "default").lower(), # Use internal type for React Flow
                "data": {
                    "label": data.get("label", ""),
                    "type": data.get("type", "action"), # Keep internal type in data too
                    "description": data.get("description", ""),
                    "source": data.get("source", ""),
                    "status": data.get("status", ""),
                    "agency": data.get("agency", ""),
                    "deadline": data.get("deadline", ""),
                    "required_documents": data.get("required_documents", [])
                },
                "position": {"x": x * 500, "y": y * 500} # Scale up for visibility
            })

        edges = []
        for u, v, data in self.graph.edges(data=True):
            edges.append({
                "id": data.get("id", f"e{u}-{v}"),
                "source": u,
                "target": v,
                "type": "smoothstep", # React Flow edge type
                "label": data.get("description", ""),
                "animated": True if data.get("type") == "dependency" else False
            })

        return {"nodes": nodes, "edges": edges}

    def clear_graph(self):
        self.graph.clear()

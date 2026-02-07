import unittest
from unittest.mock import MagicMock, patch
import json
from app import app
from graph_manager import GraphManager

class TestMosaicBackend(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        # Reset graph before each test
        self.app.post('/clear')

    def test_health_check(self):
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "healthy"})

    def test_get_graph_empty(self):
        response = self.app.get('/graph')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data['nodes']), 0)
        self.assertEqual(len(data['edges']), 0)

    @patch('claude_integration.ClaudeIntegration.process_query')
    def test_query_endpoint(self, mock_process_query):
        # Mock Claude response
        mock_process_query.return_value = {
            "new_nodes": [
                {
                    "type": "document",
                    "label": "Passport",
                    "description": "Valid passport",
                    "source": "State Dept",
                    "status": "pending"
                },
                {
                    "type": "action",
                    "label": "Apply Online",
                    "description": "Fill form DS-160",
                    "source": "State Dept",
                    "status": "pending"
                }
            ],
            "new_edges": [
                {
                    "source_label": "Passport",
                    "target_label": "Apply Online",
                    "type": "dependency",
                    "description": "Passport needed to apply"
                }
            ]
        }

        # Send query
        payload = {"query": "I need a visa"}
        response = self.app.post('/query', 
                                 data=json.dumps(payload),
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = response.json
        
        # Verify graph updated
        self.assertEqual(len(data['graph']['nodes']), 2)
        self.assertEqual(len(data['graph']['edges']), 1)
        
        # Verify node content
        labels = [node['data']['label'] for node in data['graph']['nodes']]
        self.assertIn("Passport", labels)
        self.assertIn("Apply Online", labels)

    def test_graph_manager(self):
        gm = GraphManager()
        n1 = gm.add_node("document", "Doc A", "desc")
        n2 = gm.add_node("action", "Action B", "desc")
        gm.add_edge(n1, n2, "dependency", "A before B")
        
        data = gm.get_graph_data()
        self.assertEqual(len(data['nodes']), 2)
        self.assertEqual(len(data['edges']), 1)
        self.assertEqual(data['edges'][0]['source'], n1)
        self.assertEqual(data['edges'][0]['target'], n2)

if __name__ == '__main__':
    unittest.main()

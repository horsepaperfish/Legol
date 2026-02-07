import os
import json
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

class ClaudeIntegration:
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            print("WARNING: ANTHROPIC_API_KEY not found in environment variables.")
        self.client = Anthropic(api_key=api_key)

    def process_query(self, query_text, current_graph_context):
        """
        Sends the query and current graph context to Claude to generate graph updates.
        Returns a structured JSON object with new nodes and edges.
        """
        
        system_prompt = """
        You are an expert legal aide and graph database architect for 'Mosaic'. 
        Your goal is to parse user questions about legal/bureaucratic processes (like visas, military service, etc.) 
        into a structured knowledge graph.

        The graph represents steps, documents, agencies, and timelines.
        
        Output JSON ONLY. Format:
        {
            "new_nodes": [
                {
                    "type": "document | action | agency | event",
                    "label": "Short Title",
                    "description": "Detailed explanation",
                    "source": "Official Source Name",
                    "status": "pending | completed | warning",
                    "agency": "Responsible Agency (e.g., USCIS, TECO)",
                    "deadline": "Timeframe or specific deadline (e.g., '30 days before expiry')",
                    "required_documents": ["List of doc names if applicable"]
                }
            ],
            "new_edges": [
                {
                    "source_label": "Label of source node (must exist or be in new_nodes)",
                    "target_label": "Label of target node (must exist or be in new_nodes)",
                    "type": "dependency | conflict | timeline",
                    "description": "Explanation of the relationship"
                }
            ]
        }
        
        CRITICAL RULES:
        1. "dependency": Source must happen BEFORE Target.
        2. "conflict": A rule in Source contradicts or complicates Target (visualize with warning color).
        3. "timeline": Connect chronological steps.
        4. Agency nodes should be the 'hub' for documents they issue.
        5. If the user mentions dual citizenship or multi-country processes, EXPLICITLY check for conflicts (e.g., conscription).
        """

        user_message = f"""
        Current Graph Context (JSON):
        {json.dumps(current_graph_context, indent=2)}

        User Query: "{query_text}"

        Generate the necessary nodes and edges to represent the answer to this query. 
        If the graph is empty, start from scratch to build the full process. 
        If nodes already exist, connect to them. Avoid creating duplicate nodes with slightly different names.
        """

        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=4000,
                temperature=0,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_message}
                ]
            )
            
            content = response.content[0].text
            # Identify JSON block if wrapped in markdown
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            return json.loads(content)

        except Exception as e:
            print(f"Error calling Claude: {e}")
            return {"new_nodes": [], "new_edges": []}

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

    def chat(self, query_text, conversation_history=None, file_contents=None):
        """
        Sends a conversational query to Claude and returns a natural language response.
        For use in the chat interface.
        """
        system_prompt = """
        You are LEGOL, a helpful immigration assistant specializing in U.S. immigration law,
        visa processes, work permits, dual citizenship, document requirements, and related topics.

        IMPORTANT: Pay close attention to the [User Context] provided in messages. This contains information about:
        - The user's country of origin (as an international student)
        - Their current educational institution
        - The specific topic they're interested in (Work Visa, Financial Support, Immigration, etc.)

        Always tailor your responses to their specific situation. For example:
        - If they're from Singapore studying at CMU asking about work visas, focus on F-1 to H-1B transitions relevant to Singapore nationals
        - If they're asking about financial support, reference institution-specific resources when applicable
        - Consider country-specific regulations and bilateral agreements

        Provide clear, accurate, and helpful responses to user questions. Be conversational but professional.
        If you're unsure about specific legal advice, recommend consulting with an immigration attorney.
        Focus on providing general guidance, process explanations, and document requirements.

        When analyzing uploaded documents, identify:
        - What type of document it is (visa application, passport, etc.)
        - What agency issued it
        - Key information and requirements
        - Next steps the user should take
        - Any deadlines or important dates
        - How this document relates to their specific situation (country, institution, topic)
        """

        messages = []

        # Add conversation history if provided
        if conversation_history:
            for msg in conversation_history:
                # Skip the initial assistant greeting if it's in the history
                if msg.get("role") == "assistant" and "LEGOL immigration assistant" in msg.get("text", ""):
                    continue
                messages.append({
                    "role": msg.get("role"),
                    "content": msg.get("text")
                })

        # Build the current message content
        message_content = query_text

        # Add file content if provided
        if file_contents and len(file_contents) > 0:
            message_content += "\n\n--- UPLOADED DOCUMENTS ---\n"
            for file_info in file_contents:
                filename = file_info.get('filename', 'Unknown')
                content = file_info.get('content')
                file_type = file_info.get('type', 'Unknown')
                pages = file_info.get('pages', 0)

                if content:
                    message_content += f"\n\nDocument: {filename} ({file_type}, {pages} pages)\n"
                    message_content += "Content:\n"
                    # Limit content to first 4000 characters to avoid token limits
                    message_content += content[:4000]
                    if len(content) > 4000:
                        message_content += "\n... (content truncated)"
                else:
                    error = file_info.get('error', 'Unknown error')
                    message_content += f"\n\nDocument: {filename} - Could not extract text: {error}\n"

        # Add current query with file content
        messages.append({
            "role": "user",
            "content": message_content
        })

        try:
            print(f"Sending request to Claude with {len(messages)} messages")
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=2048,
                temperature=0.7,
                system=system_prompt,
                messages=messages
            )
            print(f"Received response from Claude")
            return response.content[0].text

        except Exception as e:
            print(f"Error calling Claude for chat: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I'm having trouble processing your request right now. Please try again."

    def extract_timeline_from_conversation(self, conversation_history):
        """
        Analyzes the full chat conversation and returns a list of timeline items
        (action items, forms, documents, steps) that were actually discussed.
        Used to drive the Timeline page from real conversation content.
        """
        if not conversation_history or len(conversation_history) == 0:
            return []

        system_prompt = """You are building a timeline for a user who chatted with an immigration assistant (LEGOL).

From the user's messages, infer: country/citizenship (e.g. Korean, dual US), institution (e.g. CMU), and what they need (financial aid, military, etc.). Then output a COMPLETE timeline. Each of the following must be its OWN separate item in the "items" array—do NOT merge them into 2–3 broad items.

MUST include as SEPARATE items when the user needs financial aid:
1. "FAFSA / Federal Student Aid" – Apply for federal aid (dual citizens may qualify). relatedDocuments: FAFSA, Tax Returns, Income Documentation.
2. "[Institution] Financial Aid Office" – Contact [use school name from chat, e.g. CMU] financial aid office for eligibility, deadlines, required docs. relatedDocuments: Financial Aid Application, Bank Statements, Proof of Enrollment.
3. "[Institution] Scholarships & Aid" – Scholarships, grants, TA/RA positions, on-campus employment. relatedDocuments: Scholarship Applications, CMU Financial Aid Forms, Financial Documentation.

MUST include as SEPARATE items when the user is Korean and mentions military / dual citizenship:
4. "Selective Service Registration" – Register when 18 for federal aid and government job eligibility (U.S. requirement for dual citizens). relatedDocuments: Selective Service Registration.
5. "Korean Military – Medical Exam" – Complete physical/medical examination for military service eligibility. relatedDocuments: Military Medical Exam, Medical Records.
6. "Korean Military – Exemption / Waiver Eligibility" – Determine if you qualify to skip or reduce service (residency, when you got U.S. citizenship, etc.). Consult embassy or military specialist. relatedDocuments: Passport, Citizenship docs, Residency proof.
7. "Korean Military – Deferment" – If in school: request deferment with enrollment proof. relatedDocuments: Military Service Deferment Form, Certificate of Enrollment, Passport, National ID.
8. "Korean Military – Postponement" – If completing studies: apply for postponement. relatedDocuments: Application for Postponement of Military Service, Certificate of Enrollment, Academic transcript, Expected graduation date.
9. "Korean Embassy / Consulate" – Consult for exact requirements, forms, and procedures. relatedDocuments: South Korean Passport, National ID, Required forms.

For each item: title (short), description (one sentence), relatedDocuments (array of form/document names).

Output valid JSON only, no markdown. Format:
{"items": [
  {"title": "...", "description": "...", "relatedDocuments": ["...", "..."]},
  ...
]}

Rules:
- Output at least the 9 items above when the user says they are Korean with dual citizenship and need financial aid and military service. Use the institution name from the chat (e.g. CMU). Do not collapse into 3 items."""

        # Build messages for Claude (same format as chat)
        messages = []
        for msg in conversation_history:
            role = msg.get("role")
            text = msg.get("text", "")
            if not text or (role == "assistant" and "LEGOL immigration assistant" in text and "How can I assist" in text):
                continue
            messages.append({"role": role, "content": text})

        if not messages:
            return []

        user_content = "Conversation:\n\n"
        for msg in messages:
            user_content += f"{msg['role'].upper()}:\n{msg['content']}\n\n"

        user_content += "\nFrom the user's message(s) above, infer their situation (country, citizenship, institution, and what they need—e.g. financial aid, military service). Then output a COMPLETE timeline: all standard steps and documents for (1) government + institution financial aid and (2) U.S. and Korean military obligations, including medical exams, eligibility for exemption/skipping service, deferment, postponement, and all related forms. Use the institution name from the chat. Output JSON only."

        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=2048,
                temperature=0,
                system=system_prompt,
                messages=[{"role": "user", "content": user_content}]
            )
            content = response.content[0].text.strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            data = json.loads(content)
            return data.get("items", [])
        except Exception as e:
            print(f"Error extracting timeline from conversation: {e}")
            return []

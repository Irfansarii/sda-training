from flask import Flask, request, jsonify
import logging
from typing import Dict, Any, List
import json

class AIAgentAPI:
    def __init__(self, openai_api_key: str):
        self.app = Flask(__name__)
        self.logger = logging.getLogger(__name__)
        
        # Initialize agents
        from .langchain_agent import LangChainAgent
        from .conversation_agent import ConversationAgent
        
        self.langchain_agent = LangChainAgent(openai_api_key)
        self.conversation_agent = ConversationAgent(openai_api_key)
        
        self.setup_routes()
    
    def setup_routes(self):
        """Setup API routes"""
        @self.app.route('/chat', methods=['POST'])
        def chat():
            try:
                data = request.get_json()
                message = data.get('message')
                agent_type = data.get('agent_type', 'langchain')
                
                if not message:
                    return jsonify({'error': 'Message is required'}), 400
                
                # Choose agent based on type
                if agent_type == 'langchain':
                    response = self.langchain_agent.chat(message)
                elif agent_type == 'conversation':
                    response = self.conversation_agent.chat(message)
                else:
                    return jsonify({'error': 'Invalid agent type'}), 400
                
                return jsonify({
                    'success': True,
                    'response': response,
                    'agent_type': agent_type
                })
                
            except Exception as e:
                self.logger.error(f"Chat error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/memory', methods=['GET'])
        def get_memory():
            try:
                agent_type = request.args.get('agent_type', 'langchain')
                
                if agent_type == 'langchain':
                    memory = self.langchain_agent.get_memory()
                elif agent_type == 'conversation':
                    memory = self.conversation_agent.get_conversation_history()
                else:
                    return jsonify({'error': 'Invalid agent type'}), 400
                
                return jsonify({
                    'success': True,
                    'memory': memory,
                    'agent_type': agent_type
                })
                
            except Exception as e:
                self.logger.error(f"Memory retrieval error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/memory/clear', methods=['POST'])
        def clear_memory():
            try:
                data = request.get_json()
                agent_type = data.get('agent_type', 'langchain')
                
                if agent_type == 'langchain':
                    self.langchain_agent.clear_memory()
                elif agent_type == 'conversation':
                    self.conversation_agent.clear_memory()
                else:
                    return jsonify({'error': 'Invalid agent type'}), 400
                
                return jsonify({
                    'success': True,
                    'message': 'Memory cleared successfully',
                    'agent_type': agent_type
                })
                
            except Exception as e:
                self.logger.error(f"Memory clear error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/tools', methods=['GET'])
        def list_tools():
            try:
                agent_type = request.args.get('agent_type', 'langchain')
                
                if agent_type == 'langchain':
                    tools = [tool.name for tool in self.langchain_agent.tools]
                elif agent_type == 'conversation':
                    tools = [tool.name for tool in self.conversation_agent.tools]
                else:
                    return jsonify({'error': 'Invalid agent type'}), 400
                
                return jsonify({
                    'success': True,
                    'tools': tools,
                    'agent_type': agent_type
                })
                
            except Exception as e:
                self.logger.error(f"Tools listing error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/tools/add', methods=['POST'])
        def add_tool():
            try:
                data = request.get_json()
                tool_name = data.get('name')
                tool_description = data.get('description')
                tool_function = data.get('function')
                agent_type = data.get('agent_type', 'langchain')
                
                if not all([tool_name, tool_description, tool_function]):
                    return jsonify({'error': 'Tool name, description, and function are required'}), 400
                
                # Create new tool
                from langchain.agents import Tool
                new_tool = Tool(
                    name=tool_name,
                    description=tool_description,
                    func=eval(tool_function)  # In production, use a safer method
                )
                
                if agent_type == 'langchain':
                    self.langchain_agent.add_tool(new_tool)
                elif agent_type == 'conversation':
                    self.conversation_agent.add_tool(new_tool)
                else:
                    return jsonify({'error': 'Invalid agent type'}), 400
                
                return jsonify({
                    'success': True,
                    'message': 'Tool added successfully',
                    'tool_name': tool_name,
                    'agent_type': agent_type
                })
                
            except Exception as e:
                self.logger.error(f"Tool addition error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/health', methods=['GET'])
        def health():
            """Health check endpoint"""
            return jsonify({
                'status': 'healthy',
                'agents': {
                    'langchain': True,
                    'conversation': True
                }
            })
    
    def run(self, host: str = '0.0.0.0', port: int = 5000):
        """Run the API server"""
        self.logger.info(f"Starting AI Agent API on {host}:{port}")
        self.app.run(host=host, port=port, debug=False)

from flask import Flask, request, jsonify
import logging
from typing import Dict, Any, List
import json

class AIContentGenerationAPI:
    def __init__(self, openai_key: str = None, ollama_url: str = None):
        self.app = Flask(__name__)
        self.logger = logging.getLogger(__name__)
        
        # Initialize AI services
        self.openai_service = None
        self.ollama_service = None
        self.huggingface_service = None
        
        if openai_key:
            from .openai_integration import OpenAIIntegration
            self.openai_service = OpenAIIntegration(openai_key)
        
        if ollama_url:
            from .ollama_integration import OllamaIntegration
            self.ollama_service = OllamaIntegration(ollama_url)
        
        from .huggingface_integration import HuggingFaceIntegration
        self.huggingface_service = HuggingFaceIntegration()
        
        self.setup_routes()
    
    def setup_routes(self):
        """Setup API routes"""
        @self.app.route('/generate/text', methods=['POST'])
        def generate_text():
            try:
                data = request.get_json()
                prompt = data.get('prompt')
                model = data.get('model', 'gpt-3.5-turbo')
                max_tokens = data.get('max_tokens', 1000)
                temperature = data.get('temperature', 0.7)
                
                if not prompt:
                    return jsonify({'error': 'Prompt is required'}), 400
                
                # Choose service based on model
                if model.startswith('gpt-'):
                    if not self.openai_service:
                        return jsonify({'error': 'OpenAI service not available'}), 500
                    result = self.openai_service.generate_text(
                        prompt, model, max_tokens, temperature
                    )
                elif model.startswith('llama'):
                    if not self.ollama_service:
                        return jsonify({'error': 'Ollama service not available'}), 500
                    result = self.ollama_service.generate_text(prompt, model)
                else:
                    result = self.huggingface_service.generate_text(prompt)
                
                return jsonify({
                    'success': True,
                    'result': result,
                    'model': model
                })
                
            except Exception as e:
                self.logger.error(f"Text generation error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/generate/summary', methods=['POST'])
        def generate_summary():
            try:
                data = request.get_json()
                text = data.get('text')
                max_length = data.get('max_length', 150)
                
                if not text:
                    return jsonify({'error': 'Text is required'}), 400
                
                # Use Hugging Face for summarization
                result = self.huggingface_service.summarize_text(text, max_length)
                
                return jsonify({
                    'success': True,
                    'summary': result,
                    'original_length': len(text),
                    'summary_length': len(result)
                })
                
            except Exception as e:
                self.logger.error(f"Summarization error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/generate/code', methods=['POST'])
        def generate_code():
            try:
                data = request.get_json()
                description = data.get('description')
                language = data.get('language', 'python')
                
                if not description:
                    return jsonify({'error': 'Description is required'}), 400
                
                if not self.openai_service:
                    return jsonify({'error': 'OpenAI service not available'}), 500
                
                result = self.openai_service.generate_code(description, language)
                
                return jsonify({
                    'success': True,
                    'code': result,
                    'language': language
                })
                
            except Exception as e:
                self.logger.error(f"Code generation error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/chat', methods=['POST'])
        def chat():
            try:
                data = request.get_json()
                messages = data.get('messages', [])
                model = data.get('model', 'gpt-3.5-turbo')
                
                if not messages:
                    return jsonify({'error': 'Messages are required'}), 400
                
                # Choose service based on model
                if model.startswith('gpt-'):
                    if not self.openai_service:
                        return jsonify({'error': 'OpenAI service not available'}), 500
                    result = self.openai_service.chat_completion(messages, model)
                elif model.startswith('llama'):
                    if not self.ollama_service:
                        return jsonify({'error': 'Ollama service not available'}), 500
                    result = self.ollama_service.chat_completion(messages, model)
                else:
                    return jsonify({'error': 'Unsupported model'}), 400
                
                return jsonify({
                    'success': True,
                    'response': result,
                    'model': model
                })
                
            except Exception as e:
                self.logger.error(f"Chat error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/models', methods=['GET'])
        def list_models():
            """List available models"""
            models = {
                'openai': [],
                'ollama': [],
                'huggingface': ['gpt2', 'facebook/bart-large-cnn']
            }
            
            if self.openai_service:
                models['openai'] = list(self.openai_service.models.keys())
            
            if self.ollama_service:
                models['ollama'] = self.ollama_service.list_models()
            
            return jsonify({
                'success': True,
                'models': models
            })
        
        @self.app.route('/health', methods=['GET'])
        def health():
            """Health check endpoint"""
            return jsonify({
                'status': 'healthy',
                'services': {
                    'openai': self.openai_service is not None,
                    'ollama': self.ollama_service is not None,
                    'huggingface': self.huggingface_service is not None
                }
            })
    
    def run(self, host: str = '0.0.0.0', port: int = 5000):
        """Run the API server"""
        self.logger.info(f"Starting AI Content Generation API on {host}:{port}")
        self.app.run(host=host, port=port, debug=False)

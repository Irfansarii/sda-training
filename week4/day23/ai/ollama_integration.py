import requests
import json
import logging
from typing import List, Dict, Any, Optional

class OllamaIntegration:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.logger = logging.getLogger(__name__)
        self.available_models = []
        self.load_available_models()
    
    def load_available_models(self):
        """Load list of available models"""
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            if response.status_code == 200:
                data = response.json()
                self.available_models = [model['name'] for model in data.get('models', [])]
                self.logger.info(f"Loaded {len(self.available_models)} models")
            else:
                self.logger.error(f"Failed to load models: {response.status_code}")
        except Exception as e:
            self.logger.error(f"Error loading models: {e}")
    
    def pull_model(self, model_name: str) -> bool:
        """Pull a model from Ollama registry"""
        try:
            self.logger.info(f"Pulling model: {model_name}")
            response = requests.post(
                f"{self.base_url}/api/pull",
                json={"name": model_name},
                stream=True
            )
            
            if response.status_code == 200:
                self.logger.info(f"Model {model_name} pulled successfully")
                return True
            else:
                self.logger.error(f"Failed to pull model: {response.status_code}")
                return False
        except Exception as e:
            self.logger.error(f"Error pulling model: {e}")
            return False
    
    def generate_text(self, prompt: str, model: str = "llama2", 
                     options: Dict[str, Any] = None) -> str:
        """Generate text using Ollama"""
        if model not in self.available_models:
            self.logger.warning(f"Model {model} not found, attempting to pull...")
            if not self.pull_model(model):
                raise ValueError(f"Model {model} not available")
        
        try:
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": False
            }
            
            if options:
                payload["options"] = options
            
            response = requests.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('response', '')
            else:
                raise Exception(f"API error: {response.status_code}")
                
        except Exception as e:
            self.logger.error(f"Text generation error: {e}")
            raise
    
    def chat_completion(self, messages: List[Dict[str, str]], 
                       model: str = "llama2") -> str:
        """Chat completion with conversation history"""
        try:
            payload = {
                "model": model,
                "messages": messages,
                "stream": False
            }
            
            response = requests.post(
                f"{self.base_url}/api/chat",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('message', {}).get('content', '')
            else:
                raise Exception(f"API error: {response.status_code}")
                
        except Exception as e:
            self.logger.error(f"Chat completion error: {e}")
            raise
    
    def get_model_info(self, model: str) -> Dict[str, Any]:
        """Get information about a specific model"""
        try:
            response = requests.post(
                f"{self.base_url}/api/show",
                json={"name": model}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"API error: {response.status_code}")
                
        except Exception as e:
            self.logger.error(f"Error getting model info: {e}")
            raise
    
    def list_models(self) -> List[str]:
        """List all available models"""
        return self.available_models.copy()
    
    def delete_model(self, model: str) -> bool:
        """Delete a model"""
        try:
            response = requests.delete(
                f"{self.base_url}/api/delete",
                json={"name": model}
            )
            
            if response.status_code == 200:
                self.logger.info(f"Model {model} deleted successfully")
                return True
            else:
                self.logger.error(f"Failed to delete model: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error deleting model: {e}")
            return False

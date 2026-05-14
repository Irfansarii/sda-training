from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import torch
import logging
from typing import List, Dict, Any

class HuggingFaceIntegration:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models = {}
        self.tokenizers = {}
    
    def load_text_generation_model(self, model_name: str = "gpt2"):
        """Load a text generation model"""
        try:
            self.logger.info(f"Loading text generation model: {model_name}")
            self.models['text_generation'] = pipeline(
                "text-generation",
                model=model_name,
                device=0 if torch.cuda.is_available() else -1
            )
            self.logger.info("Text generation model loaded successfully")
        except Exception as e:
            self.logger.error(f"Failed to load text generation model: {e}")
            raise
    
    def load_summarization_model(self, model_name: str = "facebook/bart-large-cnn"):
        """Load a summarization model"""
        try:
            self.logger.info(f"Loading summarization model: {model_name}")
            self.models['summarization'] = pipeline(
                "summarization",
                model=model_name,
                device=0 if torch.cuda.is_available() else -1
            )
            self.logger.info("Summarization model loaded successfully")
        except Exception as e:
            self.logger.error(f"Failed to load summarization model: {e}")
            raise
    
    def load_question_answering_model(self, model_name: str = "distilbert-base-cased-distilled-squad"):
        """Load a question answering model"""
        try:
            self.logger.info(f"Loading QA model: {model_name}")
            self.models['question_answering'] = pipeline(
                "question-answering",
                model=model_name,
                device=0 if torch.cuda.is_available() else -1
            )
            self.logger.info("QA model loaded successfully")
        except Exception as e:
            self.logger.error(f"Failed to load QA model: {e}")
            raise
    
    def generate_text(self, prompt: str, max_length: int = 100, 
                     temperature: float = 0.7) -> str:
        """Generate text using the loaded model"""
        if 'text_generation' not in self.models:
            self.load_text_generation_model()
        
        try:
            result = self.models['text_generation'](
                prompt,
                max_length=max_length,
                temperature=temperature,
                do_sample=True,
                pad_token_id=50256
            )
            return result[0]['generated_text']
        except Exception as e:
            self.logger.error(f"Text generation error: {e}")
            raise
    
    def summarize_text(self, text: str, max_length: int = 150, 
                      min_length: int = 50) -> str:
        """Summarize text using the loaded model"""
        if 'summarization' not in self.models:
            self.load_summarization_model()
        
        try:
            result = self.models['summarization'](
                text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )
            return result[0]['summary_text']
        except Exception as e:
            self.logger.error(f"Summarization error: {e}")
            raise
    
    def answer_question(self, question: str, context: str) -> Dict[str, Any]:
        """Answer a question based on context"""
        if 'question_answering' not in self.models:
            self.load_question_answering_model()
        
        try:
            result = self.models['question_answering'](
                question=question,
                context=context
            )
            return result
        except Exception as e:
            self.logger.error(f"Question answering error: {e}")
            raise
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        info = {
            'device': self.device,
            'loaded_models': list(self.models.keys()),
            'cuda_available': torch.cuda.is_available()
        }
        return info

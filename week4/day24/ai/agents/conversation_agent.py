from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferWindowMemory, ConversationSummaryMemory
from langchain.schema import BaseMessage
from typing import List, Dict, Any, Optional
import logging
import json

class ConversationAgent:
    def __init__(self, openai_api_key: str, max_memory_length: int = 10):
        self.llm = OpenAI(temperature=0.7, openai_api_key=openai_api_key)
        self.max_memory_length = max_memory_length
        self.memory = ConversationBufferWindowMemory(
            k=max_memory_length,
            memory_key="chat_history",
            return_messages=True
        )
        self.summary_memory = ConversationSummaryMemory(
            llm=self.llm,
            memory_key="chat_history"
        )
        self.tools = self._initialize_tools()
        self.agent = self._initialize_agent()
        self.logger = logging.getLogger(__name__)
        self.conversation_context = {}
    
    def _initialize_tools(self) -> List[Tool]:
        """Initialize conversation-specific tools"""
        tools = [
            Tool(
                name="context_manager",
                description="Manage conversation context and memory",
                func=self._context_manager_tool
            ),
            Tool(
                name="emotion_analyzer",
                description="Analyze emotional tone of the conversation",
                func=self._emotion_analyzer_tool
            ),
            Tool(
                name="topic_tracker",
                description="Track and manage conversation topics",
                func=self._topic_tracker_tool
            ),
            Tool(
                name="reminder_setter",
                description="Set reminders and follow-up tasks",
                func=self._reminder_setter_tool
            )
        ]
        return tools
    
    def _initialize_agent(self):
        """Initialize the conversation agent"""
        return initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=True,
            handle_parsing_errors=True
        )
    
    def _context_manager_tool(self, query: str) -> str:
        """Manage conversation context"""
        try:
            # Parse context management commands
            if "clear" in query.lower():
                self.clear_memory()
                return "Conversation context cleared"
            elif "summary" in query.lower():
                return self.get_conversation_summary()
            elif "context" in query.lower():
                return json.dumps(self.conversation_context, indent=2)
            else:
                return "Context management command processed"
        except Exception as e:
            return f"Context management error: {str(e)}"
    
    def _emotion_analyzer_tool(self, query: str) -> str:
        """Analyze emotional tone"""
        try:
            # Simple emotion analysis (in real implementation, use NLP models)
            emotions = ["happy", "sad", "angry", "excited", "worried", "neutral"]
            # This is a placeholder - implement actual emotion analysis
            return f"Emotional analysis: {emotions[0]}"
        except Exception as e:
            return f"Emotion analysis error: {str(e)}"
    
    def _topic_tracker_tool(self, query: str) -> str:
        """Track conversation topics"""
        try:
            # Track topics mentioned in the conversation
            topics = ["work", "personal", "technology", "health", "travel"]
            # This is a placeholder - implement actual topic tracking
            return f"Current topics: {', '.join(topics)}"
        except Exception as e:
            return f"Topic tracking error: {str(e)}"
    
    def _reminder_setter_tool(self, query: str) -> str:
        """Set reminders and follow-up tasks"""
        try:
            # Parse reminder information
            if "remind" in query.lower():
                return "Reminder set successfully"
            elif "follow" in query.lower():
                return "Follow-up task created"
            else:
                return "Reminder/task management completed"
        except Exception as e:
            return f"Reminder setting error: {str(e)}"
    
    def chat(self, message: str) -> str:
        """Chat with the conversation agent"""
        try:
            # Update conversation context
            self._update_context(message)
            
            # Get response from agent
            response = self.agent.run(input=message)
            
            # Update context with response
            self._update_context(response, is_response=True)
            
            return response
        except Exception as e:
            self.logger.error(f"Conversation agent error: {e}")
            return f"Sorry, I encountered an error: {str(e)}"
    
    def _update_context(self, message: str, is_response: bool = False):
        """Update conversation context"""
        if is_response:
            self.conversation_context["last_response"] = message
        else:
            self.conversation_context["last_input"] = message
            self.conversation_context["message_count"] = self.conversation_context.get("message_count", 0) + 1
    
    def get_conversation_summary(self) -> str:
        """Get a summary of the conversation"""
        try:
            # Use summary memory to get conversation summary
            summary = self.summary_memory.load_memory_variables({})
            return summary.get("chat_history", "No conversation history available")
        except Exception as e:
            return f"Error getting conversation summary: {str(e)}"
    
    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """Get full conversation history"""
        try:
            messages = self.memory.chat_memory.messages
            history = []
            for message in messages:
                history.append({
                    "type": message.__class__.__name__,
                    "content": message.content,
                    "timestamp": getattr(message, 'timestamp', None)
                })
            return history
        except Exception as e:
            self.logger.error(f"Error getting conversation history: {e}")
            return []
    
    def clear_memory(self):
        """Clear conversation memory"""
        self.memory.clear()
        self.summary_memory.clear()
        self.conversation_context = {}
    
    def set_context(self, key: str, value: Any):
        """Set a specific context value"""
        self.conversation_context[key] = value
    
    def get_context(self, key: str) -> Any:
        """Get a specific context value"""
        return self.conversation_context.get(key)

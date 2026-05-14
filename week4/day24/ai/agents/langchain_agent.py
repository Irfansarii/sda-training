from langchain.agents import initialize_agent, Tool, AgentType
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory
from langchain.tools import BaseTool
from langchain.schema import AgentAction, AgentFinish
from typing import List, Dict, Any, Optional
import logging
import json

class CustomTool(BaseTool):
    name = "custom_tool"
    description = "A custom tool for specific tasks"
    
    def _run(self, query: str) -> str:
        """Execute the tool"""
        # Implement custom tool logic here
        return f"Custom tool result for: {query}"
    
    async def _arun(self, query: str) -> str:
        """Async version of the tool"""
        return self._run(query)

class LangChainAgent:
    def __init__(self, openai_api_key: str):
        self.llm = OpenAI(temperature=0.7, openai_api_key=openai_api_key)
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.tools = self._initialize_tools()
        self.agent = self._initialize_agent()
        self.logger = logging.getLogger(__name__)
    
    def _initialize_tools(self) -> List[Tool]:
        """Initialize available tools"""
        tools = [
            Tool(
                name="calculator",
                description="Useful for mathematical calculations",
                func=self._calculator_tool
            ),
            Tool(
                name="web_search",
                description="Search the web for current information",
                func=self._web_search_tool
            ),
            Tool(
                name="file_operations",
                description="Read, write, and manage files",
                func=self._file_operations_tool
            ),
            Tool(
                name="database_query",
                description="Query database for information",
                func=self._database_query_tool
            ),
            CustomTool()
        ]
        return tools
    
    def _initialize_agent(self):
        """Initialize the agent with tools and memory"""
        return initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=True,
            handle_parsing_errors=True
        )
    
    def _calculator_tool(self, query: str) -> str:
        """Calculator tool for mathematical operations"""
        try:
            # Simple calculator implementation
            result = eval(query)
            return f"Calculation result: {result}"
        except Exception as e:
            return f"Error in calculation: {str(e)}"
    
    def _web_search_tool(self, query: str) -> str:
        """Web search tool (placeholder implementation)"""
        # In a real implementation, you would integrate with a search API
        return f"Web search results for: {query}"
    
    def _file_operations_tool(self, query: str) -> str:
        """File operations tool"""
        try:
            # Parse the query to determine the operation
            if "read" in query.lower():
                # Implement file reading logic
                return "File read successfully"
            elif "write" in query.lower():
                # Implement file writing logic
                return "File written successfully"
            else:
                return "File operation completed"
        except Exception as e:
            return f"File operation error: {str(e)}"
    
    def _database_query_tool(self, query: str) -> str:
        """Database query tool"""
        try:
            # Implement database query logic
            return f"Database query result for: {query}"
        except Exception as e:
            return f"Database query error: {str(e)}"
    
    def chat(self, message: str) -> str:
        """Chat with the agent"""
        try:
            response = self.agent.run(input=message)
            return response
        except Exception as e:
            self.logger.error(f"Agent chat error: {e}")
            return f"Sorry, I encountered an error: {str(e)}"
    
    def get_memory(self) -> Dict[str, Any]:
        """Get conversation memory"""
        return {
            "chat_history": self.memory.chat_memory.messages,
            "memory_variables": self.memory.memory_variables
        }
    
    def clear_memory(self):
        """Clear conversation memory"""
        self.memory.clear()
    
    def add_tool(self, tool: Tool):
        """Add a new tool to the agent"""
        self.tools.append(tool)
        self.agent = self._initialize_agent()
    
    def remove_tool(self, tool_name: str):
        """Remove a tool from the agent"""
        self.tools = [tool for tool in self.tools if tool.name != tool_name]
        self.agent = self._initialize_agent()

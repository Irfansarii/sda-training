

# jsonify

Converts Python dictionary into JSON response.

logging

Used for error logging and debugging.

# from .openai_integration import OpenAIIntegration

Imports OpenAI integration module.

# from .huggingface_integration import HuggingFaceIntegration
Always initializes Hugging Face service.

# OpenAI Models
# if model.startswith('gpt-'):

Examples:

gpt-3.5-turbo
gpt-4

Uses OpenAI service.

A central AI backend server
that connects multiple AI models
and exposes them through REST APIs.

# openai
Official OpenAI Python SDK.

Used to communicate with OpenAI models.

Example:

openai.ChatCompletion.create(...)

# os
Used to read environment variables.

Example:

os.getenv('OPENAI_API_KEY')


# typing
Used for type hints.

Examples:

List
Dict
Optional

These improve code readability and IDE support.
# material.dart
→ Flutter UI components
# shared_preferences
→ Save chat messages locally in phone storage
# convert
→ JSON encoding/decoding
# io
→ HTTP requests using HttpClient

# Constructor

final String apiUrl;
final String theme;
final int maxMessages;

# Variables

Variable - Purpose
apiUrl - Backend API URL
theme -	Theme mode
maxMessages	Maximum stored messages

# state variable
final List<Message> _messages = [];

Stores all chat messages


# final TextEditingController _textController
Controls text input field.

bool _isLoading = false;
bool _isTyping = false;

# Purpose

Variable	Meaning
    |          | 
_isLoading	API request in progress
_isTyping	Show typing indicator

# initState()

@override
void initState() {
  super.initState();
  _loadMessages();
}

Runs automatically when widget starts.

Loads previous chat messages from local storage.

# Load Saved Messages
Future<void> _loadMessages() async

This function:

Reads saved messages from SharedPreferences
Converts JSON into Message objects
Loads them into UI

# SharedPreferences
final prefs = await SharedPreferences.getInstance();

Gets local storage access.

# Reading Messages
final savedMessages = prefs.getString('ai_chatbot_messages');

Reads stored chat history.

# Convert JSON → Objects
messagesJson.map((json) => Message.fromJson(json)).toList()

Converts saved JSON into Message class objects.

# Convert Objects → JSON
_messages.map((msg) => msg.toJson()).toList();

# Add Message
void _addMessage(String text, bool isUser)

Adds message to chat.


import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Clear as ClearIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAI } from '../contexts/AIContext';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens_used?: number;
    response_time?: number;
  };
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { chat, generateContent, summarizeText } = useAI();
  const { user } = useAuth();

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      addMessage('Hello! I\'m your AI assistant. How can I help you today?', false);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, isUser: boolean, metadata?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      metadata,
    };
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, true);

    setIsLoading(true);
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      }));

      const response = await chat(userMessage, conversationHistory);
      addMessage(response.response, false, response.metadata);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    addMessage('Hello! I\'m your AI assistant. How can I help you today?', false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (message: Message) => (
    <ListItem key={message.id} sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start' }}>
        <Avatar sx={{ mr: 2, mt: 1 }}>
          {message.isUser ? <PersonIcon /> : <BotIcon />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {message.isUser ? user?.name || 'You' : 'AI Assistant'}
            </Typography>
            <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
              {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {message.text}
          </Typography>
          {message.metadata && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {message.metadata.model && (
                <Chip label={`Model: ${message.metadata.model}`} size="small" />
              )}
              {message.metadata.tokens_used && (
                <Chip label={`Tokens: ${message.metadata.tokens_used}`} size="small" />
              )}
              {message.metadata.response_time && (
                <Chip label={`${message.metadata.response_time}ms`} size="small" />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </ListItem>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            AI Assistant
          </Typography>
          <IconButton onClick={clearMessages} color="error">
            <ClearIcon />
          </IconButton>
        </Box>
      </Paper>

      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.map(renderMessage)}
          {isTyping && (
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2 }}>
                  <BotIcon />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    AI is typing...
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>

        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AIAssistant;

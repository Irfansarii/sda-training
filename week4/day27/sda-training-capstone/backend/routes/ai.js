const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const validationMiddleware = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// AI-specific rate limiting
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
  message: 'Too many AI requests, please try again later.'
});

// Chat endpoint
router.post('/chat', aiLimiter, validationMiddleware.validateChat, async (req, res) => {
  try {
    const { message, conversation_history } = req.body;
    const userId = req.user.id;
    
    const response = await aiService.chat(message, conversation_history, userId);
    
    res.json({
      success: true,
      response: response.text,
      conversation_history: response.conversation_history,
      metadata: {
        model: response.model,
        tokens_used: response.tokens_used,
        response_time: response.response_time
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat request',
      error: error.message
    });
  }
});

// Content generation endpoint
router.post('/generate', aiLimiter, validationMiddleware.validateContentGeneration, async (req, res) => {
  try {
    const { content_type, topic, tone, length, keywords } = req.body;
    const userId = req.user.id;
    
    const content = await aiService.generateContent({
      content_type,
      topic,
      tone,
      length,
      keywords,
      user_id: userId
    });
    
    res.json({
      success: true,
      content: content.text,
      metadata: {
        content_type,
        topic,
        tone,
        length,
        keywords,
        word_count: content.word_count,
        generation_time: content.generation_time
      }
    });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate content',
      error: error.message
    });
  }
});

// Summarization endpoint
router.post('/summarize', aiLimiter, validationMiddleware.validateSummarization, async (req, res) => {
  try {
    const { text, max_length } = req.body;
    const userId = req.user.id;
    
    const summary = await aiService.summarizeText(text, max_length, userId);
    
    res.json({
      success: true,
      summary: summary.text,
      metadata: {
        original_length: summary.original_length,
        summary_length: summary.summary_length,
        compression_ratio: summary.compression_ratio,
        generation_time: summary.generation_time
      }
    });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to summarize text',
      error: error.message
    });
  }
});

// Recommendations endpoint
router.post('/recommendations', aiLimiter, async (req, res) => {
  try {
    const { user_profile, max_recommendations } = req.body;
    const userId = req.user.id;
    
    const recommendations = await aiService.getRecommendations(
      user_profile,
      max_recommendations,
      userId
    );
    
    res.json({
      success: true,
      recommendations: recommendations.items,
      metadata: {
        total_recommendations: recommendations.total,
        generation_time: recommendations.generation_time,
        model_used: recommendations.model_used
      }
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user.id;
    const { time_range } = req.query;
    
    const analytics = await aiService.getAnalytics(userId, time_range);
    
    res.json({
      success: true,
      analytics: {
        usage_stats: analytics.usage_stats,
        performance_metrics: analytics.performance_metrics,
        user_insights: analytics.user_insights,
        recommendations: analytics.recommendations
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

module.exports = router;

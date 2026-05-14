class AIRecommendations {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      apiUrl: options.apiUrl || '/api/ai/recommendations',
      maxRecommendations: options.maxRecommendations || 5,
      ...options
    };
    this.userProfile = {};
    this.recommendations = [];
    this.init();
  }

  init() {
    this.createUI();
    this.bindEvents();
    this.loadUserProfile();
  }

  createUI() {
    this.container.innerHTML = `
      <div class="ai-recommendations">
        <div class="recommendations-header">
          <h3>Recommended for You</h3>
          <button id="refresh-recommendations" class="btn btn-outline">Refresh</button>
        </div>
        
        <div class="recommendations-content" id="recommendations-content">
          <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>Loading recommendations...</p>
          </div>
        </div>
        
        <div class="recommendations-feedback" id="recommendations-feedback" style="display: none;">
          <h4>How did we do?</h4>
          <div class="feedback-buttons">
            <button class="feedback-btn" data-rating="1">😞</button>
            <button class="feedback-btn" data-rating="2">😐</button>
            <button class="feedback-btn" data-rating="3">😊</button>
            <button class="feedback-btn" data-rating="4">😍</button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const refreshBtn = document.getElementById('refresh-recommendations');
    refreshBtn.onclick = () => this.loadRecommendations();

    // Bind feedback events
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('feedback-btn')) {
        const rating = parseInt(e.target.dataset.rating);
        this.submitFeedback(rating);
      }
    });
  }

  async loadUserProfile() {
    try {
      const response = await fetch(`${this.options.apiUrl}/profile`);
      if (response.ok) {
        this.userProfile = await response.json();
        this.loadRecommendations();
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  async loadRecommendations() {
    try {
      const response = await fetch(this.options.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_profile: this.userProfile,
          max_recommendations: this.options.maxRecommendations
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.recommendations = result.recommendations;
      this.displayRecommendations();
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      this.showError('Failed to load recommendations. Please try again.');
    }
  }

  displayRecommendations() {
    const content = document.getElementById('recommendations-content');
    
    if (this.recommendations.length === 0) {
      content.innerHTML = '<p>No recommendations available at the moment.</p>';
      return;
    }

    const recommendationsHTML = this.recommendations.map((rec, index) => `
      <div class="recommendation-item" data-index="${index}">
        <div class="recommendation-image">
          <img src="${rec.image || '/images/placeholder.jpg'}" alt="${rec.title}">
        </div>
        <div class="recommendation-content">
          <h4>${rec.title}</h4>
          <p>${rec.description}</p>
          <div class="recommendation-meta">
            <span class="recommendation-score">Score: ${rec.score.toFixed(2)}</span>
            <span class="recommendation-category">${rec.category}</span>
          </div>
          <div class="recommendation-actions">
            <button class="btn btn-primary" onclick="window.open('${rec.url}', '_blank')">View</button>
            <button class="btn btn-outline" onclick="this.toggleBookmark(${index})">Bookmark</button>
          </div>
        </div>
      </div>
    `).join('');

    content.innerHTML = recommendationsHTML;
    document.getElementById('recommendations-feedback').style.display = 'block';
  }

  showError(message) {
    const content = document.getElementById('recommendations-content');
    content.innerHTML = `<div class="error-message">${message}</div>`;
  }

  async submitFeedback(rating) {
    try {
      await fetch(`${this.options.apiUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          recommendations: this.recommendations,
          user_profile: this.userProfile
        }),
      });

      // Show feedback confirmation
      const feedbackDiv = document.getElementById('recommendations-feedback');
      feedbackDiv.innerHTML = '<p>Thank you for your feedback!</p>';
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  }

  toggleBookmark(index) {
    const recommendation = this.recommendations[index];
    // Implement bookmark functionality
    console.log('Bookmark toggled for:', recommendation.title);
  }
}

// Usage example
document.addEventListener('DOMContentLoaded', () => {
  const recommendations = new AIRecommendations('recommendations-container', {
    apiUrl: '/api/ai/recommendations',
    maxRecommendations: 5
  });
});
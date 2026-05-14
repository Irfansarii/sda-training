class AIContentGenerator {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      apiUrl: options.apiUrl || '/api/ai/generate',
      ...options
    };
    this.init();
  }

  init() {
    this.createUI();
    this.bindEvents();
  }

  createUI() {
    this.container.innerHTML = `
      <div class="ai-content-generator">
        <div class="generator-header">
          <h3>AI Content Generator</h3>
          <p>Generate high-quality content using AI</p>
        </div>
        
        <div class="generator-form">
          <div class="form-group">
            <label for="content-type">Content Type</label>
            <select id="content-type" class="form-control">
              <option value="article">Article</option>
              <option value="blog-post">Blog Post</option>
              <option value="social-media">Social Media</option>
              <option value="email">Email</option>
              <option value="product-description">Product Description</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="topic">Topic/Subject</label>
            <input type="text" id="topic" class="form-control" placeholder="Enter your topic...">
          </div>
          
          <div class="form-group">
            <label for="tone">Tone</label>
            <select id="tone" class="form-control">
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="length">Length</label>
            <select id="length" class="form-control">
              <option value="short">Short (100-200 words)</option>
              <option value="medium">Medium (200-500 words)</option>
              <option value="long">Long (500+ words)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="keywords">Keywords (optional)</label>
            <input type="text" id="keywords" class="form-control" placeholder="Enter keywords separated by commas...">
          </div>
          
          <button id="generate-btn" class="btn btn-primary">Generate Content</button>
        </div>
        
        <div class="generator-result" id="generator-result" style="display: none;">
          <div class="result-header">
            <h4>Generated Content</h4>
            <div class="result-actions">
              <button id="copy-btn" class="btn btn-secondary">Copy</button>
              <button id="regenerate-btn" class="btn btn-outline">Regenerate</button>
            </div>
          </div>
          <div class="result-content" id="result-content"></div>
        </div>
        
        <div class="generator-loading" id="generator-loading" style="display: none;">
          <div class="loading-spinner"></div>
          <p>Generating content...</p>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');

    generateBtn.onclick = () => this.generateContent();
    copyBtn.onclick = () => this.copyContent();
    regenerateBtn.onclick = () => this.generateContent();
  }

  async generateContent() {
    const contentType = document.getElementById('content-type').value;
    const topic = document.getElementById('topic').value;
    const tone = document.getElementById('tone').value;
    const length = document.getElementById('length').value;
    const keywords = document.getElementById('keywords').value;

    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    this.showLoading();

    try {
      const response = await fetch(this.options.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: contentType,
          topic: topic,
          tone: tone,
          length: length,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.showResult(result.content);
    } catch (error) {
      this.hideLoading();
      alert('Failed to generate content. Please try again.');
      console.error('Content generation error:', error);
    }
  }

  showLoading() {
    document.getElementById('generator-loading').style.display = 'block';
    document.getElementById('generator-result').style.display = 'none';
  }

  hideLoading() {
    document.getElementById('generator-loading').style.display = 'none';
  }

  showResult(content) {
    this.hideLoading();
    document.getElementById('result-content').textContent = content;
    document.getElementById('generator-result').style.display = 'block';
  }

  copyContent() {
    const content = document.getElementById('result-content').textContent;
    navigator.clipboard.writeText(content).then(() => {
      alert('Content copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy content:', err);
    });
  }
}

// Usage example
document.addEventListener('DOMContentLoaded', () => {
  const contentGenerator = new AIContentGenerator('content-generator-container', {
    apiUrl: '/api/ai/generate'
  });
});
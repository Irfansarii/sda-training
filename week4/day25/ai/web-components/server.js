const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/ai/chat', (req, res) => {
  const { message, conversation_history } = req.body || {};
  const reply = `Echo: ${message || 'hello'}`;
  // Simple simulated delay
  setTimeout(() => {
    res.json({ success: true, response: reply });
  }, 700);
});

app.listen(port, () => {
  console.log(`Demo server running at http://localhost:${port}`);
});

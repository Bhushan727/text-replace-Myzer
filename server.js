const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// MongoDB configuration
const dbUrl = 'mongodb+srv://admin:cg0EnZSdxLRTVuwi@cluster0.jdpytry.mongodb.net/replace_text?retryWrites=true&w=majority';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB database`))
  .catch((err) => console.error(err));

// Define schema for response data
const responseSchema = new mongoose.Schema({
  html: String,
}, { timestamps: true });

// Define model for response data
const Response = mongoose.model('Response', responseSchema);

// Dynamic HTML string
const htmlTemplate = `
  <h1>{{title}}</h1>
  <h2>{{name}}</h2>
  <h3>{{company}}</h3>
  <p>{{body}}</p>
  <p>{{message}}</p>
`;

app.get('/',(req,res)=>{
    res.send(htmlTemplate)
})

// API endpoint to replace dynamic text in HTML
app.post('/replace-text', async (req, res) => {
  const { title,name,company, body,message } = req.body;
  const html = htmlTemplate.replace(/{{title}}/g, title).replace(/{{name}}/g, name).replace(/{{company}}/g, company).replace(/{{body}}/g, body).replace(/{{message}}/g, message);
  try {
    const response = await Response.create({ html });
    console.log(`Inserted response with ID ${response._id}`);
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error storing response in database');
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

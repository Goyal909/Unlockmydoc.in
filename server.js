const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback - serve HTML files directly, otherwise send index.html
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'dist', req.path)

  // If the path points to an actual HTML file, serve it directly
  if (req.path.endsWith('.html')) {
    return res.sendFile(filePath, err => {
      if (err) res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    })
  }

  // Check if path without extension is an HTML file (clean URLs)
  const htmlPath = filePath + '.html'
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath)
  }

  // Default SPA fallback
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`UnlockMyDoc running on port ${PORT}`)
})

require('dotenv').config()
const express = require('express');
const cors = require('cors');

const ToolboxService = require('./services/toolbox');
const { PORT } = require('./utils/constants');

const app = express();
app.use(cors());

app.get('/files/data', async (req, res) => {
  const requestedFileName = req.query.fileName;
  const data = await ToolboxService.getSecretfiles();
  const resp = [];

  const filesToProcess = requestedFileName ? [requestedFileName] : data.files;
  for (let i = 0; i < filesToProcess.length; i++) {
    try {
      const fileName = filesToProcess[i];
      if (!data.files.includes(fileName)) {
        continue;
      }

      const fileData = await ToolboxService.getFile(fileName);
      const lines = fileData.trim().split('\n');
      const validLines = [];

      // Comenzamos desde la segunda línea, ya que la primera es el encabezado
      for (let j = 1; j < lines.length; j++) {
        const line = lines[j].trim().split(',');
        if (line.length === 4 && line[0] === fileName) {
          validLines.push({
            text: line[1],
            number: Number(line[2]),
            hex: line[3]
          });
        }
      }
      if (validLines.length > 0) {
        resp.push({
          file: fileName,
          lines: validLines
        });
      }
    } catch (error) {
      console.error(error.data);
    }
  }
  res.status(200).json(resp);
});


app.listen(PORT, () => {
  console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});

module.exports = app;

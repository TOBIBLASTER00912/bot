const venom = require('venom-bot');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

// Lade die Konfiguration aus der JSON-Datei
const config = require('./config.json');

venom
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage(async (message) => {
    if (message.body === '!vp') {
      const baseUrl = 'https://www.schuetz-schule-rostock.com/app/download/12690719';
      const date = moment().format('D.M.');
      const fileUrl = `${baseUrl}/${date}pdf`;
      const responseFile = await axios({
        method: 'GET',
        url: fileUrl,
        responseType: 'stream',
      });
      const fileName = `${date}pdf`;
      const filePath = `./${fileName}`;
      responseFile.data.pipe(fs.createWriteStream(filePath));
      responseFile.data.on('end', async () => {
        await client.sendFile(
          config.groupId, // Ändere das Empfänger-Feld zur Gruppen-ID als String
          filePath,
          fileName,
          `Datei wurde heruntergeladen von ${fileUrl}`
        );
        fs.unlinkSync(filePath);
      });
    }
  });
}



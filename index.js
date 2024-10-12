const express = require('express');
const admin = require('firebase-admin');

const serviceAccount = require('./notif-6cbd3-firebase-adminsdk-3g22i-7faf6cb417.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

// Definindo o token FCM diretamente no código para teste
const userToken = "dloj_vBbT2a_0OCez7epKe:APA91bE4BhJrKHHvhfFwcZ8hL9VDQRcX6JwQv6vYm50MHqRVuElyuB28C-4yvF4Ee-jyO0FegMUTSz2L17iZEmjVuk0YMQPzZlc6T1dPR2WQpmj9zPTcA9K6dOy1asUKFOW7IRgdMfiR";

// Rota para enviar notificação a um token específico via POST
app.post('/send-notification', async (req, res) => {
  // Capturando os dados enviados no corpo da requisição
  const { title, message } = req.body;

  // Verificando se o título e a mensagem foram passados
  if (!title || !message) {
    return res.status(400).send('Título e mensagem são obrigatórios.');
  }

  const messagePayload = {
    notification: {
      title: title || 'Sem título',
      body: message || 'Sem mensagem',
    },
    token: userToken,  // Usando o token fixo no código para teste
  };

  try {
    // Enviando a notificação via Firebase Admin SDK
    const response = await admin.messaging().send(messagePayload);
    console.log('Notificação enviada com sucesso:', response);
    res.status(200).send('Notificação enviada com sucesso');
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    res.status(500).send('Erro ao enviar notificação');
  }
});

// Inicializando o servidor Node.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

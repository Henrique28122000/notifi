const admin = require('firebase-admin');

const serviceAccount = require('notif-6cbd3-firebase-adminsdk-3g22i-7faf6cb417.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Exportando a função como padrão para ser usada na Vercel
module.exports = async (req, res) => {
  // Middleware para interpretar JSON no corpo da requisição
  if (req.method === 'POST') {
    const { token, title, message } = req.body;

    // Verificando se o token, título e mensagem foram passados
    if (!token || !title || !message) {
      return res.status(400).send('Token, título e mensagem são obrigatórios.');
    }

    const messagePayload = {
      notification: {
        title: title || 'Sem título',
        body: message || 'Sem mensagem',
      },
      token: token,
    };

    try {
      const response = await admin.messaging().send(messagePayload);
      console.log('Notificação enviada com sucesso:', response);
      return res.status(200).send('Notificação enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return res.status(500).send('Erro ao enviar notificação');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
};

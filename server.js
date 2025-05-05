require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// rota finalizar pedido
app.post('/finalizar-pedido', async (req, res) => {
  const { nome, email, endereco, pagamento, carrinho } = req.body;

  let total = 0;
  const htmlCarrinho = carrinho.map(item => {
    total += item.price;
    return `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">R$ ${item.price.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'Novo Pedido - Ctrl+Coffee',
    html: `
      <h2>☕ Novo Pedido - Ctrl+Coffee</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Endereço:</strong> ${endereco}</p>
      <p><strong>Forma de pagamento:</strong> ${pagamento}</p>
      <hr />
      <h3>Itens do Pedido:</h3>
      <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
        <thead>
          <tr style="background-color: #f8f8f8;">
            <th style="text-align: left; padding: 8px 12px;">Produto</th>
            <th style="text-align: left; padding: 8px 12px;">Preço</th>
          </tr>
        </thead>
        <tbody>
          ${htmlCarrinho}
          <tr style="font-weight: bold;">
            <td style="padding: 8px 12px; border-top: 2px solid #ccc;">Total</td>
            <td style="padding: 8px 12px; border-top: 2px solid #ccc;">R$ ${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    `
  };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Pedido enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar pedido:', error);
    res.status(500).json({ message: 'Erro ao enviar o pedido.' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

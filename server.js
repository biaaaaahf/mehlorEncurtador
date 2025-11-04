const express = require("express");
const path = require("path");
const app = express();

app.use(express.json()); // pra entender JSON vindo do fetch
app.use(express.static(path.join(__dirname, "index.html.html"))); // onde fica teu index.html

// rota pra criar encurtador
app.post("/api/create", (req, res) => {
  const { destination, type, waitSeconds } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Link de destino é obrigatório" });
  }

  // gera um id aleatório simples
  const id = Math.random().toString(36).substring(2, 8);

  // cria a URL encurtada (exemplo)
  const shortUrl = `${req.protocol}://${req.get("host")}/r/${id}`;

  // salva o link na memória (só pra teste)
  links[id] = { destination, type, waitSeconds };

  // responde em JSON
  res.json({ id, shortUrl });
});

// simulando banco na memória
const links = {};

// rota pra redirecionar
app.get("/r/:id", (req, res) => {
  const link = links[req.params.id];
  if (!link) return res.status(404).send("<h1>Link não encontrado</h1>");

  // se for tipo "button", mostra a página com espera
  if (link.type === "button") {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>Redirecionando...</title>
      </head>
      <body style="font-family:Arial;text-align:center;margin-top:50px;color:#022">
        <h1>Espere ${link.waitSeconds} segundos...</h1>
        <p>Você será levado para o site em breve.</p>
        <button id="btn" disabled>Aguardando...</button>
        <script>
          let s = ${link.waitSeconds};
          const btn = document.getElementById('btn');
          const timer = setInterval(() => {
            s--;
            btn.textContent = "Aguarde " + s + "s";
            if (s <= 0) {
              clearInterval(timer);
              btn.textContent = "Ir agora!";
              btn.disabled = false;
              btn.onclick = () => location.href = "${link.destination}";
            }
          }, 1000);
        </script>
      </body>
      </html>
    `);
  } else {
    res.redirect(link.destination);
  }
});

// inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 GS Encurtador rodando na porta ${PORT}`));



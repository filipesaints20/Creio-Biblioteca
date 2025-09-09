document.addEventListener("DOMContentLoaded", () => {
  const catalog = document.getElementById("catalog");
  const livroSelect = document.getElementById("livroSelect");
  const form = document.getElementById("borrowForm");
  const msg = document.getElementById("msg");

  // Carregar catálogo de livros do Google Sheets
  async function carregarLivros() {
    try {
      const res = await fetch(GAS_WEBAPP_URL);
      const livros = await res.json();

      catalog.innerHTML = "";
      livroSelect.innerHTML = "";

      livros.forEach(l => {
        // Exibe cada livro no catálogo
        const div = document.createElement("div");
        div.textContent = `${l.id} - ${l.titulo} (${l.autor}) [${(l.disponivel === true || l.disponivel === "TRUE") ? "Disponível" : "Alugado"}]`;
        catalog.appendChild(div);

        // Só adiciona no select se estiver disponível
        if (l.disponivel === true || l.disponivel === "TRUE") {
          const opt = document.createElement("option");
          opt.value = l.id;
          opt.textContent = `${l.id} - ${l.titulo}`;
          livroSelect.appendChild(opt);
        }
      });

      if (!livroSelect.options.length) {
        const opt = document.createElement("option");
        opt.textContent = "Nenhum livro disponível";
        livroSelect.appendChild(opt);
      }
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
      catalog.innerHTML = "<p>Erro ao carregar catálogo. Tente novamente.</p>";
    }
  }

  // Enviar pedido de empréstimo
  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (!livroSelect.value) {
      msg.textContent = "Nenhum livro disponível para empréstimo.";
      return;
    }

    const body = {
      action: "borrow",
      id: livroSelect.value,
      nome: document.getElementById("nome").value,
      dias: parseInt(document.getElementById("dias").value)
    };

    try {
      const res = await fetch(GAS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const json = await res.json();

      if (json.success) {
        msg.style.color = "green";
        msg.textContent = `✅ Livro alugado com sucesso! Devolução até: ${new Date(json.devolucao).toLocaleDateString("pt-BR")}`;
      } else {
        msg.style.color = "red";
        msg.textContent = `❌ Erro: ${json.error}`;
      }

      carregarLivros(); // Atualiza catálogo
    } catch (error) {
      console.error("Erro ao alugar livro:", error);
      msg.style.color = "red";
      msg.textContent = "Erro ao processar o pedido. Tente novamente.";
    }
  });

  // Carregar livros ao iniciar
  carregarLivros();
});

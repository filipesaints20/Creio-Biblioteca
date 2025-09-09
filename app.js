document.addEventListener("DOMContentLoaded", () => {
  const catalog = document.getElementById("catalog");
  const livroSelect = document.getElementById("livroSelect");
  const form = document.getElementById("borrowForm");
  const msg = document.getElementById("msg");

  async function carregarLivros() {
    try {
      const res = await fetch(GAS_WEBAPP_URL);
      const livros = await res.json();

      catalog.innerHTML = "";
      livroSelect.innerHTML = "";

      livros.forEach(l => {
        const estaDisponivel = String(l.disponivel).toLowerCase() === "true";

        const div = document.createElement("div");
        div.className = "book-card";
        div.innerHTML = `
          <h3>${l.titulo}</h3>
          <p><strong>Autor:</strong> ${l.autor}</p>
          ${l.capa ? `<img src="${l.capa}" alt="Capa de ${l.titulo}"/>` : ""}
          <p><strong>Status:</strong> ${estaDisponivel ? "Disponível" : "Alugado"}</p>
        `;
        catalog.appendChild(div);

        if (estaDisponivel) {
          const opt = document.createElement("option");
          opt.value = l.id;
          opt.textContent = `${l.id} - ${l.titulo}`;
          livroSelect.appendChild(opt);
        }
      });

      if (!livroSelect.options.length) {
        const opt = document.createElement("option");
        opt.textContent = "Nenhum livro disponível";
        opt.disabled = true;
        livroSelect.appendChild(opt);
      }
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
      catalog.innerHTML = "<p style='color:red;'>Erro ao carregar catálogo. Tente novamente.</p>";
    }
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

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

  carregarLivros(); // Carrega ao iniciar
});

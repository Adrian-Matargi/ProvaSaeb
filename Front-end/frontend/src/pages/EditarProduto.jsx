import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarProduto.css";

export default function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    quantidade_atual: 0,
    estoque_minimo: 0,
  });

  const [loading, setLoading] = useState(true);

  // -------------------- CARREGAR PRODUTO --------------------
  useEffect(() => {
    async function loadProduto() {
      try {
        const token = localStorage.getItem("access");

        const resp = await fetch(`http://localhost:8000/api/produtos/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) {
          console.error("Erro ao carregar produto");
          return;
        }

        const data = await resp.json();
        setProduto(data);
        setLoading(false);
      } catch (err) {
        console.log("Erro:", err);
      }
    }

    loadProduto();
  }, [id]);


  // -------------------- ATUALIZAR PRODUTO --------------------
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`http://localhost:8000/api/produtos/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(produto),
      });

      if (response.ok) {
        alert("Produto atualizado com sucesso!");
        navigate("/produtos");
      } else {
        alert("Erro ao atualizar o produto.");
      }
    } catch (err) {
      console.log("Erro na atualização:", err);
    }
  }


  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Carregando...</p>;
  }


  return (
    <div className="edit-container">

      <h1>Editar Produto</h1>
      <p className="sub">Modifique as informações desejadas e salve.</p>

      <form className="edit-form" onSubmit={handleSubmit}>
        
        <label>Nome do Produto</label>
        <input
          type="text"
          value={produto.nome}
          onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
          required
        />

        <label>Descrição</label>
        <textarea
          value={produto.descricao}
          onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
          rows="3"
        />

        <label>Categoria</label>
        <input
          type="text"
          value={produto.categoria}
          onChange={(e) => setProduto({ ...produto, categoria: e.target.value })}
          required
        />

        <label>Quantidade Atual</label>
        <input
          type="number"
          value={produto.quantidade_atual}
          onChange={(e) =>
            setProduto({ ...produto, quantidade_atual: Number(e.target.value) })
          }
          required
        />

        <label>Estoque Mínimo</label>
        <input
          type="number"
          value={produto.estoque_minimo}
          onChange={(e) =>
            setProduto({ ...produto, estoque_minimo: Number(e.target.value) })
          }
          required
        />


        {/* BOTÕES */}
        <div className="edit-buttons">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/produtos")}
          >
            Voltar
          </button>

          <button type="submit" className="btn-save">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}

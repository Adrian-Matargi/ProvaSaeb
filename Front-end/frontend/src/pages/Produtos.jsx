import { useEffect, useState } from "react";
import Header from "../components/Header"; // ajuste o caminho conforme sua pasta
import { useNavigate } from "react-router-dom";
import "./Produtos.css";
import {
  PencilSquareIcon,
  EyeIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");
  const [usuario, setUsuario] = useState("Usuário");
  const navigate = useNavigate();

  // ---------------- FUNÇÃO LOGOUT ----------------
  function logout() {
    localStorage.clear();
    navigate("/");
  }

  // ---------------- FUNÇÃO DELETAR ----------------
  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`http://localhost:8000/api/produtos/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setProdutos((prev) => prev.filter((p) => p.id !== id));
        alert("Produto excluído com sucesso!");
      } else {
        const errorData = await response.json();
        console.log("Erro ao excluir produto:", errorData);
        alert("Não foi possível excluir o produto.");
      }
    } catch (error) {
      console.log("Erro ao excluir produto:", error);
      alert("Erro ao excluir o produto.");
    }
  }

  // ---------------- PEGAR NOME DO USUÁRIO ----------------
useEffect(() => {
  const token = localStorage.getItem("access");
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1]; // pega o payload
      const payload = JSON.parse(atob(payloadBase64)); // decodifica base64
      console.log("Payload do token:", payload); // 👉 veja no console qual campo contém o nome

      // A propriedade que contem o username pode variar: username, nome, email...
      setUsuario(payload.username || payload.nome || payload.email || "Usuário");
    } catch (error) {
      console.log("Erro ao decodificar token:", error);
      setUsuario("Usuário");
    }
  } else {
    setUsuario("Usuário");
  }
}, []);


  // ---------------- CARREGAR PRODUTOS ----------------
  useEffect(() => {
    async function loadProdutos() {
      try {
        const token = localStorage.getItem("access");

        const response = await fetch("http://localhost:8000/api/produtos/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (Array.isArray(data)) setProdutos(data);
        else if (Array.isArray(data.results)) setProdutos(data.results);
        else setProdutos([]);
      } catch (error) {
        console.log("Erro ao carregar produtos", error);
      }
    }

    loadProdutos();
  }, []);

  // ---------------- FILTRO DE BUSCA ----------------
  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="prod-container">

      <Header titulo="Sistema de Gerenciamento de Estoque" />

      {/* ------------------- CARDS RESUMO ------------------- */}
      <div className="prod-summary">
        <div className="summary-card">
          <span>Total de Produtos</span>
          <h2>{produtos.length}</h2>
        </div>

        <div className="summary-card">
          <span>Itens em Estoque</span>
          <h2>{produtos.reduce((acc, p) => acc + p.quantidade_atual, 0)}</h2>
        </div>

        <div className="summary-card">
          <span>Estoque Baixo</span>
          <h2 className="danger">
            {produtos.filter((p) => p.quantidade_atual <= p.estoque_minimo).length}
          </h2>
        </div>

        <div className="summary-card">
          <span>Categorias</span>
          <h2>{new Set(produtos.map((p) => p.categoria)).size}</h2>
        </div>
      </div>

      {/* ------------------- BARRA DE BUSCA + BOTÃO ------------------- */}
      <div className="prod-actions">
        <input
          className="barra-pesquisa"
          type="text"
          placeholder="Buscar por nome, categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn-add"
          onClick={() => navigate("/cadastrar-produto")}
        >
          + Adicionar Produto
        </button>
      </div>

      {/* ------------------- TABELA ------------------- */}
      <div className="prod-table-wrapper">
        <table className="prod-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Estoque Min.</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtosFiltrados.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}

            {produtosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <strong>{p.nome}</strong>
                  <p className="sub">{p.descricao}</p>
                </td>
                <td>
                  <span className="tag">{p.categoria}</span>
                </td>
                <td className={p.quantidade_atual <= p.estoque_minimo ? "danger" : ""}>
                  {p.quantidade_atual}
                </td>
                <td>{p.estoque_minimo}</td>
                <td>
                  {p.quantidade_atual <= p.estoque_minimo ? (
                    <span className="danger">Baixo ⚠</span>
                  ) : (
                    <span className="ok">OK</span>
                  )}
                </td>
                <td className="acoes">
                  <button className="btn-icon edit" onClick={() => navigate(`/editar-produto/${p.id}`)}>
                    <PencilSquareIcon className="icon" />
                  </button>
                  <button className="btn-icon view" onClick={() => navigate(`/produto/${p.id}`)}>
                    <EyeIcon className="icon" />
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(p.id)}>
                    <TrashIcon className="icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

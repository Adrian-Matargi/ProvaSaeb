import { useEffect, useState } from "react";
import Header from "../components/Header"; // ajuste o caminho conforme sua pasta
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  EyeIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import "./Produtos.css"; // reaproveitando o CSS de produtos

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
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
    if (!window.confirm("Tem certeza que deseja excluir esta movimentação?")) return;

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`http://localhost:8000/api/movimentacoes/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMovimentacoes((prev) => prev.filter((m) => m.id !== id));
        alert("Movimentação excluída com sucesso!");
      } else {
        const errorData = await response.json();
        console.log("Erro ao excluir movimentação:", errorData);
        alert("Não foi possível excluir a movimentação.");
      }
    } catch (error) {
      console.log("Erro ao excluir movimentação:", error);
      alert("Erro ao excluir a movimentação.");
    }
  }

  // ---------------- PEGAR NOME DO USUÁRIO ----------------
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        setUsuario(payload.username || payload.nome || payload.email || "Usuário");
      } catch (error) {
        console.log("Erro ao decodificar token:", error);
        setUsuario("Usuário");
      }
    } else {
      setUsuario("Usuário");
    }
  }, []);

  // ---------------- CARREGAR MOVIMENTAÇÕES ----------------
  useEffect(() => {
    async function loadMovimentacoes() {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch("http://localhost:8000/api/movimentacoes/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (Array.isArray(data)) setMovimentacoes(data);
        else if (Array.isArray(data.results)) setMovimentacoes(data.results);
        else setMovimentacoes([]);
      } catch (error) {
        console.log("Erro ao carregar movimentações", error);
        setMovimentacoes([]);
      }
    }

    loadMovimentacoes();
  }, []);

  // ---------------- FILTRO DE BUSCA ----------------
  const movimentacoesFiltradas = movimentacoes.filter((m) => {
    // pega nome via objeto aninhado, ou via campo calculado produto_nome, ou vazio
    const nomeProduto = (m.produto && typeof m.produto === "object" ? (m.produto.nome || "") : "") || m.produto_nome || "";
    const tipo = m.tipo || "";
    return (
      nomeProduto.toLowerCase().includes(search.toLowerCase()) ||
      tipo.toLowerCase().includes(search.toLowerCase())
    );
  });

  // ---------------- RESUMO ----------------
  const totalMovimentacoes = movimentacoes.length;
  const entradas = movimentacoes.filter(m => m.tipo === "entrada").length;
  const saidas = movimentacoes.filter(m => m.tipo === "saida").length;

  // helper para obter nome do produto com vários formatos possíveis
  function getProdutoNome(m) {
    if (!m) return "—";
    if (m.produto && typeof m.produto === "object") return m.produto.nome || "—";
    if (m.produto_nome) return m.produto_nome;
    // caso venha apenas ID (nada a fazer aqui sem outra chamada)
    return String(m.produto || "—");
  }

  // helper para descrição (se você retornar no serializer)
  function getProdutoDescricao(m) {
    if (!m) return "";
    if (m.produto && typeof m.produto === "object") return m.produto.descricao || "";
    if (m.produto_descricao) return m.produto_descricao; // caso backend adicione esse campo
    return "";
  }

  return (
    <div className="prod-container">

      <Header titulo="Movimentações de Estoque" usuario={usuario} logout={logout} />

      {/* ------------------- CARDS RESUMO ------------------- */}
      <div className="prod-summary">
        <div className="summary-card">
          <span>Total de Movimentações</span>
          <h2>{totalMovimentacoes}</h2>
        </div>

        <div className="summary-card">
          <span>Entradas</span>
          <h2>{entradas}</h2>
        </div>

        <div className="summary-card">
          <span>Saídas</span>
          <h2>{saidas}</h2>
        </div>

        <div className="summary-card">
          <span>Produtos Movimentados</span>
          <h2>{new Set(movimentacoes.map((m) => getProdutoNome(m))).size}</h2>
        </div>
      </div>

      {/* ------------------- BARRA DE BUSCA + BOTÃO ------------------- */}
      <div className="prod-actions">
        <input
          className="barra-pesquisa"
          type="text"
          placeholder="Buscar por produto ou tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn-add"
          onClick={() => navigate("/cadastrar-movimentacao")}
        >
          + Nova Movimentação
        </button>
      </div>

      {/* ------------------- TABELA ------------------- */}
      <div className="prod-table-wrapper">
        <table className="prod-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Responsável</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {movimentacoesFiltradas.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">
                  Nenhuma movimentação encontrada.
                </td>
              </tr>
            )}

            {movimentacoesFiltradas.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>
                  <strong>{getProdutoNome(m)}</strong>
                  <p className="sub">{getProdutoDescricao(m)}</p>
                </td>
                <td>{m.tipo}</td>
                <td>{m.quantidade}</td>
                <td>{m.responsavel?.username || m.responsavel_username || "—"}</td>
                <td>{m.data_movimentacao ? new Date(m.data_movimentacao).toLocaleString() : "—"}</td>
                <td className="acoes">
                  {/* Coloque ações se quiser (editar/excluir) */}
                  <button className="btn-icon view" onClick={() => navigate(`/movimentacao/${m.id}`)}>
                    <EyeIcon className="icon" />
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(m.id)}>
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

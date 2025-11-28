import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ProdutosDetalhes.css";

export default function ProdutosDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produto, setProduto] = useState(null);

    useEffect(() => {
        async function loadProduto() {
            try {
                const response = await api.get(`produtos/${id}/`);
                setProduto(response.data);
            } catch (error) {
                console.log("Erro ao carregar produto:", error);
            }
        }

        loadProduto();
    }, [id]);

    if (!produto) {
        return (
            <div className="detalhes-container">
                <p className="loading">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="detalhes-container">

            {/* 🔙 Botão Voltar */}
            <button className="btn-voltar" onClick={() => navigate("/produtos")}>
                ⟵ Voltar
            </button>

            <div className="detalhes-card">
                <h1 className="detalhes-titulo">Detalhes do Produto</h1>

                <div className="detalhes-info">
                    <p><strong>ID:</strong> {produto.id}</p>
                    <p><strong>Nome:</strong> {produto.nome}</p>
                    <p><strong>Categoria:</strong> {produto.categoria}</p>
                    <p><strong>Descrição:</strong> {produto.descricao || "—"}</p>

                    <h3>Especificações Técnicas</h3>
                    <p><strong>Tensão:</strong> {produto.tensao || "—"}</p>
                    <p><strong>Dimensões:</strong> {produto.dimensoes || "—"}</p>
                    <p><strong>Resolução da Tela:</strong> {produto.resolucao_tela || "—"}</p>
                    <p><strong>Capacidade de Armazenamento:</strong> {produto.capacidade_armazenamento || "—"}</p>
                    <p><strong>Conectividade:</strong> {produto.conectividade || "—"}</p>

                    <h3>Estoque</h3>
                    <p><strong>Quantidade Atual:</strong> {produto.quantidade_atual}</p>
                    <p><strong>Estoque Mínimo:</strong> {produto.estoque_minimo}</p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {produto.quantidade_atual <= produto.estoque_minimo ? (
                            <span className="status-baixo">Estoque Baixo ⚠</span>
                        ) : (
                            <span className="status-ok">OK</span>
                        )}
                    </p>
                </div>

                {/* Botão Editar */}
                <button
                    className="btn-editar"
                    onClick={() => navigate(`/produtos/editar/${produto.id}`)}
                >
                    Editar Produto
                </button>
            </div>
        </div>
    );
}

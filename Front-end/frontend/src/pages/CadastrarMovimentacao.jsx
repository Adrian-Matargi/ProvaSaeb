import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CadastrarProduto.css"; // usa o mesmo CSS da página modelo

export default function CadastrarMovimentacao() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        produto: "",
        tipo: "entrada",
        quantidade: "",
        observacao: "",
    });

    const [produtos, setProdutos] = useState([]);

    // Carrega produtos
    useEffect(() => {
        async function loadProdutos() {
            try {
                const token = localStorage.getItem("access");

                const response = await api.get("produtos/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = response.data;

                if (Array.isArray(data)) {
                    setProdutos(data);
                } else if (Array.isArray(data.results)) {
                    setProdutos(data.results);
                }
            } catch (err) {
                console.log("Erro ao carregar produtos:", err);
            }
        }

        loadProdutos();
    }, []);

    // Controle dos campos
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // Enviar movimentação
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const token = localStorage.getItem("access");

            await api.post(
                "movimentacoes/",
                {
                    produto: form.produto,
                    tipo: form.tipo,
                    quantidade: Number(form.quantidade),
                    observacao: form.observacao,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            navigate("/movimentacoes");

        } catch (error) {
            console.log("Erro ao cadastrar movimentação:", error);
            alert("Erro ao cadastrar movimentação.");
        }
    }

    return (
        <div className="cadastro-container">

            <div className="cadastro-card">
                <h1 className="cadastro-titulo">Cadastrar Movimentação</h1>

                <form onSubmit={handleSubmit} className="cadastro-form">

                    {/* PRODUTO */}
                    <div className="form-group">
                        <label>Produto</label>
                        <select
                            name="produto"
                            value={form.produto}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione um produto</option>

                            {produtos.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome} (Estoque: {p.quantidade_atual})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* TIPO */}
                    <div className="form-group">
                        <label>Tipo de Movimentação</label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>
                    </div>

                    {/* GRID DE CAMPOS */}
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Quantidade</label>
                            <input
                                type="number"
                                name="quantidade"
                                value={form.quantidade}
                                onChange={handleChange}
                                min={1}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Observação</label>
                            <input
                                type="text"
                                name="observacao"
                                value={form.observacao}
                                onChange={handleChange}
                                placeholder="Opcional"
                            />
                        </div>
                    </div>

                    {/* BOTÕES */}
                    <div className="edit-buttons">

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/movimentacoes")}
                        >
                            Voltar
                        </button>

                        <button className="btn-salvar">
                            Registrar Movimentação
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}

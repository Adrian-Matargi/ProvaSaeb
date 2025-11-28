import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CadastrarProduto.css";

export default function CadastrarProduto() {
    const navigate = useNavigate();

    const [produto, setProduto] = useState({
        nome: "",
        categoria: "smartphone",
        descricao: "",
        tensao: "",
        dimensoes: "",
        resolucao_tela: "",
        capacidade_armazenamento: "",
        conectividade: "",
        quantidade_atual: 0,
        estoque_minimo: 1,
    });

    function handleChange(e) {
        setProduto({ ...produto, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post("produtos/", produto);
            navigate("/produtos");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="cadastro-container">

            <div className="cadastro-card">
                <h1 className="cadastro-titulo">Cadastrar Produto</h1>

                <form onSubmit={handleSubmit} className="cadastro-form">

                    {/* NOME */}
                    <div className="form-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            name="nome"
                            value={produto.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* CATEGORIA */}
                    <div className="form-group">
                        <label>Categoria</label>
                        <select
                            name="categoria"
                            value={produto.categoria}
                            onChange={handleChange}
                        >
                            <option value="smartphone">Smartphone</option>
                            <option value="notebook">Notebook</option>
                            <option value="smart_tv">Smart TV</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>

                    {/* DESCRIÇÃO */}
                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            name="descricao"
                            value={produto.descricao}
                            onChange={handleChange}
                            rows={3}
                        ></textarea>
                    </div>

                    {/* GRID ESPECIFICAÇÕES */}
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Tensão</label>
                            <input
                                type="text"
                                name="tensao"
                                value={produto.tensao}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Dimensões</label>
                            <input
                                type="text"
                                name="dimensoes"
                                value={produto.dimensoes}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Resolução da Tela</label>
                            <input
                                type="text"
                                name="resolucao_tela"
                                value={produto.resolucao_tela}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Capacidade de Armazenamento</label>
                            <input
                                type="text"
                                name="capacidade_armazenamento"
                                value={produto.capacidade_armazenamento}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Conectividade</label>
                            <input
                                type="text"
                                name="conectividade"
                                value={produto.conectividade}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ESTOQUE */}
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Quantidade Atual</label>
                            <input
                                type="number"
                                name="quantidade_atual"
                                value={produto.quantidade_atual}
                                onChange={handleChange}
                                min={0}
                            />
                        </div>

                        <div className="form-group">
                            <label>Estoque Mínimo</label>
                            <input
                                type="number"
                                name="estoque_minimo"
                                value={produto.estoque_minimo}
                                onChange={handleChange}
                                min={1}
                            />
                        </div>
                    </div>

                    <div className="edit-buttons">

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/produtos")}
                        >
                            Voltar
                        </button>

                        <button className="btn-salvar">Cadastrar Produto</button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}

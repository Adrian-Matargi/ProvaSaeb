import { useState } from "react";
import api from "../services/api";

export default function CadastrarProduto() {
    const [form, setForm] = useState({
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
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await api.post("produtos/", form);
            alert("Produto cadastrado com sucesso!");

            setForm({
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
        } catch (error) {
            console.log(error);
            alert("Erro ao cadastrar produto");
        }
    }

    return (
        <div className="flex justify-center py-10">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Cadastrar Produto
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="col-span-2">
                        <label className="block font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Categoria</label>
                        <select
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                        >
                            <option value="smartphone">Smartphone</option>
                            <option value="notebook">Notebook</option>
                            <option value="smart_tv">Smart TV</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Tensão</label>
                        <input
                            type="text"
                            name="tensao"
                            value={form.tensao}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Dimensões</label>
                        <input
                            type="text"
                            name="dimensoes"
                            value={form.dimensoes}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Resolução da Tela</label>
                        <input
                            type="text"
                            name="resolucao_tela"
                            value={form.resolucao_tela}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Capacidade de Armazenamento</label>
                        <input
                            type="text"
                            name="capacidade_armazenamento"
                            value={form.capacidade_armazenamento}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Conectividade</label>
                        <input
                            type="text"
                            name="conectividade"
                            value={form.conectividade}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Quantidade Atual</label>
                        <input
                            type="number"
                            name="quantidade_atual"
                            value={form.quantidade_atual}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Estoque Mínimo</label>
                        <input
                            type="number"
                            name="estoque_minimo"
                            value={form.estoque_minimo}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg"
                            min="1"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block font-medium text-gray-700">Descrição</label>
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            rows="3"
                            className="w-full mt-1 p-2 border rounded-lg"
                        ></textarea>
                    </div>

                    <div className="col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        >
                            Salvar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

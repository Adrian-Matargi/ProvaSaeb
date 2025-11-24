import { useEffect, useState } from "react";
import api from "../services/api";

export default function Produtos() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        async function carregar() {
            try {
                const res = await api.get("produtos/");
                setProdutos(res.data.results || []);
            } catch (error) {
                console.log(error);
            }
        }
        carregar();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Produtos Cadastrados
            </h1>

            {produtos.length === 0 && (
                <p className="text-gray-600">Nenhum produto cadastrado.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtos.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
                    >
                        <h2 className="text-xl font-bold text-gray-800">
                            {p.nome}
                        </h2>

                        <p className="text-sm text-gray-500 mb-3">
                            Categoria: {p.categoria}
                        </p>

                        <p className="text-gray-700 text-sm mb-2">
                            Estoque atual:{" "}
                            <span
                                className={`font-bold ${
                                    p.estoque_baixo ? "text-red-600" : "text-green-600"
                                }`}
                            >
                                {p.quantidade_atual}
                            </span>
                        </p>

                        <p className="text-gray-500 text-sm mb-4">
                            Mínimo: {p.estoque_minimo}
                        </p>

                        {/* BOTÕES */}
                        <div className="flex justify-between mt-4">
                            <a
                                href={`/produto/${p.id}`}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                            >
                                Ver
                            </a>

                            <a
                                href={`/editar/${p.id}`}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                            >
                                Editar
                            </a>

                            <a
                                href={`/movimentar/${p.id}`}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                            >
                                Movimentar
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

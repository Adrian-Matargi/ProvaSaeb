import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Produtos from "./pages/Produtos";
import ProdutosDetalhes from "./pages/ProdutosDetalhes";
import CadastrarProduto from "./pages/CadastrarProduto";
import EditarProduto from "./pages/EditarProduto";

import Movimentacoes from "./pages/Movimentacoes";
import CadastrarMovimentacao from "./pages/CadastrarMovimentacao";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Produtos */}
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produto/:id" element={<ProdutosDetalhes />} />
        <Route path="/cadastrar-produto" element={<CadastrarProduto />} />
        <Route path="/editar-produto/:id" element={<EditarProduto />} />

        {/* Movimentações */}
        <Route path="/movimentacoes" element={<Movimentacoes />} />
        <Route path="/cadastrar-movimentacao" element={<CadastrarMovimentacao />} />
      </Routes>
    </Router>
  );
}

export default App;

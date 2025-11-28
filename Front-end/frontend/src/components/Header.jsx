import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";

export default function Header({ titulo }) {
  const [usuario, setUsuario] = useState("Usuário");
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  useEffect(() => {
    async function fetchUsuario() {
      const token = localStorage.getItem("access");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8000/api/usuarios/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data.username || data.nome || "Usuário");
        }
      } catch (error) {
        console.log("Erro ao buscar usuário logado:", error);
      }
    }

    fetchUsuario();
  }, []);

  return (
    <div className="header-container">
      <div className="header-titulo">
        <h1>{titulo}</h1>
      </div>

      <nav className="header-nav">
        <Link to="/produtos" className="nav-link">Produtos</Link>
        <Link to="/movimentacoes" className="nav-link">Movimentações</Link>
      </nav>

      <div className="header-usuario">
        <span>Olá, <strong>{usuario}</strong>!</span>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

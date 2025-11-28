import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        navigate("/produtos");
      } else {
        setErro("Usuário ou senha incorretos.");
      }
    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Sistema de Estoque</h1>
        <p>Faça login para continuar</p>

        <form onSubmit={handleLogin}>
          <label>Usuário</label>
          <div className="caixa-entrada">
          <input
            type="text"
            placeholder="Digite seu usuário..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          </div>

          <label>Senha</label>
          <div className="caixa-entrada">
          <input
            type="password"
            placeholder="Digite sua senha..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>

          {erro && <p className="login-erro">{erro}</p>}

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

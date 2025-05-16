import { useState, useEffect, useRef } from "react";

function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function removerAcentos(texto) {
  let resultado = '';
  for (let caractere of texto) {
    if (caractere === 'ç' || caractere === 'Ç') {
      resultado += caractere;
    } else {
      const normalizado = caractere.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      resultado += normalizado;
    }
  }
  return resultado;
}


function App() {
  const [showBar, setShowBar] = useState(false);
  const [palavra, setPalavra] = useState();
  const [tentativa, setTentativa] = useState(["", "", "", "", ""]);
  const [erro, setErro] = useState(false);
  const [tentativasAnteriores, setTentativasAnteriores] = useState([]);
  const [tentativasFalta, setTentativasFalta] = useState([0, 1, 2, 3, 4]);
  const [listaPalavras, setListaPalavras] = useState([]);
  const [jogoBloqueado, setJogoBloqueado] = useState(false);
  const [vencedor, setVencedor] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    vitorias: 0,
    fase: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    derrotas: 0,
  });

  const inputRefs = useRef([]);

  function getPalavraDoDia(lista) {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth() + 1;
    const dia = agora.getDate();
    const hora = agora.getHours();
    const diaBase = hora < 12 ? dia : dia + 1;
    const seed = parseInt(
      `${ano}${String(mes).padStart(2, "0")}${String(diaBase).padStart(2, "0")}`
    );
    const index = (seed * dia) % lista.length;
    return lista[index].trim();
  }

  function handleChange(index, value) {
    const nova = [...tentativa];
    nova[index] = value.toLowerCase().slice(0, 1);
    setTentativa(nova);
    if (value.length === 1 && index < tentativa.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (tentativa[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "Enter") {
      palavraExiste(tentativa);
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < tentativa.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }

  useEffect(() => {
    fetch("/arquivo.txt")
      .then((res) => res.text())
      .then((texto) => {
        const nomes = texto
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean);
        const palavraDoDia = getPalavraDoDia(nomes);

        setListaPalavras(nomes);
        setPalavra(palavraDoDia);

        if (localStorage.getItem("estatisticasJogo")) {
          const statistc = localStorage.getItem("estatisticasJogo");
          if (statistc) {
            const { total, vitorias, fase, derrotas } = JSON.parse(statistc);
            setEstatisticas({
              total: total,
              vitorias: vitorias,
              fase: fase,
              derrotas: derrotas,
            });
          }
        }

        const salvo = localStorage.getItem("jogoDoDia");
        if (salvo) {
          const { data, tentativas, bloqueado, venceu } = JSON.parse(salvo);
          const hoje = new Date();
          const dataGet = new Date(data)
          const reset = new Date()
          reset.setHours(12, 0, 0, 0)
          if (hoje.getHours() >= 12) {
            reset.setDate(reset.getDate() + 1)
          } 

          if (dataGet.getHours() >= 12 && dataGet.getTime() < reset.getTime()) {
            setTentativasAnteriores(tentativas || []);
            setJogoBloqueado(bloqueado);
            setVencedor(venceu);

            const tentativasFeitas = tentativas ? tentativas.length : 0;
            const maxTentativas = 5;
            const restantes = maxTentativas - tentativasFeitas;
            setTentativasFalta(
              restantes > 0
                ? Array.from({ length: restantes }, (_, i) => i)
                : []
            );

            if (bloqueado) {
              setTentativa(["", "", "", "", ""]);
            }
          } else {
            setTentativasAnteriores([]);
            setTentativasFalta([0, 1, 2, 3, 4]);
            setJogoBloqueado(false);
            setVencedor(false);
            setTentativa(["", "", "", "", ""]);
          }
        } else {
          setTentativasAnteriores([]);
          setTentativasFalta([0, 1, 2, 3, 4]);
          setJogoBloqueado(false);
          setVencedor(false);
          setTentativa(["", "", "", "", ""]);
        }
      });
  }, []);

  function salvarEstado(tentativas, bloqueado, venceu) {
    localStorage.setItem(
      "jogoDoDia",
      JSON.stringify({
        data: new Date(),
        tentativas,
        bloqueado,
        venceu,
      })
    );
  }

  function palavraExiste(palavraArray) {
    const tentativaNormalized = normalizeString(palavraArray.join(""));
    const dataNormalized = listaPalavras.map((n) => normalizeString(n));
    if (dataNormalized.includes(tentativaNormalized)) {
      setErro(false);
      verificar();
    } else {
      setErro("Palavra não existe");
    }
  }
  function verificar() {
    const pre = removerAcentos(palavra);
    const tent = tentativa;

    const rsp = ["", "", "", "", ""];
    const preArr = pre.split("");
    const tentArr = tent;

    for (let i = 0; i < tentArr.length; i++) {
      if (tentArr[i] === preArr[i]) {
        rsp[i] = "c";
        preArr[i] = "";
      }
    }

    const dic = {};
    for (let letra of preArr) {
      if (letra !== "") {
        dic[letra] = (dic[letra] || 0) + 1;
      }
    }

    for (let i = 0; i < tentArr.length; i++) {
      const letra = tentArr[i];

      if (rsp[i] !== "") continue;

      if (dic[letra] && dic[letra] > 0) {
        rsp[i] = "t";
        dic[letra]--;
        if (dic[letra] === 0) delete dic[letra];
      } else {
        rsp[i] = "e";
      }
    }

    const resultado = rsp;

    const novaTentativasAnteriores = [
      ...tentativasAnteriores,
      { letras: [...tentativa], resultado },
    ];

    const tentativaFinal = tentativa.join("");
    const venceu = tentativaFinal === palavra;

    if (venceu) {
      const novaEstatisticas = {
        total: estatisticas.total + 1,
        vitorias: estatisticas.vitorias + 1,
        fase: {
          ...estatisticas.fase,
          [novaTentativasAnteriores.length]:
            estatisticas.fase[novaTentativasAnteriores.length] + 1,
        },
        derrotas: estatisticas.derrotas,
      };
      setEstatisticas(novaEstatisticas);
      localStorage.setItem(
        "estatisticasJogo",
        JSON.stringify(novaEstatisticas)
      );

      setVencedor(true);
      setJogoBloqueado(true);
      setTentativasFalta([]);
      setTentativasAnteriores(novaTentativasAnteriores);
      salvarEstado(novaTentativasAnteriores, true, true);
      return;
    }

    if (tentativasFalta.length === 1) {
      const novaEstatisticas = {
        total: estatisticas.total + 1,
        vitorias: estatisticas.vitorias,
        fase: estatisticas.fase,
        derrotas: estatisticas.derrotas + 1,
      };
      setEstatisticas(novaEstatisticas);
      localStorage.setItem(
        "estatisticasJogo",
        JSON.stringify(novaEstatisticas)
      );

      setJogoBloqueado(true);
      setTentativasFalta([]);
      setTentativasAnteriores(novaTentativasAnteriores);
      salvarEstado(novaTentativasAnteriores, true, false);
      return;
    }

    const novaTentativasFalta = [...tentativasFalta];
    novaTentativasFalta.pop();

    setTentativasFalta(novaTentativasFalta);
    setTentativasAnteriores(novaTentativasAnteriores);
    setTentativa(["", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    salvarEstado(novaTentativasAnteriores, false, false);
  }

  function renderInput(letras, resultado, keyPrefix = "") {
    return (
      <div key={keyPrefix} className="flex gap-2">
        {letras.map((letra, i) => (
          <input
            key={keyPrefix + i}
            type="text"
            value={letra.toUpperCase()}
            readOnly
            className={
              "w-16 p-2 aspect-square border rounded-xl text-white text-center text-4xl font-bold " +
              (resultado[i] === "c"
                ? "bg-green-500"
                : resultado[i] === "t"
                  ? "bg-yellow-400"
                  : "bg-red-500")
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-700 flex flex-col gap-2 justify-center items-center px-4">
      <div
        onMouseEnter={() => setShowBar(!showBar)}
        onMouseLeave={() => setShowBar(!showBar)}
        className={`max-w-300 text-white flex flex-col items-center pt-5 fixed top-0 bg-black/50 w-full h-10 rounded-b-3xl overflow-hidden transition-all duration-1000 ${showBar ? "h-50" : "h-10"
          }`}
      >
        {showBar && (
          <>
            <p>Partidas Jogadas: {estatisticas.total}</p>
            <div className="flex gap-4 items-center">
              <p>Partidas Vencidas: {estatisticas.vitorias}</p>
              <span className="bg-green-500 w-4 h-4 rounded inline"></span>
              <p>Partidas Perdidas: {estatisticas.derrotas}</p>
              <span className="bg-red-500 w-4 h-4 rounded inline"></span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-row items-center gap-1">
                <div className=" flex gap-0.5">
                  <span className="bg-green-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-green-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-green-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-green-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-green-500 w-4 h-4 rounded inline"></span>
                </div>
                <p className="inline">{estatisticas.fase[1]}</p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <div className=" flex gap-0.5">
                  <span className="bg-[#a4cc4b] w-4 h-4 rounded inline"></span>
                  <span className="bg-[#a4cc4b] w-4 h-4 rounded inline"></span>
                  <span className="bg-[#a4cc4b] w-4 h-4 rounded inline"></span>
                  <span className="bg-[#a4cc4b] w-4 h-4 rounded inline"></span>
                  <span className="bg-[#a4cc4b] w-4 h-4 rounded inline"></span>
                </div>
                <p className="inline">{estatisticas.fase[2]}</p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <div className=" flex gap-0.5">
                  <span className="bg-orange-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-orange-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-orange-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-orange-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-orange-500 w-4 h-4 rounded inline"></span>
                </div>
                <p className="inline">{estatisticas.fase[3]}</p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <div className=" flex gap-0.5">
                  <span className="bg-[#e74c3c] w-4 h-4 rounded inline"></span>
                  <span className="bg-[#e74c3c] w-4 h-4 rounded inline"></span>
                  <span className="bg-[#e74c3c] w-4 h-4 rounded inline"></span>
                  <span className="bg-[#e74c3c] w-4 h-4 rounded inline"></span>
                  <span className="bg-[#e74c3c] w-4 h-4 rounded inline"></span>
                </div>
                <p className="inline">{estatisticas.fase[4]}</p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <div className=" flex gap-0.5">
                  <span className="bg-red-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-red-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-red-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-red-500 w-4 h-4 rounded inline"></span>
                  <span className="bg-red-500 w-4 h-4 rounded inline"></span>
                </div>
                <p className="inline">{estatisticas.fase[5]}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <img src="logo.svg" alt="" className="h-20" />
      {jogoBloqueado && !vencedor && palavra && (
        <p className="text-red-500 font-bold text-center text-lg max-w-md px-2">
          Você perdeu! A palavra do dia era:{" "}
          <span className="underline">{palavra.toUpperCase()}</span>
        </p>
      )}

      {erro && <p className="text-red-400 font-semibold">{erro}</p>}

      <div className="flex flex-col gap-2">
        {tentativasAnteriores.length > 0 &&
          tentativasAnteriores.map((tent, i) =>
            renderInput(tent.letras, tent.resultado, `old-${i}-`)
          )}
      </div>

      {!jogoBloqueado && (
        <div className="flex gap-2">
          {tentativa.map((letra, i) => (
            <input
              key={i}
              type="text"
              value={letra.toUpperCase()}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              className="w-16 p-2 aspect-square border rounded-xl text-white text-center text-4xl font-bold bg-white/10"
              ref={(el) => (inputRefs.current[i] = el)}
            />
          ))}
        </div>
      )}

      {tentativasFalta.length > 0 && (
        <div className="flex flex-col gap-2 w-full items-center">
          {tentativasFalta.slice(jogoBloqueado ? 0 : 1).map((i) => (
            <div key={i} className="flex gap-2 opacity-50 pointer-events-none">
              {[...Array(5)].map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  readOnly
                  className="w-16 p-2 aspect-square border rounded-xl text-white text-center text-4xl font-bold bg-white/10"
                  value=""
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {jogoBloqueado && (
        <p className="text-green-400 font-bold mt-4 text-center max-w-md px-2">
          {vencedor
            ? "Parabéns! Você acertou a palavra do dia! Volte amanhã para uma nova."
            : "Você esgotou as tentativas de hoje. Volte amanhã!"}
        </p>
      )}

      {!jogoBloqueado && (
        <button
          onClick={() => palavraExiste(tentativa)}
          disabled={tentativa.some((l) => l === "")}
          className={`px-6 py-2 rounded-xl font-bold mt-4 w-full max-w-md
          ${tentativa.some((l) => l === "")
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-cyan-400 text-black"
            }
        `}
        >
          Enviar
        </button>
      )}
    </div>
  );
}

export default App;

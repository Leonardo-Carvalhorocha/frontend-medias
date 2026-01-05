import { versoes } from "../versions/versoes";
import Header from "./header";

function VersaoImplementacoes() {
  return (
    <main className="p-6">
      <Header />
      <div className="w-full py-4 border-t text-center text-sm text-gray-600 space-y-2">
        <p>
          Desenvolvido por Leonardo Carvalho juntamente com Alexia Sarah
          Baltazar.
        </p>

        <p className="font-medium">Versão atual: {__APP_VERSION__}</p>

        <details className="max-w-3xl mx-auto">
          <summary className="cursor-pointer text-blue-600 hover:underline">
            Histórico de versões
          </summary>

          <ul className="mt-2 text-left list-disc list-inside space-y-1">
            {versoes.map((v) => (
              <li key={v.numero}>
                <strong>Versão {v.numero}</strong> — {v.descricao}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </main>
  );
}

export default VersaoImplementacoes;

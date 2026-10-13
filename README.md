# Ocutel — Oficina de Cutelaria Lusitana

Site público: [ocutel.pt](https://ocutel.pt/).

## Estrutura

- `index.html`: página principal, em português europeu.
- `assets/site.css`: estilos adaptáveis, com a paleta oficial, fundos claros e tons de brasa na secção «O caminho».
- `assets/site.js`: vistas do estudo da navalha e ampliação acessível.
- `assets/illustrations/`: novo estudo visual da cnvt#0, versões optimizadas e registo do prompt.
- `assets/fonts/`: fontes locais Inter e Ocutel Serif (derivada de Lora), com as respetivas licenças OFL. As versões para web incluem os caracteres latinos usados no site.
- `brand/2026-10-13/`: entrega final da identidade visual; os originais estão preservados sem alterações.
- `axiomatekton/`: página independente do projeto Axioma Tekton Group. Usa `editorial.css`, com tons minerais suaves e onze gravuras editoriais (cinco áreas, quatro passos do método e dois conceitos) em `symbols/`, separadas da identidade oficial.

A identidade visual utiliza a entrega oficial: lettering, galo com rosácea, rosácea e logótipo completo. A navalha cnvt#0 é apresentada numa nova ilustração de conceito, inspirada no desenho anterior e identificada como estudo em desenvolvimento. A prancha pode ser ampliada e descarregada. O histórico Git conserva as imagens anteriores.

As cinco ilustrações ornamentais do processo estão em `assets/illustrations/symbols/`, com o registo dos prompts. São elementos editoriais separados da identidade oficial. Os logótipos e a rosácea usam os originais da agência, sem sobreposições nem alterações de cor ou opacidade.

## Entradas de clientes

- `/axiomatekton/clientes/`: área de clientes dos serviços Axioma Tekton, com indicação explícita de que o registo, inquéritos, pedidos de orçamento e Pocket Cliente estão em preparação.
- `/dossier/`: entrada visual própria para empresas utilizadoras do software Dossier, fora da secção Axioma Tekton e com assets próprios. Registo e autenticação ainda não estão disponíveis.

As páginas atuais são informativas: não recolhem dados nem simulam contas, pedidos, login ou downloads. A separação por caminho não estabelece um domínio SaaS definitivo nem isolamento de autenticação. A ligação aos percursos operacionais será feita quando existirem destinos validados.

## Pré-visualização

Na raiz do repositório:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/`.

## Publicação

O GitHub Pages publica a raiz da branch `main`. O domínio `ocutel.pt` está definido em `CNAME`. As alterações à página principal não requerem build nem dependências de execução.

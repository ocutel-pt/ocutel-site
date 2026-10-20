# Ocutel — Oficina de Cutelaria Lusitana

Site público: [ocutel.pt](https://ocutel.pt/).

## Estrutura

- `index.html`: página principal, em português europeu.
- `assets/site.css`: estilos adaptáveis, com a paleta oficial, fundos claros e tons de brasa na secção «O caminho».
- `assets/site.js`: vistas do estudo da navalha e ampliação acessível.
- `assets/illustrations/`: novo estudo visual da cnvt#0, versões optimizadas e registo do prompt.
- `assets/fonts/`: fontes locais Inter e Ocutel Serif (derivada de Lora), com as respetivas licenças OFL. As versões para web incluem os caracteres latinos usados no site.
- `brand/2026-10-13/`: entrega final da identidade visual; os originais estão preservados sem alterações.

A identidade visual utiliza a entrega oficial: lettering, galo com rosácea, rosácea e logótipo completo. A navalha cnvt#0 é apresentada numa nova ilustração de conceito, inspirada no desenho anterior e identificada como estudo em desenvolvimento. A prancha pode ser ampliada e descarregada. O histórico Git conserva as imagens anteriores.

As cinco ilustrações ornamentais do processo estão em `assets/illustrations/symbols/`, com o registo dos prompts. São elementos editoriais separados da identidade oficial. Os logótipos e a rosácea usam os originais da agência, sem sobreposições nem alterações de cor ou opacidade.

## Projetos empresariais do autor

A ligação no rodapé aponta para o site independente da Axioma Tekton:
[www.axiomatekton.pt](https://www.axiomatekton.pt/). A expressão «Projetos do grupo»
foi substituída por «Projetos empresariais do autor».

Os conteúdos antigos da Axioma Tekton e a apresentação provisória Dossier foram
retirados deste site. As URLs `/axiomatekton/`, `/axiomatekton/clientes/` e `/dossier/`
conservam apenas páginas mínimas de redirecionamento para o site Axioma (e para
`/clientes/` no caso do questionário). Não oferecem login nem recolhem dados.
O histórico Git preserva os ficheiros removidos. O site Axioma tem repositório próprio
em `axioma-tekton/site`; o site Ocutel mantém o seu repositório e publicação.

GitHub Pages serve os redirecionamentos como HTML com meta refresh, canonical e
ligação acessível; não são respostas HTTP 301. Ligações antigas a assets removidos
podem devolver 404. Não foram alterados DNS, email ou o site Axioma.

## Pré-visualização

Na raiz do repositório:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/`.

## Publicação

O GitHub Pages publica a raiz da branch `main`. O domínio `ocutel.pt` está definido em `CNAME`. As alterações à página principal não requerem build nem dependências de execução.

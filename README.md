# Ocutel — Oficina de Cutelaria Lusitana

Site público: [ocutel.pt](https://ocutel.pt/).

## Estrutura

- `index.html`: página principal, em português europeu.
- `assets/site.css`: estilos adaptáveis, com a paleta oficial, fundos claros e tons de brasa na secção «O caminho».
- `assets/site.js`: vistas do estudo da navalha e ampliação acessível.
- `assets/illustrations/`: novo estudo visual da cnvt#0, versões optimizadas e registo do prompt.
- `assets/fonts/`: fontes locais Inter e Ocutel Serif (derivada de Lora), com as respetivas licenças OFL. As versões para web incluem os caracteres latinos usados no site.
- `brand/2026-10-13/`: entrega final da identidade visual; os originais estão preservados sem alterações.
- `axiomatekton/`: página independente do projeto Axioma Tekton Group.

A identidade visual utiliza a entrega oficial: lettering, galo com rosácea, rosácea e logótipo completo. A navalha cnvt#0 é apresentada numa nova ilustração de conceito, inspirada no desenho anterior e identificada como estudo em desenvolvimento. A prancha pode ser ampliada e descarregada. O histórico Git conserva as imagens anteriores.

Os ornamentos geométricos e a chama são elementos editoriais em SVG, distintos dos ficheiros oficiais da marca.

## Pré-visualização

Na raiz do repositório:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/`.

## Publicação

O GitHub Pages publica a raiz da branch `main`. O domínio `ocutel.pt` está definido em `CNAME`. As alterações à página principal não requerem build nem dependências de execução.

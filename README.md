# Ocutel — Oficina de Cutelaria Lusitana

Site público: [ocutel.pt](https://ocutel.pt/).

## Estrutura

- `index.html`: página principal, em português europeu.
- `assets/site.css`: estilos adaptáveis, com a paleta oficial e fundos claros.
- `assets/fonts/`: fontes locais Inter e Ocutel Serif (derivada de Lora), com as respetivas licenças OFL. As versões para web incluem os caracteres latinos usados no site.
- `brand/2026-10-13/`: entrega final da identidade visual; os originais estão preservados sem alterações.
- `axiomatekton/`: página independente do projeto Axioma Tekton Group.

A página principal utiliza exclusivamente imagens da entrega oficial: lettering, galo com rosácea, rosácea e logótipo completo. As imagens provisórias foram retiradas; as versões anteriores continuam disponíveis no histórico Git. A navalha cnvt#0 mantém o estado de estudo, sem imagem de produto aprovada.

## Pré-visualização

Na raiz do repositório:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/`.

## Publicação

O GitHub Pages publica a raiz da branch `main`. O domínio `ocutel.pt` está definido em `CNAME`. As alterações à página principal não requerem build nem dependências de execução.

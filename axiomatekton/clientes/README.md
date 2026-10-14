# Área de cliente Axioma Tekton

## Estado

Questionários e explicação do Pocket em desenvolvimento na frente Site. A configuração de receção está desligada (`endpoint: null`): o visitante pode preparar e guardar um resumo, mas nenhum pedido é enviado, nenhuma conta é criada e nenhuma gravação no Dossier é simulada.

O download da app e o acesso ao Pocket continuam futuros. A página identifica este estado e explica as expectativas por contexto, sempre dependentes de partilha explícita. O Portal Dossier mantém percurso próprio em `/dossier/`.

## Método e protocolo de perguntas

A estrutura adapta os padrões oficiais [GOV.UK Question pages](https://design-system.service.gov.uk/patterns/question-pages/), [Check answers](https://design-system.service.gov.uk/patterns/check-answers/), [Radios](https://design-system.service.gov.uk/components/radios/), [Error summary](https://design-system.service.gov.uk/components/error-summary/) e [W3C WAI Multi-page forms](https://www.w3.org/WAI/tutorials/forms/multi-page/), consultados em 14-10-2026. São referências de desenho e acessibilidade, sem alegação de certificação ou de investigação própria com clientes.

Cinco grupos lógicos, sem seleção automática: área, necessidade, contexto, contacto e revisão. Uma escolha de área determina as possibilidades seguintes; informação ainda desconhecida pode ficar em branco. Navegação de retorno e alteração no resumo preservam as respostas. Mudar de área limpa os campos específicos dessa área, conservando os contactos. A opção de orientação é exclusiva em relação aos serviços selecionados.

| Pergunta | Para que serve | Regra |
| --- | --- | --- |
| Área | Encaminhar o assunto | Obrigatória, catálogo de quatro áreas |
| Possibilidades | Explicitar a necessidade | Uma ou várias; alternativa «preciso de orientação» |
| Tipo de pedido | Distinguir informação, orçamento e conversa | Obrigatório; Real Estate usa informação ou conversa |
| Localidade | Contextualizar geograficamente | Opcional; sem morada completa |
| Tipo de espaço e ponto de partida | Compreender o contexto | Opcionais; alternativa de não saber |
| Data e orçamento | Identificar referências já conhecidas | Opcionais; orçamento apenas Architecture/Build, sem intervalos de preço inventados |
| Descrição | Permitir contexto não coberto pelas escolhas | Opcional, 2000 caracteres, sem anexos |
| Nome e email | Permitir resposta | Obrigatórios antes de rever; sem NIF/documentos de identidade |
| Telefone, organização e qualidade do interlocutor | Complementar contacto | Opcionais; não concedem representação, identidade ou permissões |

As opções derivam das descrições públicas em `/axiomatekton/#visao` e das listas de âmbito em cada detalhe. Não acrescentam especialidades, preços, prazos, cobertura geográfica, mediação imobiliária, arrendamento ou cedência de pessoal. Real Estate refere património próprio da Axioma Tekton. Selecionar uma opção não confirma disponibilidade, âmbito contratual, adjudicação ou elegibilidade.

## Contrato de integração proposto

Este contrato é uma proposta para coordenação com o núcleo Dossier, não uma API operacional. A escrita Dossier pertence à reserva CRM-BASE-1 e não está incluída nesta branch Site. Não ligar `/clientes` interno nem abrir exceções Access por conveniência.

### Pedido

`POST <destino HTTPS público aprovado>`, JSON, `credentials: omit`, redirecionamentos recusados. Cabeçalho `Idempotency-Key: <UUID aleatório>`. O browser conserva a mesma chave e o mesmo corpo numa tentativa de reconciliação. O servidor deve calcular e associar o hash do corpo canónico: mesma chave e mesmo conteúdo devolvem o mesmo recibo; mesma chave e conteúdo diferente são recusados.

```json
{
  "schemaVersion": "axioma-intake.v1",
  "source": "axioma-site",
  "area": "architecture",
  "interests": ["levantamento"],
  "goal": "informacao",
  "context": {
    "locality": "",
    "propertyType": "",
    "stage": "",
    "desiredDate": "",
    "budgetEUR": "",
    "description": ""
  },
  "contact": {
    "role": "",
    "name": "Exemplo de ensaio",
    "email": "ensaio@example.com",
    "phone": "",
    "organization": ""
  }
}
```

Valores autorizados e relações entre área/interesses/fase estão no catálogo de `questionario.js`. O servidor valida a sua própria cópia versionada; valores, origem, organização destinatária ou poderes não são confiados ao browser. `orientacao` não pode coexistir com outros interesses; Real Estate não aceita objetivo `orcamento`; orçamento é uma cadeia decimal em euros, apenas para Architecture/Build. A origem editorial é declarativa, não identidade.

Limites propostos: corpo 12 KiB; nome/localidade 120, email 254, telefone 40, organização 160, descrição 2000 caracteres; listas limitadas ao catálogo; data válida; decimal sem expoente e até duas casas. Todos os limites têm de existir no servidor. O cliente não fornece tenant, projeto, identidade autenticada, estado de triagem ou endereço de notificação.

### Gravação, notificação e recibo

Persistir pedido e notificação pendente de forma atómica. O pedido fica em triagem separada de clientes/utilizadores/projetos. A notificação por email é tratada depois, com deduplicação, tentativas e estado verificável. Falhar email não apaga o pedido nem pede nova submissão ao cliente. O destinatário é definido no servidor.

`200` (repetição reconciliada) ou `201` (novo registo) só confirmam receção quando o pedido estiver persistido. A interface atual espera:

```json
{
  "status": "received",
  "receipt": {
    "id": "referencia_opaca_minimo_12_caracteres",
    "receivedAt": "2026-10-14T12:00:00.000Z"
  },
  "emailStatus": "pending"
}
```

`emailStatus`: `pending`, `sent` ou `failed`; a receção na BD não depende do sucesso do email. Não devolver IDs internos, tenant ou dados de outros pedidos. A referência não concede consulta ou acesso. O frontend só mostra sucesso após validar este recibo. Falha, timeout, corpo inesperado ou resultado incerto conservam a preparação e a mesma chave para reconciliação, sem permitir editar o conteúdo ainda por confirmar.

Antes de ativação, fechar respostas tipadas de validação (`422`, campos permitidos), chave divergente (`409`), limite/abuso (`429`, retry), erros definitivos e consulta/reconciliação. A interface candidata trata qualquer resposta não confirmada conservadoramente como «por confirmar»; não ativar enquanto os estados finais não estiverem contratados e testados.

### Segurança, serviço e dados ainda por fechar

- Endpoint público separado da API interna protegida por Access; CORS/origin allowlist não equivalem a autenticação.
- Destinatário organizacional fixado no servidor; permissões da triagem internas e explícitas; dados excluídos de logs/URLs/analítica.
- Limites de tamanho/taxa, proteção contra abuso e decisão antispam verificável no servidor; não expor credenciais no repositório/site.
- Política de retenção, identificação do responsável, aviso de privacidade, tratamento de duplicados e procedimentos de direitos por aprovar. O frontend não inventa uma base legal nem um consentimento de marketing.
- Endereço candidato `pedidos.axioma@ocutel.pt`: existência, provisionamento, destinatário de encaminhamento, controlo, fornecedor e entrega ainda não confirmados. Não há caixa criada por este trabalho.
- Serviço de email/identidade remetente/segredos e infraestrutura sem autorização inferida. Testes reais de envio e gravação exigem destino seguro e mandato próprios.
- Nenhum registo/login/Pocket, projeto, tenant, subscrição ou contrato criado por submissão.

Provas necessárias para ativação: dois pedidos isolados; persistência confirmada; erro BD sem falso sucesso; notificação pendente preservada; entrega/retry sem duplicação; timeout com repetição e mesmo recibo; divergência chave/hash; validação/catálogo adulterado; limite/abuso; acesso anónimo a dados e tenant cruzado recusados; campos e estado final refletidos na interface; responsável e destino de email aprovados.

## Verificação e escolha de implementação

Página estática, CSS e JavaScript próprios, sem dependências de execução. Evolução da entrada existente escolhida em vez de introduzir framework ou migrar o alojamento: o questionário não necessita dessas mudanças e a submissão fica desacoplada por configuração. Não usa localStorage/sessionStorage nem introduz tracking; respostas em memória enquanto o documento permanece aberto, com exportação voluntária de texto.

Provas frontend: sintaxe dos scripts, diff, quatro ramos, orientação exclusiva, campos opcionais, validação de contacto/orçamento, preservação de respostas/retorno, limpeza ao mudar área, resumo editável e ausência de envio sem endpoint. Rever os layouts a 320/390/1440 e o Pocket. Os dados de ensaio são fictícios e ficam na pré-visualização local.

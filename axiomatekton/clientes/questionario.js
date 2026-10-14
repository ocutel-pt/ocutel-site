(() => {
  'use strict';
  const areas = {
    'real-estate': {
      name: 'Real Estate', label: 'Património', image: 'area-real-estate',
      description: 'Aquisição, transformação e venda de património próprio.',
      note: 'Este percurso diz respeito ao património e às operações da Axioma Tekton. Os serviços de projeto e obra têm percursos próprios.',
      prompt: 'Que informação procura sobre património?',
      options: [
        ['imoveis-proprios', 'Conhecer imóveis da Axioma Tekton', 'Informações sobre património próprio e oportunidades da empresa.'],
        ['aquisicao', 'Conhecer o processo de aquisição e análise', 'Informações sobre a análise do imóvel e do potencial de intervenção.'],
        ['operacao', 'Compreender uma operação de transformação', 'Conhecer o contexto de transformação e valorização de património próprio.']
      ],
      stages: [['exploracao', 'Estou a explorar possibilidades'], ['imovel-identificado', 'Tenho um imóvel ou uma operação em mente'], ['esclarecimento', 'Procuro esclarecer uma situação concreta']],
      pocket: 'Informação e documentos expressamente partilhados sobre a operação em que participa.'
    },
    architecture: {
      name: 'Architecture', label: 'Projeto', image: 'area-architecture',
      description: 'Levantamento, conceção e desenvolvimento do projeto.',
      note: 'Pode pedir serviços de arquitetura autonomamente. O âmbito e as responsabilidades serão definidos para a sua intervenção.',
      prompt: 'Em que parte do projeto precisa de apoio?',
      options: [
        ['levantamento', 'Levantamento e leitura do existente', 'Compreender o lugar e reunir informação sobre o que existe.'],
        ['concecao', 'Conceção e desenvolvimento do projeto', 'Dar forma à intenção e desenvolver a solução de arquitetura.'],
        ['pecas-projeto', 'Peças de projeto', 'Definir as peças e os entregáveis de que a intervenção necessita.'],
        ['coordenacao', 'Coordenação e acompanhamento técnico', 'Articular o projeto e o acompanhamento, conforme o âmbito contratado.']
      ],
      stages: [['ideia', 'Tenho uma ideia inicial'], ['existente', 'Já tenho informação sobre o imóvel'], ['projeto', 'Já existe um projeto'], ['obra', 'A intervenção já está em curso']],
      pocket: 'Peças e documentos partilhados, fases do trabalho e decisões que pedem o seu acompanhamento.'
    },
    build: {
      name: 'Build', label: 'Execução', image: 'area-build',
      description: 'Preparação e execução de construção e reabilitação.',
      note: 'Pode pedir execução com um projeto existente. Preparação, quantidades e âmbito são analisados antes de um compromisso.',
      prompt: 'Que trabalhos pretende preparar ou executar?',
      options: [
        ['preparacao', 'Preparação e orçamento dos trabalhos', 'Definir o âmbito e a informação necessária para preparar uma proposta.'],
        ['construcao', 'Construção', 'Executar uma intervenção com âmbito e responsabilidades definidos.'],
        ['reabilitacao', 'Reabilitação', 'Intervir no existente com atenção à matéria e à forma como foi construído.'],
        ['renovacao', 'Renovação ou remodelação', 'Adaptar espaços e renovar os elementos abrangidos pelo pedido.']
      ],
      stages: [['ideia', 'Estou a definir o que pretendo fazer'], ['projeto', 'Já tenho um projeto'], ['quantidades', 'Já tenho uma descrição ou mapa de trabalhos'], ['obra', 'Já existem trabalhos em curso']],
      pocket: 'Âmbito, propostas, alterações e informação de entrega que lhe sejam disponibilizados.'
    },
    teams: {
      name: 'Teams', label: 'Pessoas e execução', image: 'area-teams',
      description: 'Competências e recursos para um âmbito de execução.',
      note: 'O pedido deve identificar os trabalhos a executar. A organização de competências e recursos é analisada em função desse âmbito.',
      prompt: 'Que apoio procura para os trabalhos?',
      options: [
        ['competencias', 'Organização de competências e recursos', 'Explicar de que capacidade de execução necessita.'],
        ['ambito', 'Definição do âmbito de execução', 'Clarificar os trabalhos e as responsabilidades a considerar.'],
        ['subempreitada', 'Articulação de trabalhos em subempreitada', 'Dar a conhecer um âmbito concreto para análise e articulação.']
      ],
      stages: [['planeamento', 'Estou a preparar os trabalhos'], ['ambito', 'Já tenho um âmbito definido'], ['execucao', 'Os trabalhos já estão em execução']],
      pocket: 'Âmbito acordado e documentação partilhada sobre os trabalhos contratados.'
    }
  };
  const goals = [['informacao', 'Pedir informações', 'Esclarecer possibilidades e perceber o próximo passo.'], ['orcamento', 'Solicitar uma proposta de orçamento', 'Apresentar um pedido para análise do âmbito e das condições.'], ['conversa', 'Começar por uma conversa', 'Explicar a intenção e receber orientação sobre o percurso.']];
  const roles = [['particular', 'Cliente particular'], ['empresa', 'Empresa ou organização'], ['representante', 'Representante de um cliente'], ['nao-indicar', 'Prefiro não indicar']];
  const propertyTypes = [['apartamento', 'Apartamento ou fração'], ['moradia', 'Moradia'], ['edificio', 'Edifício'], ['espaco', 'Espaço comercial ou de serviços'], ['terreno', 'Terreno'], ['outro', 'Outro tipo de imóvel']];
  const stepNames = ['Área', 'Necessidade', 'Contexto', 'Contacto', 'Rever e enviar'];
  const config = window.AXIOMA_INTAKE_CONFIG || {};
  const form = document.getElementById('request-form');
  const content = document.getElementById('step-content');
  const errors = document.querySelector('.intake-errors');
  const back = document.querySelector('.intake-back');
  const submitButton = document.querySelector('.continue-button');
  const state = { area: '', interests: [], goal: '', locality: '', propertyType: '', stage: '', date: '', budget: '', description: '', role: '', name: '', email: '', phone: '', company: '' };
  let step = 0;
  let pending = null;
  let submitting = false;
  let locked = false;
  let complete = false;
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const choice = (name, id, title, note = '', type = 'radio', selected = false, image = '') => `<label class="intake-choice ${image ? 'area-choice' : ''}"><input type="${type}" name="${name}" id="${name}-${id}" value="${id}"${selected ? ' checked' : ''}><span class="choice-copy">${image ? `<img src="/axiomatekton/symbols/${image}-480.png" width="480" height="480" alt="" aria-hidden="true" decoding="async">` : ''}<strong>${title}</strong>${note ? `<span>${note}</span>` : ''}</span></label>`;
  const field = (name, label, hint = '', type = 'text', extra = '') => `<div class="intake-field"><label for="${name}">${label}</label>${hint ? `<p class="field-hint" id="${name}-hint">${hint}</p>` : ''}<input id="${name}" name="${name}" type="${type}" value="${escape(state[name])}"${hint ? ` aria-describedby="${name}-hint"` : ''} ${extra}></div>`;
  const select = (name, label, values) => `<div class="intake-field"><label for="${name}">${label} (opcional)</label><select id="${name}" name="${name}"><option value="">Ainda não sei / prefiro explicar depois</option>${values.map(([id, text]) => `<option value="${id}"${state[name] === id ? ' selected' : ''}>${text}</option>`).join('')}</select></div>`;
  const labelFor = (items, id) => items.find(item => item[0] === id)?.[1] || 'Não indicado';

  function save() {
    if (complete) return;
    const values = new FormData(form);
    if (step === 0) {
      const nextArea = values.get('area') || '';
      if (nextArea !== state.area) {
        Object.assign(state, {area: nextArea, interests: [], goal: '', locality: '', propertyType: '', stage: '', date: '', budget: '', description: ''});
        pending = null;
      }
    }
    if (step === 1) {
      state.interests = values.getAll('interests');
      state.goal = values.get('goal') || '';
    }
    if (step === 2) for (const key of ['locality', 'propertyType', 'stage', 'date', 'budget', 'description']) state[key] = String(values.get(key) || '').trim();
    if (step === 3) for (const key of ['role', 'name', 'email', 'phone', 'company']) state[key] = String(values.get(key) || '').trim();
  }

  function render(focus = false) {
    const area = areas[state.area];
    errors.hidden = true;
    back.hidden = step === 0 || locked || complete;
    document.querySelector('.step-position').textContent = `Passo ${step + 1} de 5 · ${stepNames[step]}`;
    document.title = `${step + 1} de 5: ${stepNames[step]} — Axioma Tekton`;
    document.querySelectorAll('.intake-steps li').forEach((item, i) => i === step ? item.setAttribute('aria-current', 'step') : item.removeAttribute('aria-current'));
    const selected = document.querySelector('.selected-area');
    selected.hidden = !area;
    if (area) {
      selected.querySelector('img').src = `/axiomatekton/symbols/${area.image}-480.png`;
      selected.querySelector('.selected-area-name').textContent = area.name;
      selected.querySelector('.selected-area-note').textContent = area.note;
    }
    submitButton.disabled = false;
    document.querySelector('.intake-actions').hidden = false;
    if (step === 0) {
      content.innerHTML = `<fieldset id="area-group"><legend tabindex="-1">Por onde quer começar?</legend><p class="question-hint">Escolha a área que mais se aproxima do seu pedido. Pode voltar atrás e ajustar a escolha.</p><div class="choice-grid">${Object.entries(areas).map(([id, area]) => choice('area', id, area.name, area.description, 'radio', state.area === id, area.image)).join('')}</div></fieldset>`;
    }
    if (step === 1) {
      const applicableGoals = state.area === 'real-estate' ? goals.filter(goal => goal[0] !== 'orcamento') : goals;
      content.innerHTML = `<fieldset class="question-group" id="interests-group"><legend tabindex="-1">${area.prompt}</legend><p class="question-hint">Pode selecionar várias possibilidades. Se ainda não souber, escolha a opção de orientação.</p><div class="choice-list">${area.options.map(([id, title, note]) => choice('interests', id, title, note, 'checkbox', state.interests.includes(id))).join('')}${choice('interests', 'orientacao', 'Preciso de orientação para definir o pedido', 'Ainda não sei que serviços se ajustam à minha situação.', 'checkbox', state.interests.includes('orientacao'))}</div></fieldset><fieldset class="question-group" id="goal-group"><legend class="sub-legend">O que gostaria de receber?</legend><div class="choice-list">${applicableGoals.map(([id, title, note]) => choice('goal', id, title, note, 'radio', state.goal === id)).join('')}</div></fieldset>`;
    }
    if (step === 2) {
      content.innerHTML = `<h2 tabindex="-1">Dê-nos um pouco de contexto.</h2><p class="question-hint">Preencha apenas o que já sabe. Esta informação ajuda-nos a perceber o ponto de partida; pode ser completada mais tarde.</p>${field('locality', 'Localidade ou concelho (opcional)', 'Indique a localização geral. Não precisamos da morada completa nesta fase.', 'text', 'maxlength="120" autocomplete="address-level2"')}${select('propertyType', 'Tipo de imóvel ou espaço', propertyTypes)}${select('stage', 'Em que ponto está', area.stages)}<div class="field-pair">${field('date', 'Data pretendida (opcional)', 'Uma referência, sujeita a análise de disponibilidade.', 'date')}${state.area === 'architecture' || state.area === 'build' ? field('budget', 'Orçamento indicativo, em euros (opcional)', 'Se já tiver um valor em mente. Não constitui um preço acordado.', 'text', 'maxlength="20" inputmode="decimal"') : ''}</div><div class="intake-field"><label for="description">O que é importante sabermos? (opcional)</label><p class="field-hint" id="description-hint">Explique o objetivo e as necessidades. Não inclua documentos pessoais, dados bancários ou informação sensível.</p><textarea id="description" name="description" maxlength="2000" aria-describedby="description-hint">${escape(state.description)}</textarea></div>`;
    }
    if (step === 3) {
      content.innerHTML = `<h2 tabindex="-1">Como podemos falar consigo?</h2><p class="question-hint">Precisamos do seu nome e email para responder. Os restantes dados são opcionais. Este pedido não cria uma conta de cliente.</p><fieldset id="role-group"><legend class="sub-legend">Em que qualidade nos contacta? (opcional)</legend><div class="choice-list">${roles.map(([id, title]) => choice('role', id, title, '', 'radio', state.role === id)).join('')}</div></fieldset>${field('name', 'Nome', '', 'text', 'maxlength="120" autocomplete="name" required')}${field('email', 'Email', 'O endereço para receber a resposta ao seu pedido.', 'email', 'maxlength="254" autocomplete="email" autocapitalize="none" spellcheck="false" required')}${field('phone', 'Telefone (opcional)', '', 'tel', 'maxlength="40" autocomplete="tel"')}${field('company', 'Empresa ou organização (opcional)', '', 'text', 'maxlength="160" autocomplete="organization"')}<p class="intake-notice">Antes de qualquer envio poderá rever os dados. O questionário não guarda as respostas no armazenamento permanente do seu navegador.</p>`;
    }
    if (step === 4) renderSummary();
    if (step < 4) submitButton.innerHTML = `${step === 3 ? 'Rever o pedido' : 'Continuar'} <span aria-hidden="true">→</span>`;
    if (focus) content.querySelector('legend[tabindex],h2[tabindex]')?.focus();
  }

  function summaryRows() {
    const area = areas[state.area];
    return [
      ['Área', area.name, 0],
      ['Necessidade', state.interests.map(id => id === 'orientacao' ? 'Preciso de orientação' : labelFor(area.options, id)).join('\n'), 1],
      ['Tipo de pedido', labelFor(goals, state.goal), 1],
      ['Localização', state.locality || 'Não indicada', 2],
      ['Imóvel / espaço', labelFor(propertyTypes, state.propertyType), 2],
      ['Ponto de partida', labelFor(area.stages, state.stage), 2],
      ['Data pretendida', state.date ? state.date.split('-').reverse().join('/') : 'Por definir', 2],
      ...(state.budget ? [['Orçamento indicativo', `${state.budget} €`, 2]] : []),
      ['Observações', state.description || 'Não indicadas', 2],
      ['Contacto', [state.name, state.email, state.phone, state.company, state.role ? labelFor(roles, state.role) : ''].filter(Boolean).join('\n'), 3]
    ];
  }

  function renderSummary() {
    content.innerHTML = `<h2 tabindex="-1">Tudo está como pretende?</h2><p class="question-hint">Reveja o pedido. Pode alterar qualquer resposta antes de o enviar.</p><dl class="summary-list">${summaryRows().map(([label, value, edit]) => `<div class="summary-row"><dt>${label}</dt><dd>${escape(value)}</dd><dd class="summary-actions"><button type="button" data-edit="${edit}" aria-label="Alterar ${label}"${locked ? ' disabled' : ''}>Alterar</button></dd></div>`).join('')}</dl><div class="intake-notice"><strong>O que acontece a seguir</strong><p>Quando a submissão estiver disponível, o pedido será registado para análise e encaminhado à Axioma Tekton. Será um primeiro contacto, sem adjudicação, conta ou acesso automático ao Pocket.</p><p>Futuro Pocket · ${areas[state.area].pocket}</p></div>${config.endpoint ? `<p class="intake-notice">Ao enviar, partilha estes dados com a Axioma Tekton para análise e resposta ao seu pedido.</p><div id="submission-state" role="status"></div>` : `<div class="intake-notice" role="status"><strong>Pedido preparado. Envio online em preparação.</strong><p>Pode guardar o resumo. A receção no Dossier e a notificação por email estão a ser integradas; ainda não foi enviado qualquer pedido.</p></div>`}<button class="download-summary" type="button" data-download>Guardar o resumo do pedido ↓</button>`;
    submitButton.innerHTML = locked ? 'Tentar confirmar o envio →' : 'Enviar o pedido →';
    submitButton.disabled = !config.endpoint;
    document.querySelector('.step-footnote').textContent = config.endpoint ? 'Receberá uma referência após o registo confirmado.' : 'O resumo fica consigo. Nenhum dado foi enviado.';
  }

  function validate() {
    content.querySelectorAll('.field-error').forEach(node => node.remove());
    content.querySelectorAll('[aria-invalid]').forEach(node => {
      node.removeAttribute('aria-invalid');
      const descriptions = (node.getAttribute('aria-describedby') || '').split(' ').filter(id => id && !id.endsWith('-error'));
      if (descriptions.length) node.setAttribute('aria-describedby', descriptions.join(' '));
      else node.removeAttribute('aria-describedby');
    });
    const problems = [];
    if (step === 0 && !state.area) problems.push(['area-real-estate', 'Escolha a área que mais se aproxima do seu pedido.']);
    if (step === 1 && state.interests.length === 0) problems.push([`interests-${areas[state.area].options[0][0]}`, 'Selecione uma possibilidade ou peça orientação.']);
    if (step === 1 && !state.goal) problems.push(['goal-informacao', 'Escolha o que gostaria de receber.']);
    if (step === 2 && state.budget && !/^\d{1,10}(?:[.,]\d{1,2})?$/.test(state.budget)) problems.push(['budget', 'Indique um valor em euros, por exemplo 25000 ou 25000,50.']);
    if (step === 2 && state.date && !/^\d{4}-\d{2}-\d{2}$/.test(state.date)) problems.push(['date', 'Indique uma data válida ou deixe o campo vazio.']);
    if (step === 3 && !state.name) problems.push(['name', 'Indique o seu nome.']);
    if (step === 3 && (!state.email || !document.getElementById('email').validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email))) problems.push(['email', 'Indique um email válido, por exemplo nome@exemplo.pt.']);
    if (!problems.length) return true;
    errors.querySelector('ul').innerHTML = problems.map(([id, message]) => `<li><a href="#${id}">${message}</a></li>`).join('');
    problems.forEach(([id, message]) => {
      const input = document.getElementById(id);
      input.setAttribute('aria-invalid', 'true');
      const error = document.createElement('p'); error.className = 'field-error'; error.id = `${id}-error`; error.textContent = message;
      (input.closest('fieldset') || input.parentElement).append(error);
      input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    });
    errors.hidden = false; errors.focus();
    document.title = `Erro: ${document.title}`;
    return false;
  }

  function go(next, historyMode = 'push') {
    step = next;
    if (historyMode !== 'none') history[historyMode === 'replace' ? 'replaceState' : 'pushState']({axiomaStep: step}, '', `#pedido/passo-${step + 1}`);
    render(true);
  }

  function payload() {
    return {
      schemaVersion: config.schemaVersion || 'axioma-intake.v1', source: 'axioma-site',
      area: state.area, interests: [...state.interests], goal: state.goal,
      context: {locality: state.locality, propertyType: state.propertyType, stage: state.stage, desiredDate: state.date, budgetEUR: state.budget.replace(',', '.'), description: state.description},
      contact: {role: state.role === 'nao-indicar' ? '' : state.role, name: state.name, email: state.email, phone: state.phone, organization: state.company}
    };
  }

  async function send() {
    if (!config.endpoint || submitting || complete) return;
    const target = new URL(config.endpoint, location.href);
    if (target.protocol !== 'https:') throw new Error('O destino de envio precisa de HTTPS.');
    if (!pending) pending = {key: crypto.randomUUID(), body: JSON.stringify(payload())};
    submitting = true; locked = true;
    back.hidden = true; submitButton.disabled = true;
    content.querySelectorAll('[data-edit]').forEach(button => button.disabled = true);
    submitButton.textContent = 'A enviar…';
    const status = document.getElementById('submission-state');
    status.textContent = 'A confirmar o registo do pedido. Mantenha esta página aberta.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(target.href, {method:'POST', credentials:'omit', redirect:'error', headers:{'Content-Type':'application/json', 'Idempotency-Key':pending.key}, body:pending.body, signal:controller.signal});
      const result = await response.json();
      if (!response.ok || result.status !== 'received' || !/^[A-Za-z0-9_-]{12,128}$/.test(result.receipt?.id || '') || !Number.isFinite(Date.parse(result.receipt?.receivedAt))) throw new Error('unconfirmed');
      complete = true;
      document.title = 'Pedido registado — Axioma Tekton';
      content.innerHTML = `<h2 tabindex="-1">O seu pedido ficou registado.</h2><p class="question-hint">Guarde a referência abaixo. A Axioma Tekton poderá analisar o pedido e responder pelo contacto indicado.</p><p class="receipt-reference">Referência · ${escape(result.receipt.id)}</p><p class="intake-notice">${result.emailStatus === 'sent' ? 'A Axioma Tekton foi notificada por email.' : 'O pedido está registado. A notificação interna por email está pendente; não precisa de enviar outro pedido.'}</p><button class="download-summary" type="button" data-download>Guardar o resumo do pedido ↓</button>`;
      document.querySelector('.intake-actions').hidden = true;
      content.querySelector('h2').focus();
    } catch {
      status.textContent = 'Não foi possível confirmar o envio. As respostas continuam nesta página. Pode tentar confirmar novamente: será usado o mesmo pedido, para evitar duplicações.';
      submitButton.disabled = false; submitButton.textContent = 'Tentar confirmar o envio →';
    } finally { clearTimeout(timeout); submitting = false; }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step === 4) { send().catch(() => { document.getElementById('submission-state').textContent = 'O envio está indisponível. Nenhum pedido foi confirmado.'; }); return; }
    save();
    if (validate()) { pending = null; go(step + 1); }
  });
  back.addEventListener('click', () => { if (!locked && step > 0) {save(); go(step - 1);} });
  form.addEventListener('change', event => {
    if (event.target.name !== 'interests') return;
    if (event.target.value === 'orientacao' && event.target.checked) form.querySelectorAll('[name="interests"]').forEach(input => {if (input !== event.target) input.checked = false;});
    else if (event.target.checked) document.getElementById('interests-orientacao').checked = false;
  });
  content.addEventListener('click', event => {
    const edit = event.target.closest('[data-edit]');
    if (edit && !locked) {pending = null; go(Number(edit.dataset.edit));}
    if (!event.target.closest('[data-download]')) return;
    const text = `AXIOMA TEKTON · RESUMO DO PEDIDO\n${complete ? 'Pedido registado. Guarde também a referência apresentada no site.' : 'Preparação local. Este resumo não comprova envio ou receção.'}\n\n${summaryRows().map(([label,value]) => `${label}\n${value}`).join('\n\n')}\n`;
    const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'axioma-tekton-pedido.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  errors.addEventListener('click', event => {
    const link = event.target.closest('a'); if (!link) return;
    event.preventDefault(); document.getElementById(link.getAttribute('href').slice(1))?.focus();
  });
  window.addEventListener('popstate', event => {
    if (!Number.isInteger(event.state?.axiomaStep)) {
      history.replaceState({axiomaStep:step}, '', location.href);
      return;
    }
    if (locked || complete) {history.replaceState({axiomaStep:step}, '', '#pedido/passo-5'); return;}
    save();
    const requested = event.state?.axiomaStep;
    const allowed = Number.isInteger(requested) && requested >= 0 && requested <= 4;
    let limit = !state.area ? 0 : (!state.interests.length || !state.goal) ? 1 : (!state.name || !state.email) ? 3 : 4;
    step = allowed ? Math.min(requested, limit) : 0; render(/^#pedido\/passo-/.test(location.hash));
  });
  history.replaceState({axiomaStep:0}, '', location.href);
  document.getElementById('questionnaire').hidden = false;
  render();
})();

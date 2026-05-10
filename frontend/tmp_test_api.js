(async () => {
  const mod = await import('./src/app/utils/mockApi.js');
  const mock = mod.default;
  const user = { matricula: '1001', nome: 'Dr Teste', role: 'docente' };
  const protocolo = {
    justificativa: 'Teste justificativa'.padEnd(60, '.'),
    resumoPt: 'Resumo PT'.padEnd(60, '.'),
    resumoEn: 'Resumo EN'.padEnd(60, '.'),
    dataInicio: new Date().toISOString(),
    dataTermino: new Date(Date.now()+1000*60*60*24).toISOString(),
    alocacoes: []
  };
  const criado = await mock.createProtocolo(protocolo, user);
  console.log('Criado:', criado.id);
})();

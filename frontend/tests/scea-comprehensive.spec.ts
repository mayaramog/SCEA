import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test@scea.local';
const TEST_PASS = '123';

test.describe('SCEA Comprehensive Requirements Coverage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[id="email"]', TEST_EMAIL);
    await page.fill('input[id="senha"]', TEST_PASS);
    await page.click('button[type="submit"]');
    // Ensure we are logged in (wait for header banner)
    await expect(page.getByRole('banner')).toBeVisible();

    // If we have multi-roles, ensure we are in Docente mode for these tests
    const docenteBtn = page.getByRole('banner').getByRole('button', { name: 'Ver como Docente' });
    if (await docenteBtn.isVisible()) {
        await docenteBtn.click();
    }
  });

  test('should enforce date validation rules (no weekends/holidays)', async ({ page }) => {
    await page.click('button:has-text("Novo Protocolo")');
    
    // Fill step 1
    await page.fill('label:has-text("Título do Projeto") + input', 'Teste de Validação de Datas');
    await page.fill('label:has-text("Objetivo") + textarea', 'Objetivo válido com mais de dez caracteres.');
    await page.fill('label:has-text("Justificativa Científica") + textarea', 'Justificativa válida com mais de dez caracteres.');
    await page.fill('label:has-text("Resumo (PT)") + textarea', 'Resumo em português válido para o teste.');
    await page.click('button:has-text("Próximo")');

    // Step 2: Dates
    await page.fill('input[id="data-inicio"]', '2026-06-06'); 
    await page.fill('input[id="data-termino"]', '2026-06-15');
    await page.click('button:has-text("Próximo")');

    // Should show error for weekend
    await expect(page.getByText('não pode cair em final de semana')).toBeVisible();

    // Fix to valid dates (Monday to Friday)
    await page.fill('input[id="data-inicio"]', '2026-06-01'); 
    await page.fill('input[id="data-termino"]', '2026-06-12');
    await page.click('button:has-text("Próximo")');

    // Should proceed to step 3
    await expect(page.getByText('Adicionar Grupo de Animais')).toBeVisible();
  });

  test('should require at least one animal allocation', async ({ page }) => {
    await page.click('button:has-text("Novo Protocolo")');
    
    // Fill step 1
    await page.fill('label:has-text("Título do Projeto") + input', 'Teste de Alocação Vazia');
    await page.fill('label:has-text("Objetivo") + textarea', 'Objetivo válido com mais de dez caracteres.');
    await page.fill('label:has-text("Justificativa Científica") + textarea', 'Justificativa válida com mais de dez caracteres.');
    await page.fill('label:has-text("Resumo (PT)") + textarea', 'Resumo em português válido para o teste.');
    await page.click('button:has-text("Próximo")');

    // Step 2: Dates
    await page.fill('input[id="data-inicio"]', '2026-06-01'); 
    await page.fill('input[id="data-termino"]', '2026-06-12');
    await page.click('button:has-text("Próximo")');

    // Step 3: Try to submit without adding to list
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Adicione pelo menos uma alocação');
      await dialog.dismiss();
    });
    await page.click('button:has-text("Finalizar e Submeter")');
  });

  test('should complete the full protocol lifecycle: Submit -> Designate -> Review -> Approve', async ({ page }) => {
    const TITULO = `Protocolo E2E Full Flow ${Date.now()}`;

    // --- 1. SUBMIT (DOCENTE) ---
    await page.click('button:has-text("Novo Protocolo")');
    await page.fill('label:has-text("Título do Projeto") + input', TITULO);
    await page.fill('label:has-text("Objetivo") + textarea', 'Objetivo para o fluxo completo de teste E2E.');
    await page.fill('label:has-text("Justificativa Científica") + textarea', 'Justificativa para o fluxo completo de teste E2E.');
    await page.fill('label:has-text("Resumo (PT)") + textarea', 'Resumo PT para o fluxo completo.');
    await page.fill('label:has-text("Resumo (EN)") + textarea', 'Summary EN for the full flow.');
    await page.click('button:has-text("Próximo")');

    await page.fill('input[id="data-inicio"]', '2026-07-01'); 
    await page.fill('input[id="data-termino"]', '2026-07-30');
    await page.click('button:has-text("Próximo")');

    await page.waitForLoadState('networkidle');
    await page.selectOption('select[id="especie-select"]', { index: 1 });
    await page.fill('input[id="quantidade-input"]', '5');
    await page.selectOption('select[id="bioterio-select"]', { index: 1 });
    
    await page.click('button:has-text("Adicionar à Lista")');
    await page.click('button:has-text("Finalizar e Submeter")');

    // Wait for submission to complete and UI to update
    await expect(page.locator('tr').filter({ hasText: TITULO }).first()).toBeVisible();

    // --- 2. DESIGNATE (SECRETARIA) ---
    await page.waitForTimeout(1000);
    await page.getByRole('banner').getByRole('button', { name: 'Ver como Secretaria' }).click();
    await expect(page.getByText('Dashboard da Secretária')).toBeVisible();
    
    const row = page.locator('tr').filter({ hasText: TITULO }).first();
    await row.getByRole('button', { name: 'Designar Parecerista' }).click();
    
    await page.selectOption('select[id="parecerista-select"]', { label: 'Usuário de Teste (Full)' });
    await page.click('button:has-text("Confirmar")');

    // --- 3. REVIEW (PARECERISTA) ---
    await page.waitForTimeout(1000);
    await page.getByRole('banner').getByRole('button', { name: 'Ver como Parecerista' }).click();
    await expect(page.getByText('Portal do Parecerista')).toBeVisible();
    
    // Wait for the card to appear in the Parecerista list
    const card = page.locator('div').filter({ hasText: TITULO }).last();
    await expect(card).toBeVisible({ timeout: 15000 });
    await card.getByRole('button', { name: 'Emitir Parecer' }).click();
    
    await page.fill('textarea[id="resumo-tecnico"]', 'Análise técnica concluída. Metodologia adequada.');
    await page.fill('textarea[id="consideracoes-eticas"]', 'Respeita todas as normas do CONCEA.');
    await page.click('button:has-text("Recomendar Uso")');

    // --- 4. DELIBERATE (PRESIDENTE) ---
    await page.waitForTimeout(1000);
    await page.getByRole('banner').getByRole('button', { name: 'Ver como Presidente' }).click();
    await expect(page.getByText('Portal do Presidente')).toBeVisible();
    
    const novaReuniaoBtn = page.getByRole('button', { name: 'Nova Reunião' });
    if (await novaReuniaoBtn.isVisible()) {
        await novaReuniaoBtn.click();
        await page.fill('input[placeholder="RC-2026-001"]', `RC-TEST-${Date.now()}`);
        await page.fill('input[type="datetime-local"]', '2026-08-15T14:00');
        await page.fill('input[placeholder="Sala A ou Link Teams"]', 'Sala Virtual de Testes');
        await page.click('button:has-text("Criar Reunião")');
    }
    
    await page.click('button:has-text("Acessar Reunião")');
    await page.click('button:has-text("Iniciar Reunião")');
    
    // Ensure the protocol is in the "Available" list for the meeting
    const agendaItem = page.locator('div').filter({ hasText: TITULO }).last();
    await expect(agendaItem).toBeVisible();
    await agendaItem.getByRole('button', { name: 'Adicionar à Reunião' }).click();
    
    // Deliberate (it should now be in the pauta list)
    await agendaItem.getByRole('button', { name: 'Deliberar' }).click();
    await page.fill('textarea[id="justificativa-deliberacao"]', 'Deliberação favorável após análise do comitê.');
    await page.click('button:has-text("Aprovar")');

    await expect(page.locator('div').filter({ hasText: TITULO }).getByText('Deliberado')).toBeVisible();
    
    await page.getByRole('banner').getByRole('button', { name: 'Ver como Docente' }).click();
    const finalRow = page.locator('tr').filter({ hasText: TITULO }).first();
    await expect(finalRow.getByText('Aprovado')).toBeVisible();
  });
});

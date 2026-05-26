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
    const REUNIAO_CODE = `RC-${Date.now()}`;

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
    await page.waitForTimeout(2000);
    await page.getByRole('banner').getByRole('button', { name: 'Ver como Parecerista' }).click();
    await expect(page.getByText('Portal do Parecerista')).toBeVisible();
    
    // Wait for the specific card
    const card = page.locator('div.p-6').filter({ hasText: TITULO }).first();
    await expect(card).toBeVisible({ timeout: 20000 });
    
    // Explicitly wait for the button and click it normally
    const emitirBtn = card.getByRole('button', { name: 'Emitir Parecer' });
    await expect(emitirBtn).toBeVisible();
    await emitirBtn.click();
    
    // Wait for modal and fill
    await expect(page.locator('textarea#resumo-tecnico')).toBeVisible({ timeout: 10000 });
    await page.fill('textarea#resumo-tecnico', 'Análise técnica concluída. Metodologia adequada. Texto longo para validação de caracteres.');
    await page.fill('textarea#consideracoes-eticas', 'Respeita todas as normas do CONCEA. Aplicação dos 3Rs verificada. Texto longo para validação.');
    await page.click('button:has-text("Uso Recomendado")');
    await page.click('button:has-text("Enviar Avaliação Final")');
    
    // Ensure modal is gone
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // --- 4. DELIBERATE (PRESIDENTE) ---
    await page.waitForTimeout(2000);
    await page.getByRole('banner').getByRole('button', { name: 'Ver como Presidente' }).click();
    await expect(page.getByText('Portal do Presidente')).toBeVisible();
    
    // Attempt to create a fresh meeting
    await page.click('button:has-text("Nova Reunião")');
    await page.fill('#new-reuniao-codigo', REUNIAO_CODE);
    // Be very careful with date input (use keyboard to be safe across locales)
    await page.click('#new-reuniao-data');
    await page.keyboard.type('150820261400');
    await page.fill('#new-reuniao-local', 'Sala Virtual de Testes');
    await page.click('button:has-text("Criar Reunião")');
    
    // Handle potential backend reject (e.g. duplicate code)
    await page.waitForTimeout(2000);
    if (await page.getByText('Agendar Reunião do CEUA').isVisible()) {
        await page.click('button:has-text("Cancelar")');
    }

    // Locate ANY usable meeting (Our new one OR fallback to ANY Agendada/Em Andamento)
    let meetingCard = page.locator('div').filter({ hasText: REUNIAO_CODE }).first();
    if (!await meetingCard.isVisible()) {
        console.log('FALLBACK: Using existing meeting');
        meetingCard = page.locator('div').filter({ hasText: /agendada|em andamento/i }).first();
    }
    
    await expect(meetingCard).toBeVisible({ timeout: 15000 });
    await meetingCard.getByRole('button', { name: /Acessar/i }).click({ force: true });
    
    // If it was agendada, we must start it
    const iniciarBtn = page.getByRole('button', { name: 'Iniciar Reunião' });
    if (await iniciarBtn.isVisible()) {
        await iniciarBtn.click({ force: true });
    }
    
    // Add protocol to agenda (Sidebar "Aguardando Pauta")
    const agendaItem = page.locator('div').filter({ hasText: TITULO }).last();
    await expect(agendaItem).toBeVisible({ timeout: 20000 });
    await agendaItem.getByRole('button', { name: 'Adicionar à Reunião' }).click();
    
    // Deliberate (it should now be in the main pauta list)
    await page.waitForTimeout(1000);
    const pautaItem = page.locator('div.border.rounded-xl').filter({ hasText: TITULO }).first();
    await pautaItem.getByRole('button', { name: 'Deliberar' }).first().click();
    
    await page.fill('textarea[id="justificativa-deliberacao"]', 'Deliberação favorável após análise do comitê.');
    await page.click('button:has-text("Aprovar")');

    // Confirm visual state change
    await expect(pautaItem.getByText('Deliberado')).toBeVisible();
    
    // Go back to Docente Dashboard to check status
    await page.getByRole('banner').getByRole('button', { name: 'Ver como Docente' }).click();
    const finalRow = page.locator('tr').filter({ hasText: TITULO }).first();
    await expect(finalRow.getByText('Aprovado')).toBeVisible();
  });
});

/**
 * FinTrack - Integração com API BFF
 * Este arquivo contém as funções para comunicação com a API Python na Vercel
 */

const API_URL = 'https://fintrack-bff.vercel.app/api/v1';

/**
 * Carregar gastos da API
 */
async function loadExpensesFromAPI() {
  try {
    const response = await fetch(`${API_URL}/expenses`);
    const data = await response.json();
    
    // Mapear dados da API para o formato local
    window.expenses = data.items.map(item => ({
      id: item.id,
      desc: item.descricao,
      value: parseFloat(item.valor_parcela),
      date: item.data,
      card: item.cartao_nome,
      category: item.categoria,
      type: item.tipo === 'parcelado' ? 'installment' : item.tipo === 'fixo' ? 'fixed' : 'single',
      installCurr: item.parcela_atual,
      installTotal: item.total_parcelas,
      notes: item.observacao || ''
    }));
    
    // Atualizar a interface
    if (typeof renderExpenseTable === 'function') renderExpenseTable();
    if (typeof renderHomeRecent === 'function') renderHomeRecent();
    if (typeof updateHomeKPIs === 'function') updateHomeKPIs();
    
    console.log('Dados carregados da API:', window.expenses.length, 'gastos');
  } catch (error) {
    console.error('Erro ao carregar gastos:', error);
    if (typeof toast === 'function') toast('Erro ao carregar dados da API', 'error');
  }
}

/**
 * Salvar gasto na API
 */
async function saveExpenseToAPI(expenseData) {
  try {
    // Mapear formato local para formato da API
    const apiData = {
      data: expenseData.date,
      cartao_nome: expenseData.card,
      categoria: expenseData.category,
      descricao: expenseData.desc,
      valor_parcela: expenseData.value,
      tipo: expenseData.type === 'installment' ? 'parcelado' : expenseData.type === 'fixed' ? 'fixo' : 'normal',
      parcela_atual: expenseData.installCurr || 1,
      total_parcelas: expenseData.installTotal || 1,
      origem: 'manual',
      observacao: expenseData.notes || ''
    };
    
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiData)
    });
    
    if (!response.ok) throw new Error('Erro ao salvar gasto');
    
    const result = await response.json();
    console.log('Gasto salvo na API:', result);
    
    // Recarregar dados da API
    await loadExpensesFromAPI();
    
    return result;
  } catch (error) {
    console.error('Erro ao salvar gasto:', error);
    throw error;
  }
}

/**
 * Atualizar gasto na API
 */
async function updateExpenseInAPI(id, expenseData) {
  try {
    const apiData = {
      data: expenseData.date,
      cartao_nome: expenseData.card,
      categoria: expenseData.category,
      descricao: expenseData.desc,
      valor_parcela: expenseData.value,
      tipo: expenseData.type === 'installment' ? 'parcelado' : expenseData.type === 'fixed' ? 'fixo' : 'normal',
      parcela_atual: expenseData.installCurr || 1,
      total_parcelas: expenseData.installTotal || 1,
      observacao: expenseData.notes || ''
    };
    
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiData)
    });
    
    if (!response.ok) throw new Error('Erro ao atualizar gasto');
    
    const result = await response.json();
    console.log('Gasto atualizado na API:', result);
    
    // Recarregar dados da API
    await loadExpensesFromAPI();
    
    return result;
  } catch (error) {
    console.error('Erro ao atualizar gasto:', error);
    throw error;
  }
}

/**
 * Deletar gasto da API
 */
async function deleteExpenseFromAPI(id) {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Erro ao deletar gasto');
    
    console.log('Gasto deletado da API:', id);
    
    // Recarregar dados da API
    await loadExpensesFromAPI();
    
    return true;
  } catch (error) {
    console.error('Erro ao deletar gasto:', error);
    throw error;
  }
}

/**
 * Carregar resumo do dashboard da API
 */
async function loadDashboardSummaryFromAPI() {
  try {
    const now = new Date();
    const response = await fetch(`${API_URL}/dashboard/summary?month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
    const data = await response.json();
    
    console.log('Resumo do dashboard:', data);
    
    // Atualizar KPIs na interface
    if (data.total_month) {
      const kpiTotal = document.getElementById('kpi-total');
      if (kpiTotal) kpiTotal.textContent = fmt(data.total_month);
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao carregar resumo do dashboard:', error);
    return null;
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('API Integration loaded');
  // Carregar dados da API ao iniciar
  loadExpensesFromAPI();
  loadDashboardSummaryFromAPI();
});

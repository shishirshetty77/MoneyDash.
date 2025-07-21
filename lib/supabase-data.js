import { supabase } from './supabaseClient';

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data || [];
}

// Transactions
export async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      categories (
        id,
        name,
        type
      )
    `)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  
  return data || [];
}

export async function addTransaction(transaction) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      ...transaction,
      user_id: user.id
    }])
    .select(`
      *,
      categories (
        id,
        name,
        type
      )
    `)
    .single();
  
  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
  
  return data;
}

export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      categories (
        id,
        name,
        type
      )
    `)
    .single();
  
  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
  
  return data;
}

export async function deleteTransaction(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
  
  return true;
}

// Budgets
export async function getBudgets() {
  const { data, error } = await supabase
    .from('budgets')
    .select(`
      *,
      categories (
        id,
        name,
        type
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
  
  return data || [];
}

export async function addBudget(budget) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { data, error } = await supabase
    .from('budgets')
    .insert([{
      ...budget,
      user_id: user.id
    }])
    .select(`
      *,
      categories (
        id,
        name,
        type
      )
    `)
    .single();
  
  if (error) {
    console.error('Error adding budget:', error);
    throw error;
  }
  
  return data;
}

export async function updateBudget(id, updates) {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      categories (
        id,
        name,
        type
      )
    `)
    .single();
  
  if (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
  
  return data;
}

export async function deleteBudget(id) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
  
  return true;
}

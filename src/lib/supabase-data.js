import { supabase } from './supabaseClient'

// Transactions
export const getTransactions = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Error getting user:', userError)
    return []
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
  return data
}

export const createTransaction = async (transaction) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Error getting user:', userError)
    throw new Error('User not authenticated')
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      ...transaction,
      user_id: user.id
    }])
    .select()
  
  if (error) {
    console.error('Error creating transaction:', error)
    throw error
  }
  return data[0]
}

export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating transaction:', error)
    throw error
  }
  return data[0]
}

export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting transaction:', error)
    throw error
  }
  return true
}

// Budgets
export const getBudgets = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Error getting user:', userError)
    return []
  }
  
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .order('category')
  
  if (error) {
    console.error('Error fetching budgets:', error)
    return []
  }
  return data
}

export const createBudget = async (budget) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Error getting user:', userError)
    throw new Error('User not authenticated')
  }
  
  const { data, error } = await supabase
    .from('budgets')
    .insert([{
      ...budget,
      user_id: user.id
    }])
    .select()
  
  if (error) {
    console.error('Error creating budget:', error)
    throw error
  }
  return data[0]
}

export const updateBudget = async (id, updates) => {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating budget:', error)
    throw error
  }
  return data[0]
}

export const deleteBudget = async (id) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting budget:', error)
    throw error
  }
  return true
}

// Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
}

export const createCategory = async (category) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Error getting user:', userError)
    throw new Error('User not authenticated')
  }
  
  const { data, error } = await supabase
    .from('categories')
    .insert([{
      ...category,
      user_id: user.id
    }])
    .select()
  
  if (error) {
    console.error('Error creating category:', error)
    throw error
  }
  return data[0]
}

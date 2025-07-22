import { supabase } from './supabaseClient'

// Utility functions for camelCase/snake_case conversion
const camelToSnake = (obj) => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  }
  
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = camelToSnake(value)
  }
  return result
}

const snakeToCamel = (obj) => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel)
  }
  
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = snakeToCamel(value)
  }
  return result
}

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
  // Convert snake_case to camelCase for frontend
  return data.map(budget => snakeToCamel(budget))
}

export const createBudget = async (budget) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Error getting user:', userError)
    throw new Error('User not authenticated')
  }
  
  // Convert camelCase to snake_case for database
  const budgetSnakeCase = camelToSnake(budget)
  
  const { data, error } = await supabase
    .from('budgets')
    .insert([{
      ...budgetSnakeCase,
      user_id: user.id
    }])
    .select()
  
  if (error) {
    console.error('Error creating budget:', error)
    throw error
  }
  // Convert response back to camelCase
  return snakeToCamel(data[0])
}

export const updateBudget = async (id, updates) => {
  // Convert camelCase to snake_case for database
  const updatesSnakeCase = camelToSnake(updates)
  
  const { data, error } = await supabase
    .from('budgets')
    .update(updatesSnakeCase)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating budget:', error)
    throw error
  }
  // Convert response back to camelCase
  return snakeToCamel(data[0])
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

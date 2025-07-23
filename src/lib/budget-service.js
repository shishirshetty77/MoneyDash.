import { supabase } from './supabaseClient';

/**
 * Budget Service - A robust, production-ready service for budget management
 * 
 * This service handles all budget-related operations with proper error handling,
 * data validation, and clean architecture principles.
 */

// Types and Constants
export const BUDGET_CATEGORIES = [
  'Food & Dining',
  'Transportation', 
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Other'
];

export const RECURRING_TYPES = ['weekly', 'monthly', 'yearly'];

// Utility Functions
const validateBudgetData = (budgetData) => {
  const errors = [];
  
  if (!budgetData.name || typeof budgetData.name !== 'string' || budgetData.name.trim().length === 0) {
    errors.push('Budget name is required and must be a non-empty string');
  }
  
  if (!BUDGET_CATEGORIES.includes(budgetData.category)) {
    errors.push(`Category must be one of: ${BUDGET_CATEGORIES.join(', ')}`);
  }
  
  if (!budgetData.amount || isNaN(parseFloat(budgetData.amount)) || parseFloat(budgetData.amount) <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  if (!budgetData.startDate || !isValidDate(budgetData.startDate)) {
    errors.push('Start date is required and must be a valid date');
  }
  
  if (!budgetData.endDate || !isValidDate(budgetData.endDate)) {
    errors.push('End date is required and must be a valid date');
  }
  
  if (budgetData.startDate && budgetData.endDate && new Date(budgetData.startDate) >= new Date(budgetData.endDate)) {
    errors.push('End date must be after start date');
  }
  
  if (budgetData.isRecurring && !RECURRING_TYPES.includes(budgetData.recurringType)) {
    errors.push(`Recurring type must be one of: ${RECURRING_TYPES.join(', ')}`);
  }
  
  return errors;
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const formatBudgetForDatabase = (budgetData, userId) => {
  return {
    user_id: userId,
    name: budgetData.name.trim(),
    category: budgetData.category,
    amount: parseFloat(budgetData.amount),
    start_date: budgetData.startDate,
    end_date: budgetData.endDate,
    is_recurring: Boolean(budgetData.isRecurring),
    recurring_type: budgetData.isRecurring ? budgetData.recurringType : null
  };
};

const formatBudgetFromDatabase = (dbBudget) => {
  return {
    id: dbBudget.id,
    name: dbBudget.name,
    category: dbBudget.category,
    amount: dbBudget.amount,
    startDate: dbBudget.start_date,
    endDate: dbBudget.end_date,
    isRecurring: dbBudget.is_recurring,
    recurringType: dbBudget.recurring_type,
    createdAt: dbBudget.created_at,
    updatedAt: dbBudget.updated_at
  };
};

// Service Functions
export const budgetService = {
  /**
   * Get all budgets for the authenticated user
   * @returns {Promise<Array>} Array of budget objects
   */
  async getBudgets() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data.map(formatBudgetFromDatabase);
    } catch (error) {
      console.error('Error in getBudgets:', error);
      throw new Error(`Failed to fetch budgets: ${error.message}`);
    }
  },

  /**
   * Create a new budget
   * @param {Object} budgetData - The budget data to create
   * @returns {Promise<Object>} The created budget object
   */
  async createBudget(budgetData) {
    try {
      // Validate input data
      const validationErrors = validateBudgetData(budgetData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check for overlapping budgets in the same category
      const { data: existingBudgets, error: checkError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', budgetData.category)
        .or(`start_date.lte.${budgetData.endDate},end_date.gte.${budgetData.startDate}`);

      if (checkError) {
        throw new Error(`Error checking existing budgets: ${checkError.message}`);
      }

      if (existingBudgets && existingBudgets.length > 0) {
        console.warn(`Warning: Found ${existingBudgets.length} overlapping budget(s) for category "${budgetData.category}"`);
        // Note: We're allowing overlapping budgets but logging a warning
        // You can change this behavior if you want to prevent overlaps
      }

      // Format data for database
      const dbBudget = formatBudgetForDatabase(budgetData, user.id);

      // Insert into database
      const { data, error } = await supabase
        .from('budgets')
        .insert([dbBudget])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      const createdBudget = formatBudgetFromDatabase(data);
      console.log('✅ Budget created successfully:', createdBudget);
      
      return createdBudget;
    } catch (error) {
      console.error('Error in createBudget:', error);
      throw new Error(`Failed to create budget: ${error.message}`);
    }
  },

  /**
   * Update an existing budget
   * @param {string} budgetId - The ID of the budget to update
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} The updated budget object
   */
  async updateBudget(budgetId, updateData) {
    try {
      if (!budgetId) {
        throw new Error('Budget ID is required');
      }

      // Validate input data
      const validationErrors = validateBudgetData(updateData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Format data for database
      const dbUpdateData = {
        name: updateData.name.trim(),
        category: updateData.category,
        amount: parseFloat(updateData.amount),
        start_date: updateData.startDate,
        end_date: updateData.endDate,
        is_recurring: Boolean(updateData.isRecurring),
        recurring_type: updateData.isRecurring ? updateData.recurringType : null,
        updated_at: new Date().toISOString()
      };

      // Update in database
      const { data, error } = await supabase
        .from('budgets')
        .update(dbUpdateData)
        .eq('id', budgetId)
        .eq('user_id', user.id) // Ensure user can only update their own budgets
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('Budget not found or you do not have permission to update it');
      }

      const updatedBudget = formatBudgetFromDatabase(data);
      console.log('✅ Budget updated successfully:', updatedBudget);
      
      return updatedBudget;
    } catch (error) {
      console.error('Error in updateBudget:', error);
      throw new Error(`Failed to update budget: ${error.message}`);
    }
  },

  /**
   * Delete a budget
   * @param {string} budgetId - The ID of the budget to delete
   * @returns {Promise<void>}
   */
  async deleteBudget(budgetId) {
    try {
      if (!budgetId) {
        throw new Error('Budget ID is required');
      }

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete from database
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)
        .eq('user_id', user.id); // Ensure user can only delete their own budgets

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Budget deleted successfully:', budgetId);
    } catch (error) {
      console.error('Error in deleteBudget:', error);
      throw new Error(`Failed to delete budget: ${error.message}`);
    }
  },

  /**
   * Calculate spending for a specific budget based on transactions
   * @param {Object} budget - The budget object
   * @param {Array} transactions - Array of transaction objects
   * @returns {Object} Spending analysis object
   */
  calculateBudgetSpending(budget, transactions) {
    try {
      if (!budget || !Array.isArray(transactions)) {
        throw new Error('Invalid budget or transactions data');
      }

      const budgetStart = new Date(budget.startDate);
      const budgetEnd = new Date(budget.endDate);
      
      // Filter transactions that match this budget
      const relevantTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        
        return (
          transaction.type === 'expense' &&
          transaction.category === budget.category &&
          transactionDate >= budgetStart &&
          transactionDate <= budgetEnd
        );
      });
      
      // Calculate total spent
      const totalSpent = relevantTransactions.reduce((sum, transaction) => {
        return sum + Math.abs(transaction.amount);
      }, 0);
      
      // Calculate percentage and status
      const percentage = (totalSpent / budget.amount) * 100;
      const remaining = Math.max(0, budget.amount - totalSpent);
      
      let status = 'good';
      if (percentage >= 100) {
        status = 'exceeded';
      } else if (percentage >= 80) {
        status = 'warning';
      }
      
      return {
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(2)),
        remaining: parseFloat(remaining.toFixed(2)),
        status,
        transactionCount: relevantTransactions.length,
        transactions: relevantTransactions
      };
    } catch (error) {
      console.error('Error in calculateBudgetSpending:', error);
      return {
        totalSpent: 0,
        percentage: 0,
        remaining: budget?.amount || 0,
        status: 'good',
        transactionCount: 0,
        transactions: []
      };
    }
  }
};

export default budgetService;

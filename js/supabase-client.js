import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const db = {
  async fetchBooks() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  async borrowBook(bookId, userName, days) {
    try {
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + days);

      const { data, error } = await supabase
        .from('book_loans')
        .insert([
          {
            book_id: bookId,
            borrower_name: userName,
            borrow_date: new Date().toISOString(),
            return_date: returnDate.toISOString(),
            status: 'active'
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, loan: data[0], returnDate };
    } catch (error) {
      console.error('Error borrowing book:', error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getBorrowHistory() {
    try {
      const { data, error } = await supabase
        .from('book_loans')
        .select('*, books(*)')
        .order('borrow_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      throw error;
    }
  }
};

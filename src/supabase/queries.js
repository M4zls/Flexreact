import { supabase } from './supabase';

// Obtener todos los productos
export async function getProducts() {
  try {
    if (!supabase) {
      console.error('Error: Supabase no está configurado');
      return { data: [], error: new Error('Supabase no está configurado') };
    }
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error en la consulta de Supabase:', error);
      return { data: [], error };
    }

    return { data: data, error: null };
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return { data: [], error };
  }
}

// Obtener un producto por ID
export async function getProductById(id) {
  try {
    if (!supabase) {
      return { data: null, error: new Error('Supabase no está configurado') };
    }
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Ya no necesitamos mapeo, devolvemos los datos directamente
    return { data: data, error: null };
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return { data: null, error };
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(category) {
  try {
    if (!supabase) {
      return { data: [], error: new Error('Supabase no está configurado') };
    }
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria', category)
      .order('nombre', { ascending: true });

    if (error) throw error;

    
    return { data: data, error: null };
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    return { data: null, error };
  }
}

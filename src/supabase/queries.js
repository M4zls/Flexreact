import { supabase } from './supabase';

// Obtener todos los productos
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    
    // Mapear los datos de Supabase al formato que usa la app
    const mappedData = data?.map(product => ({
      id: product.id,
      name: product.nombre,
      price: product.precio,
      image: product.imagen,
      category: product.categoria,
      sizes: product.tallas,
      discount: product.descuento
    }));

    return { data: mappedData, error: null };
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return { data: null, error };
  }
}

// Obtener un producto por ID
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Mapear los datos de Supabase al formato que usa la app
    const mappedData = {
      id: data.id,
      name: data.nombre,
      price: data.precio,
      image: data.imagen,
      category: data.categoria,
      sizes: data.tallas,
      discount: data.descuento
    };

    return { data: mappedData, error: null };
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return { data: null, error };
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria', category)
      .order('nombre', { ascending: true });

    if (error) throw error;

    // Mapear los datos de Supabase al formato que usa la app
    const mappedData = data?.map(product => ({
      id: product.id,
      name: product.nombre,
      price: product.precio,
      image: product.imagen,
      category: product.categoria,
      sizes: product.tallas,
      discount: product.descuento
    }));

    return { data: mappedData, error: null };
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    return { data: null, error };
  }
}

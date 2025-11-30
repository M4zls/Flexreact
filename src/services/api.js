const API_URL = 'https://vigilant-patience-production-8b72.up.railway.app';

/**
 * Función helper para manejar respuestas de la API
 */
async function handleResponse(response) {
  let data;
  
  try {
    // Para ERR_INCOMPLETE_CHUNKED_ENCODING, intentar obtener lo que se pueda
    const text = await response.text();
    console.log('=== RESPUESTA DEL BACKEND ===');
    console.log('Status:', response.status);
    console.log('Length:', text?.length || 0);
    console.log('Contenido:', text?.substring(0, 500) || 'VACIO');
    console.log('==============================');
    
    if (text && text.length > 0) {
      data = JSON.parse(text);
    } else {
      data = {};
    }
  } catch (error) {
    console.error('Error al parsear respuesta:', error);
    console.error('Esto indica un problema de serialización en el backend');
    throw new Error('El servidor no pudo serializar la respuesta correctamente. Revisa las entidades del backend.');
  }
  
  if (!response.ok) {
    console.error('=== ERROR DEL SERVIDOR ===');
    console.error('Status:', response.status);
    console.error('StatusText:', response.statusText);
    console.error('Data completa:', JSON.stringify(data, null, 2));
    console.error('Message:', data?.message);
    console.error('Error:', data?.error);
    console.error('========================');
    
    let errorMessage = data?.message || data?.error || response.statusText;
    
    if (response.status === 401) {
      errorMessage = 'Email o contraseña incorrectos';
    } else if (response.status === 400 && !errorMessage) {
      errorMessage = 'Error en los datos enviados';
    } else if (!errorMessage) {
      errorMessage = 'Error en el servidor';
    }
    
    throw new Error(errorMessage);
  }
  
  return data;
}

/**
 * Registrar nuevo usuario
 */
export async function registrarUsuario(userData) {
  try {
    // El backend Spring Boot solo necesita: nombre, email, password
    // No enviar confirmPassword
    const { nombre, email, password } = userData;
    
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, email, password, confirmPassword: password }),
  });
    
    console.log('=== RESPUESTA REGISTRO ===');
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    const text = await response.text();
    console.log('Response text:', text);
    console.log('========================');
    
    const data = text ? JSON.parse(text) : {};
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error en el registro');
    }
    
    return data;
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    throw error;
  }
}

/**
 * Iniciar sesión
 */
export async function loginUsuario(email, password) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    throw error;
  }
}

/**
 * Cerrar sesión
 */
export async function logoutUsuario(token) {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en logoutUsuario:', error);
    throw error;
  }
}

/**
 * Obtener usuario actual
 */
export async function obtenerUsuarioActual(token) {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en obtenerUsuarioActual:', error);
    throw error;
  }
}

/**
 * Crear pedido
 */
export async function crearPedido(pedidoData, token) {
  try {
    console.log('=== ENVIANDO PEDIDO AL BACKEND ===');
    console.log('URL:', `${API_URL}/api/pedidos`);
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    console.log('Body:', JSON.stringify(pedidoData, null, 2));
    console.log('==================================');
    
    const response = await fetch(`${API_URL}/api/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(pedidoData),
    });
    
    console.log('=== RESPUESTA DEL BACKEND ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('=============================');
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en crearPedido:', error);
    throw error;
  }
}

/**
 * Obtener pedidos del usuario
 */
export async function obtenerPedidos(token, userId) {
  try {
    const response = await fetch(`${API_URL}/api/pedidos/usuario/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en obtenerPedidos:', error);
    throw error;
  }
}

/**
 * Obtener pedido por ID
 */
export async function obtenerPedidoPorId(pedidoId, token) {
  try {
    const response = await fetch(`${API_URL}/api/pedidos/${pedidoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en obtenerPedidoPorId:', error);
    throw error;
  }
}

/**
 * Actualizar estado del pedido
 */
export async function actualizarEstadoPedido(pedidoId, estado, token) {
  try {
    const response = await fetch(`${API_URL}/api/pedidos/${pedidoId}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en actualizarEstadoPedido:', error);
    throw error;
  }
}

/**
 * Obtener todos los productos
 */
export async function obtenerProductos() {
  try {
    const response = await fetch(`${API_URL}/api/productos`, {
      method: 'GET',
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en obtenerProductos:', error);
    throw error;
  }
}

/**
 * Obtener producto por ID
 */
export async function obtenerProductoPorId(productoId) {
  try {
    const response = await fetch(`${API_URL}/api/productos/${productoId}`, {
      method: 'GET',
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en obtenerProductoPorId:', error);
    throw error;
  }
}

/**
 * Obtener perfil del usuario
 */
export async function obtenerPerfil(token) {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/perfil`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en obtenerPerfil:', error);
    throw error;
  }
}

/**
 * Actualizar perfil del usuario
 */
export async function actualizarPerfil(nombre, token) {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/perfil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en actualizarPerfil:', error);
    throw error;
  }
}

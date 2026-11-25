import { supabase } from './supabase';

function banco() {
  if (!supabase) throw new Error('Supabase não configurado (arquivo .env).');
  return supabase;
}

export async function salvarOrcamento({ usuario, cliente, endereco, km, gasolina, volume, valor }) {
  const { error } = await banco().from('orcamentos').insert({
    usuario,
    cliente,
    endereco,
    km,
    gasolina,
    volume_litros: volume,
    valor,
  });
  if (error) throw error;
}

export async function listarOrcamentos(usuario) {
  const { data, error } = await banco()
    .from('orcamentos')
    .select('*')
    .eq('usuario', usuario)
    .order('criado_em', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data;
}
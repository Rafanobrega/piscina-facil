import { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listarOrcamentos } from '../orcamentos';
import { cores } from '../tema';

function formatarReais(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function formatarData(iso) {
  const d = new Date(iso);
  const dois = (n) => String(n).padStart(2, '0');
  return (
    dois(d.getDate()) + '/' + dois(d.getMonth() + 1) + '/' + d.getFullYear() +
    ' às ' + dois(d.getHours()) + ':' + dois(d.getMinutes())
  );
}

function Detalhe({ rotulo, valor }) {
  return (
    <View style={styles.detalhe}>
      <Text style={styles.detalheRotulo}>{rotulo}</Text>
      <Text style={styles.detalheValor}>{valor}</Text>
    </View>
  );
}

export default function Historico() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    try {
      const usuario = (await AsyncStorage.getItem('usuarioLogado')) || 'anonimo';
      setItens(await listarOrcamentos(usuario));
      setErro('');
    } catch (e) {
      setErro('Não foi possível carregar o histórico. Verifique a internet e tente de novo.');
    }
  };

  // Recarrega sempre que a tela é aberta
  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      carregar().then(() => setCarregando(false));
    }, [])
  );

  const atualizar = async () => {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  };

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.carregando}>Carregando histórico...</Text>
      </View>
    );
  }

  const cabecalho = (
    <View style={styles.cabecalho}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={styles.tituloApp}>Histórico</Text>
      <Text style={styles.subtitulo}>
        {itens.length === 1 ? '1 orçamento' : itens.length + ' orçamentos'}
      </Text>
      {erro !== '' && (
        <View style={styles.erroCartao}>
          <Text style={styles.erro}>{erro}</Text>
          <Pressable onPress={atualizar}>
            <Text style={styles.tentar}>Tentar de novo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.tela}>
      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          erro === '' ? (
            <Text style={styles.vazio}>
              Nenhum orçamento ainda.{'\n'}Faça um cálculo na Calculadora e ele aparece aqui.
            </Text>
          ) : null
        }
        refreshing={atualizando}
        onRefresh={atualizar}
        renderItem={({ item }) => (
          <View style={styles.cartao}>
            <View style={styles.linhaTopo}>
              <Text style={styles.cliente} numberOfLines={1}>
                {item.cliente ? item.cliente : 'Cliente sem nome'}
              </Text>
              <Text style={styles.valor}>{formatarReais(item.valor)}</Text>
            </View>

            {item.endereco ? (
              <Text style={styles.endereco} numberOfLines={2}>
                {item.endereco}
              </Text>
            ) : null}

            <View style={styles.separador} />

            <View style={styles.linhaDetalhes}>
              <Detalhe rotulo="Distância" valor={Number(item.km).toFixed(1).replace('.', ',') + ' km'} />
              <Detalhe rotulo="Gasolina" valor={'R$ ' + Number(item.gasolina).toFixed(2).replace('.', ',')} />
              <Detalhe rotulo="Piscina" valor={Number(item.volume_litros) + ' L'} />
            </View>

            <Text style={styles.data}>{formatarData(item.criado_em)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
  carregando: { marginTop: 12, color: cores.cinza },
  lista: { padding: 20, paddingBottom: 40 },

  cabecalho: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  emoji: { fontSize: 48 },
  tituloApp: { fontSize: 28, fontWeight: 'bold', color: cores.primariaEscura },
  subtitulo: { fontSize: 14, color: cores.cinza, marginTop: 4 },

  erroCartao: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  erro: { color: cores.erro, textAlign: 'center' },
  tentar: { color: cores.primaria, fontWeight: '600', marginTop: 8 },

  vazio: { textAlign: 'center', color: cores.cinza, marginTop: 30, lineHeight: 22 },

  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  linhaTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cliente: { flex: 1, fontSize: 17, fontWeight: '600', color: cores.texto, marginRight: 8 },
  valor: { fontSize: 22, fontWeight: 'bold', color: cores.primariaEscura },
  endereco: { fontSize: 13, color: cores.cinza, marginTop: 4 },

  separador: { height: 1, backgroundColor: cores.borda, marginVertical: 12 },
  linhaDetalhes: { flexDirection: 'row' },
  detalhe: { flex: 1 },
  detalheRotulo: { fontSize: 12, color: cores.cinza },
  detalheValor: { fontSize: 15, fontWeight: '600', color: cores.texto, marginTop: 2 },

  data: { fontSize: 12, color: cores.cinza, marginTop: 12 },
});
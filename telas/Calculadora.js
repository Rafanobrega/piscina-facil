import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Vibration,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcularPreco } from '../calculo';
import { distanciaKm } from '../distancia';
import { cores } from '../tema';

// Campo com título e unidade opcional (km, R$/L, L)
function Campo({ titulo, unidade, valor, aoMudar, placeholder, numerico = true, dica }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={styles.linhaInput}>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={aoMudar}
          keyboardType={numerico ? 'decimal-pad' : 'default'}
          autoCapitalize={numerico ? 'none' : 'words'}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
        {unidade ? <Text style={styles.unidade}>{unidade}</Text> : null}
      </View>
      {dica ? <Text style={styles.dica}>{dica}</Text> : null}
    </View>
  );
}

export default function Calculadora({ navigation, route }) {
  const [base, setBase] = useState('');
  const [cliente, setCliente] = useState('');
  const [endereco, setEndereco] = useState('');
  const [km, setKm] = useState('');
  const [gasolina, setGasolina] = useState('');
  const [volume, setVolume] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);
  const scrollRef = useRef(null);

  // Carrega o endereço base salvo (ponto de partida do piscineiro)
  useEffect(() => {
    AsyncStorage.getItem('enderecoBase')
      .then((valor) => {
        if (valor) setBase(valor);
      })
      .catch(() => {});
  }, []);

  const mudarBase = (texto) => {
    setBase(texto);
    AsyncStorage.setItem('enderecoBase', texto).catch(() => {});
  };

  // Aceita vírgula ou ponto (ex: 5,89 ou 5.89)
  const paraNumero = (texto) => parseFloat(texto.replace(',', '.'));

  const buscarDistancia = async () => {
    Keyboard.dismiss();
    if (base.trim() === '' || endereco.trim() === '') {
      setErro('Informe o seu endereço base e o endereço do cliente.');
      return;
    }
    setErro('');
    setBuscando(true);
    try {
      const dist = await distanciaKm(base.trim(), endereco.trim());
      setKm(dist.toFixed(1).replace('.', ','));
    } catch (e) {
      setErro(e.message + ' Digite a distância manualmente.');
    }
    setBuscando(false);
  };

  const calcular = () => {
    const kmNum = paraNumero(km);
    const gasolinaNum = paraNumero(gasolina);
    const volumeNum = paraNumero(volume);

    if (isNaN(kmNum) || isNaN(gasolinaNum) || isNaN(volumeNum)) {
      setErro('Preencha distância, gasolina e volume com números.');
      setResultado(null);
      return;
    }

    setErro('');
    setResultado(calcularPreco(kmNum, gasolinaNum, volumeNum));
    Vibration.vibrate(300); // recurso do celular
    Keyboard.dismiss();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const limpar = () => {
    setCliente('');
    setEndereco('');
    setKm('');
    setGasolina('');
    setVolume('');
    setResultado(null);
    setErro('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.cabecalho}>
          <Text style={styles.emoji}>🏊</Text>
          <Text style={styles.tituloApp}>Piscina Fácil</Text>
          <Text style={styles.subtitulo}>Descubra quanto cobrar pela limpeza</Text>
        </View>

        <View style={styles.cartao}>
          <Campo
            titulo="Seu endereço (ponto de partida)"
            valor={base}
            aoMudar={mudarBase}
            placeholder="Rua, número, bairro, cidade"
            numerico={false}
            dica="Fica salvo no aparelho."
          />
        </View>

        <View style={[styles.cartao, { marginTop: 16 }]}>
          <Campo
            titulo="Nome do cliente"
            valor={cliente}
            aoMudar={setCliente}
            placeholder="Ex: Maria Silva"
            numerico={false}
          />
          <Campo
            titulo="Endereço do cliente"
            valor={endereco}
            aoMudar={setEndereco}
            placeholder="Rua, número, bairro, cidade"
            numerico={false}
          />

          <Pressable
            style={({ pressed }) => [styles.botaoSecundario, pressed && styles.botaoPressionado]}
            onPress={buscarDistancia}
            disabled={buscando}
          >
            {buscando ? (
              <ActivityIndicator color={cores.primaria} />
            ) : (
              <Text style={styles.textoSecundario}>Calcular distância</Text>
            )}
          </Pressable>

          <Campo
            titulo="Distância até o cliente"
            unidade="km"
            valor={km}
            aoMudar={setKm}
            placeholder="Preenchida pelo endereço"
            dica="Só a ida. Se preferir, digite a distância."
          />
          <Campo
            titulo="Preço da gasolina"
            unidade="R$/L"
            valor={gasolina}
            aoMudar={setGasolina}
            placeholder="Ex: 6,20"
          />
          <Campo
            titulo="Volume da piscina"
            unidade="litros"
            valor={volume}
            aoMudar={setVolume}
            placeholder="Ex: 10000"
          />

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          <Pressable
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
            onPress={calcular}
          >
            <Text style={styles.textoBotao}>Calcular orçamento</Text>
          </Pressable>
        </View>

        {resultado !== null && (
          <View style={styles.resultadoCartao}>
            {cliente.trim() !== '' && (
              <Text style={styles.resultadoRotulo}>Cliente: {cliente.trim()}</Text>
            )}
            <Text style={styles.resultadoRotulo}>Valor a cobrar</Text>
            <Text style={styles.resultadoValor}>
              R$ {resultado.toFixed(2).replace('.', ',')}
            </Text>
            <Pressable onPress={limpar}>
              <Text style={styles.limpar}>Novo cálculo</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.rodape}>
          <Pressable
            style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoPressionado]}
            onPress={() => navigation.navigate('Historico')}
          >
            <Text style={styles.textoContorno}>Ver histórico</Text>
          </Pressable>
          <Pressable onPress={() => route.params.funcLogar(false)}>
            <Text style={styles.sair}>Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 40 },

  cabecalho: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  emoji: { fontSize: 48 },
  tituloApp: { fontSize: 28, fontWeight: 'bold', color: cores.primariaEscura },
  subtitulo: { fontSize: 14, color: cores.cinza, marginTop: 4 },

  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  campo: { marginBottom: 14 },
  titulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: 6 },
  linhaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: 10,
    backgroundColor: cores.fundo,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 17, color: cores.texto },
  unidade: { fontSize: 14, color: cores.cinza, marginLeft: 8 },
  dica: { fontSize: 12, color: cores.cinza, marginTop: 4 },

  erro: { color: cores.erro, marginBottom: 10, textAlign: 'center' },

  botao: {
    backgroundColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoPressionado: { opacity: 0.75 },
  textoBotao: { color: cores.branco, fontSize: 18, fontWeight: 'bold' },

  botaoSecundario: {
    borderWidth: 2,
    borderColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: cores.clara,
  },
  textoSecundario: { color: cores.primariaEscura, fontSize: 16, fontWeight: '600' },

  resultadoCartao: {
    backgroundColor: cores.primariaEscura,
    borderRadius: 16,
    padding: 22,
    marginTop: 20,
    alignItems: 'center',
  },
  resultadoRotulo: { color: cores.clara, fontSize: 14 },
  resultadoValor: { color: cores.branco, fontSize: 38, fontWeight: 'bold', marginVertical: 6 },
  limpar: { color: cores.clara, textDecorationLine: 'underline', marginTop: 4 },

  rodape: { marginTop: 24, alignItems: 'center', gap: 16 },
  botaoContorno: {
    borderWidth: 2,
    borderColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  textoContorno: { color: cores.primaria, fontSize: 16, fontWeight: '600' },
  sair: { color: cores.cinza, fontSize: 15 },
});
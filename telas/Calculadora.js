import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Vibration,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { calcularPreco } from '../calculo';
import { cores } from '../tema';

// Campo de texto com título e unidade (km, R$/L, L)
function Campo({ titulo, unidade, valor, aoMudar, placeholder }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={styles.linhaInput}>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={aoMudar}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.unidade}>{unidade}</Text>
      </View>
    </View>
  );
}

export default function Calculadora({ navigation, route }) {
  const [km, setKm] = useState('');
  const [gasolina, setGasolina] = useState('');
  const [volume, setVolume] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const scrollRef = useRef(null);

  // Aceita vírgula ou ponto (ex: 5,89 ou 5.89)
  const paraNumero = (texto) => parseFloat(texto.replace(',', '.'));

  const calcular = () => {
    const kmNum = paraNumero(km);
    const gasolinaNum = paraNumero(gasolina);
    const volumeNum = paraNumero(volume);

    if (isNaN(kmNum) || isNaN(gasolinaNum) || isNaN(volumeNum)) {
      setErro('Preencha os três campos com números.');
      setResultado(null);
      return;
    }

    setErro('');
    setResultado(calcularPreco(kmNum, gasolinaNum, volumeNum));
    Vibration.vibrate(300); // recurso do celular
    Keyboard.dismiss(); // fecha o teclado para mostrar o resultado
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const limpar = () => {
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
            titulo="Distância até o cliente"
            unidade="km"
            valor={km}
            aoMudar={setKm}
            placeholder="Ex: 12"
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
            <Text style={styles.textoBotao}>Calcular</Text>
          </Pressable>
        </View>

        {resultado !== null && (
          <View style={styles.resultadoCartao}>
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
  input: { flex: 1, paddingVertical: 12, fontSize: 18, color: cores.texto },
  unidade: { fontSize: 14, color: cores.cinza, marginLeft: 8 },

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
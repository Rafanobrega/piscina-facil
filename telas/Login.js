import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { cores } from '../tema';

export default function Login({ navigation, route }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const logar = async () => {
    if (usuario.trim() === '' || senha === '') {
      setErro('Digite usuário e senha.');
      return;
    }

    try {
      const salvo = await AsyncStorage.getItem('usuario:' + usuario.trim());

      if (salvo === null) {
        setErro('Usuário não encontrado.');
        return;
      }

      // Gera o hash da senha digitada e compara com o hash salvo
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        senha
      );

      if (hash === salvo) {
        setErro('');
        await AsyncStorage.setItem('usuarioLogado', usuario.trim());
        route.params.funcLogar(true);
      } else {
        setErro('Senha incorreta.');
      }
    } catch (e) {
      setErro('Erro ao entrar: ' + e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.cabecalho}>
          <Text style={styles.emoji}>🏊</Text>
          <Text style={styles.tituloApp}>Piscina Fácil</Text>
          <Text style={styles.subtitulo}>Entre para calcular seus orçamentos</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.rotulo}>Usuário</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Seu usuário"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.rotulo}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Sua senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          <Pressable
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
            onPress={logar}
          >
            <Text style={styles.textoBotao}>Entrar</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Registrar')}>
          <Text style={styles.link}>Não tem conta? Registre-se</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 40, flexGrow: 1, justifyContent: 'center' },

  cabecalho: { alignItems: 'center', marginBottom: 20 },
  emoji: { fontSize: 56 },
  tituloApp: { fontSize: 30, fontWeight: 'bold', color: cores.primariaEscura },
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
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: 10,
    backgroundColor: cores.fundo,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: cores.texto,
    marginBottom: 14,
  },
  erro: { color: cores.erro, marginBottom: 10, textAlign: 'center' },

  botao: {
    backgroundColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  pressionado: { opacity: 0.75 },
  textoBotao: { color: cores.branco, fontSize: 18, fontWeight: 'bold' },

  link: { color: cores.primaria, textAlign: 'center', marginTop: 20, fontSize: 15 },
});
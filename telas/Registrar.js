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

export default function Registrar({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');

  const registrar = async () => {
    const nome = usuario.trim();

    if (nome === '' || senha === '' || confirmar === '') {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não são iguais.');
      return;
    }

    try {
      const chave = 'usuario:' + nome;

      // Não deixa cadastrar um usuário que já existe
      const existente = await AsyncStorage.getItem(chave);
      if (existente !== null) {
        setErro('Esse usuário já existe.');
        return;
      }

      // Criptografa a senha (SHA-256). Só o hash é salvo, nunca a senha.
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        senha
      );

      await AsyncStorage.setItem(chave, hash);
      setErro('');
      alert('Conta criada! Agora faça o login.');
      navigation.goBack();
    } catch (e) {
      setErro('Erro ao registrar: ' + e);
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
          <Text style={styles.tituloApp}>Criar conta</Text>
          <Text style={styles.subtitulo}>Cadastre-se para usar o Piscina Fácil</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.rotulo}>Usuário</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Escolha um nome de usuário"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.rotulo}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite uma senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />

          <Text style={styles.rotulo}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="Repita a senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          <Pressable
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
            onPress={registrar}
          >
            <Text style={styles.textoBotao}>Criar conta</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Já tenho conta</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 40, flexGrow: 1, justifyContent: 'center' },

  cabecalho: { alignItems: 'center', marginBottom: 20 },
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
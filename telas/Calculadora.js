import { View, Text, Button } from 'react-native';

export default function Calculadora({ navigation, route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Tela da Calculadora</Text>
      <Button title="Ver histórico" onPress={() => navigation.navigate('Historico')} />
      <Button title="Deslogar" onPress={() => route.params.funcLogar(false)} />
    </View>
  );
}
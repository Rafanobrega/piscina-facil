import { View, Text, Button } from 'react-native';

export default function Login({ navigation, route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Tela de Login</Text>
      <Button title="Logar (teste)" onPress={() => route.params.funcLogar(true)} />
      <Button title="Registrar" onPress={() => navigation.navigate('Registrar')} />
    </View>
  );
}
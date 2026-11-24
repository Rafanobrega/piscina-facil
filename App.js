import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './telas/Login';
import Registrar from './telas/Registrar';
import Calculadora from './telas/Calculadora';
import Historico from './telas/Historico';

const Stack = createNativeStackNavigator();

export default function App() {
  const [estaLogado, setLogado] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {estaLogado ? (
          <>
            <Stack.Screen
              name="Calculadora"
              component={Calculadora}
              initialParams={{ funcLogar: setLogado }}
            />
            <Stack.Screen
              name="Historico"
              component={Historico}
              options={{ title: 'Histórico' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              initialParams={{ funcLogar: setLogado }}
            />
            <Stack.Screen name="Registrar" component={Registrar} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
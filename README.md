# Piscina Fácil

Aplicativo para o piscineiro calcular **quanto cobrar** pela limpeza da piscina do cliente, com base na distância até a casa do cliente, no preço da gasolina e no volume da piscina.

**Integrantes:** NOME DA PESSOA A e NOME DA PESSOA B

## Funcionalidades

- Cadastro e login de usuário, com a senha criptografada (SHA-256).
- Cálculo do orçamento a partir do endereço do cliente: o app descobre a distância pela rua.
- Vibração do celular ao calcular.
- Histórico de orçamentos, salvo no Supabase e listado em uma FlatList.

## Requisitos do trabalho

| Requisito | Onde está |
|---|---|
| Recurso do celular | Vibração ao calcular (`Vibration`), em `telas/Calculadora.js` |
| FlatList | Histórico de orçamentos, em `telas/Historico.js` |
| Login com criptografia | `telas/Login.js` e `telas/Registrar.js` (SHA-256, `expo-crypto`) |
| Persistência de dados | Supabase (orçamentos) e AsyncStorage (usuários) |
| Git | Branches e pull requests aprovados pelo outro integrante |
| Mínimo de 3 telas | Login, Registrar, Calculadora e Histórico |
| Testes automatizados | Jest: `calculo.test.js` e `distancia.test.js` |

## Como o preço é calculado

```
deslocamento = (km x 2 / consumo) x gasolina x desgaste
serviço      = mão de obra + (litros / 1000) x produtos por mil litros
preço        = (deslocamento + serviço) x (1 + margem)   [nunca abaixo do mínimo]
```

Os valores padrão (consumo, desgaste, mão de obra, produtos, margem e mínimo) ficam no início do arquivo `calculo.js` e devem ser ajustados para os custos reais do piscineiro.

## Como a distância é calculada

O endereço do cliente vira coordenadas pelo **Nominatim** (OpenStreetMap), e a distância de carro entre os dois pontos vem do **OSRM**. Nos testes, o resultado ficou entre 4% e 11% abaixo do Google Maps, por escolher rotas diferentes. O campo de km pode ser editado à mão.

## Como rodar

1. Instale o Node.js e o app **Expo Go** no celular.
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env` na raiz, copiando o `.env.example`, com a URL e a chave pública do projeto no Supabase.
4. Inicie o app e escaneie o QR Code com o Expo Go:
   ```
   npx expo start -c
   ```

Observação: o Expo Go pede uma conta gratuita do Expo (`npx expo login`).

## Banco de dados (Supabase)

Tabela `orcamentos` com `usuario`, `cliente`, `endereco`, `km`, `gasolina`, `volume_litros`, `valor` e `criado_em`.

## Testes

```
npm test
```

## Limitações

- A distância depende de serviços públicos gratuitos, que podem ficar fora do ar.
- O histórico precisa de internet.
- O login guarda os usuários no próprio aparelho.
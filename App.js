import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ItemList from './components/ItemList';

export default function App() {

  const uri = "https://api.magicthegathering.io/v1/cards";
  // Guarda a resposta da API
  const [response, setResponse] = useState(null);
  // Armazena as cartas exibidas
  const [cards, setCards] = useState([]);
  // Indica se os dados estão carregando
  const [isLoading, setLoading] = useState(false);
  // Mostra mensagens de erro, se necessário
  const [message, setMessage] = useState(null);
  // Controle da página atual da API para paginação
  const [page, setPage] = useState(0);
  // Estado que indica se está ocorrendo uma atualização ("pull-to-refresh")
  const [isRefreshing, setRefreshing] = useState(false);

  // Incrementa de 1 em 1 página
  // Busca de 10 em 10 cartas por página na API
  // Atualiza o estado response com os dados da API
  const fetchItens = () => {
    const nextPage = page + 1;
    fetch(`${uri}?pageSize=10&page=${nextPage}`)
      .then(resp => resp.json())
      .then(data => {
        setResponse(data);
        setPage(nextPage);
      })
      .catch(error => setMessage(error.message))
      .finally(_ => setLoading(false));
  }

  // Função para atualizar os dados "pull-to-refresh". gesto de arrastar para baixo carregando 10 itens por vez
  const onRefresh = () => {
    setRefreshing(true);
    setCards([]);
    fetch(`${uri}?pageSize=10`)
      .then(resp => resp.json())
      .then(data => {
        setResponse(data);
        setPage(1);
      })
      .catch(error => setMessage(error.message))
      .finally(_ => setRefreshing(false));
  }

  // Carrega os dados iniciais quando o componente é montado.
  useEffect(() => {
    setLoading(true);
    fetchItens();
  }, []);

  // Adicioan novas cartas quando o state response mudar. Response muda quando o usuario rola o scroll
  useEffect(() => {
    if (response?.cards){
      setCards(cards.concat(response.cards));
    }
  }, [response]);
  // SEMELHANTE AO ITEM ACIMA
  // const cards = useMemo(() => {
  //   if (response?.cards) {
  //     return response.cards;
  //   } else return [];
  // }, [response]);
  return (
    <View style={styles.container}>
      <FlatList
        data={cards} // Lista de cartas
        renderItem={({ item }) => (<ItemList key={item.id} card={item} />)} // Componente para exibir cada carta
        onEndReached={fetchItens}   // Dispara fetchItens quando o usuário rola até o final.
        onRefresh={onRefresh}       // Habilitam o recurso de "pull-to-refresh"
        refreshing={isRefreshing}   // Habilitam o recurso de "pull-to-refresh"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
    marginLeft: 10,
  },
});
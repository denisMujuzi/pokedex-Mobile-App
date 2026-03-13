import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

interface Pokemon {
  name: string;
  image: string;
}

export default function Index() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch pokemon data from pokeapi
    fetchPokemonData();
  }, []);

  async function fetchPokemonData() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const data = await response.json();

      const detailedPokemon = await Promise.all(
        data.results.map(async (poke: any) => {
          const res = await fetch(poke.url);
          const details = await res.json();
          return {
            name: poke.name,
            image: details.sprites.front_default,
          };
        })
      );
      setPokemon(detailedPokemon);

    } catch (error) {
      console.error("Error fetching pokemon data:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPokemon = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Pokemon..."
        placeholderTextColor="#121212"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView 
        style={{ padding: 20 }}
        contentContainerStyle={styles.container}
      >
        
        {filteredPokemon.map((poke) => (
        <Link href={{ pathname: "/details", params: { name: poke.name } }} key={poke.name}>
          <View style={styles.pokemonItem}>
            <Text>{poke.name}</Text>
            <Image source={{ uri: poke.image }} style={{ width: 100, height: 100 }} />
          </View>
        </Link>

      ))}
    </ScrollView>
    </View>
  );
}


// stylesheet
const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
  },
  pokemonItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

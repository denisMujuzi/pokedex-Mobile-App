import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface PokemonDetails {
  name: string;
  id: number;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string } }[];
}

export default function Details() {
  const params = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.name) {
      fetchPokemonDetails(params.name as string);
    }
  }, [params.name]);

  async function fetchPokemonDetails(name: string) {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pokemon not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, "0")}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default }}
          style={styles.image}
        />
      </View>

      <View style={styles.typesContainer}>
        {pokemon.types.map((typeInfo) => (
          <View key={typeInfo.type.name} style={styles.typeTag}>
            <Text style={styles.typeText}>{typeInfo.type.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical Attributes</Text>
        <View style={styles.attributesContainer}>
          <View style={styles.attribute}>
            <Text style={styles.attributeLabel}>Height</Text>
            <Text style={styles.attributeValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
          </View>
          <View style={styles.attribute}>
            <Text style={styles.attributeLabel}>Weight</Text>
            <Text style={styles.attributeValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.abilitiesContainer}>
          {pokemon.abilities.map((abilityInfo) => (
            <Text key={abilityInfo.ability.name} style={styles.ability}>
              • {abilityInfo.ability.name.replace("-", " ")}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Base Stats</Text>
        {pokemon.stats.map((statInfo) => (
          <View key={statInfo.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>
              {statInfo.stat.name.replace("-", " ").toUpperCase()}
            </Text>
            <View style={styles.statBarContainer}>
              <View 
                style={[
                  styles.statBar, 
                  { width: `${Math.min((statInfo.base_stat / 255) * 100, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.statValue}>{statInfo.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#999",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  id: {
    fontSize: 18,
    color: "#666",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 250,
    height: 250,
  },
  typesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  typeTag: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  attributesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  attribute: {
    alignItems: "center",
  },
  attributeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  attributeValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  abilitiesContainer: {
    gap: 8,
  },
  ability: {
    fontSize: 16,
    textTransform: "capitalize",
    paddingVertical: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  statName: {
    fontSize: 12,
    width: 100,
    fontWeight: "600",
  },
  statBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    width: 40,
    textAlign: "right",
  },
});
export interface Pokemon {
  id: number;
  url: string;
  name: string;
  image: string;
  abilitiesNames: string[];
}

export interface Pokemons {
  count: number,
  pokemons: Pokemon[]
}

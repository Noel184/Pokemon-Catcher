import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  //declare variables for inject and api url

  private http= inject(HttpClient);
  private apiUrl= 'http://localhost:3000/api/pokemon'

  //reactive state management for the data list

  pokemonList= signal<any[]>([])
  //get request for the data
  fetchPokemon(){
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.pokemonList.set(data));
  }
  //post request to save data
  savePokemon(data:any){
    return this.http.post(this.apiUrl, data);
  }
}

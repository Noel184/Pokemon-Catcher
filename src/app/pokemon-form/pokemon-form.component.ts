import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { FormBuilder,ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-pokemon-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pokemon-form.component.html',
  styleUrl: './pokemon-form.component.css'
})
export class PokemonFormComponent implements OnInit {
pokemonService = inject(PokemonService);
private formBuilder = inject(FormBuilder);

pokemonForm= this.formBuilder.nonNullable.group({
  name:['', Validators.required],
  type:['', Validators.required],
  level:['', Validators.required, Validators.min(1)],
  nature:['', Validators.required],
})
ngOnInit(){
  //fetch data when component is loaded
  this.pokemonService.fetchPokemon();
}
onSubmit(){
  //declare variable for the form
  const data= this.pokemonForm.getRawValue();
  if(this.pokemonForm.invalid)return;

  this.pokemonService.savePokemon(data).subscribe({
    next: ()=> {
      this.pokemonService.fetchPokemon();
      this.pokemonForm.reset();
    }
  })
}
}

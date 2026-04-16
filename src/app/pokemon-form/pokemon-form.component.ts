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
editingId = signal<string | null>(null);

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
deletePokemon(id: string){
  if(confirm("Are you sure you want to release this Pokemon?")){
    this.pokemonService.deletePokemon(id);
  }
  this.pokemonService.fetchPokemon();
}

startEdit(pokemon: any){
  this.editingId.set(pokemon._id);
  this.pokemonForm.patchValue(pokemon);
  //populating our pokemon form automatically using patch values
}

cancelEdit(){
  this.editingId.set(null);
  this.pokemonForm.reset();
}

onSubmit(){
  if(this.pokemonForm.invalid) return;

  const data= this.pokemonForm.getRawValue();
  const id = this.editingId();

  if(id){
    this.pokemonService.updatePokemon(id, data).subscribe({
      next: () =>{
        this.pokemonService.fetchPokemon();
        this.cancelEdit();
      },
      error: (err) => console.error('Update Failed', err)
    });
  } else {
    this.pokemonService.savePokemon(data).subscribe({
      next: () => {
        this.pokemonService.fetchPokemon();
        this.pokemonForm.reset();
      },
      error: (err) => console.error('Save failed', err)
    });
  }
}
}

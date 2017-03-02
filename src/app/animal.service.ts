import { Injectable } from '@angular/core';
import { Headers, Http }	from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Animal } from './animal';

@Injectable()
export class AnimalService {
	private headers = new Headers({'Content-Type': 'application/json'});
	private animalsUrl = 'api/animals';

	constructor(private http: Http) { }

	getAnimals(): Promise<Animal[]> {
	    return this.http.get(this.animalsUrl)
		.toPromise()
		.then(response => response.json().data as Animal[])
		.catch(this.handleError);
	}

	getAnimalsSlowly(): Promise<Animal[]> {
	  return new Promise(resolve => {
		// Simulate server latency with 2 second delay
		setTimeout(() => resolve(this.getAnimals()), 2000);
	    });
	}

	getAnimal(id: number): Promise<Animal> {
		const url = `${this.animalsUrl}/${id}`;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json().data as Animal)
			.catch(this.handleError);
	}

	update(animal: Animal): Promise<Animal> {
		const url = `${this.animalsUrl}/${animal.id}`;
		return this.http
			.put(url, JSON.stringify(animal), {headers: this.headers})
			.toPromise()
			.then( () => animal)
			.catch(this.handleError);
	}

	create(name: string): Promise<Animal> {
		return this.http
			.post(this.animalsUrl, JSON.stringify({name: name}), {headers: this.headers})
			.toPromise()
			.then(res => res.json().data)
			.catch(this.handleError);
	}

	delete(id: string): Promise<void> {
		const url = `${this.animalsUrl}/${id}`;
		return this.http.delete(url, {headers: this.headers})
			.toPromise()
			.then( () => null)
			.catch(this.handleError);
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}

}
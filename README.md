# Gotta Code 'Em All!

Build a web application that uses the Pokemon API to display a list of Pokemon and their details. The application should have two pages: a list of Pokemon and a detail page for each individual Pokemon. The detail page should also display the selected Pokemon's evolutions, if any.

## API Documentation

- [Pokemon API Documentation](https://pokeapi.co/docs/v2)
- Endpoint for Pokemon List: `https://pokeapi.co/api/v2/pokemon`
- Endpoint for Pokemon Details: `https://pokeapi.co/api/v2/pokemon/{id or name}/`
- Endpoint for Pokemon Evolution Chain: `https://pokeapi.co/api/v2/evolution-chain/{id}/`

## Technical Requirements

- Use any TypeScript framework (Angular, Vue, React, as long as it is TypeScript).

## Acceptance Criteria

- A list of 10 Pokemon should be displayed on the list page, including their names and images.
- Users should be able to navigate in the list using next and previous buttons to get 10 new Pokemon.
- Clicking on a Pokemon in the list should navigate to the detail page, which should display the Pokemon's name, image, abilities (names), and evolutions (if any).
- If the selected Pokemon has evolutions, they should be displayed as a list with their images and names. Clicking on an evolution should navigate to its detail page.
- Users should be able to navigate between the list and detail pages using the browser's back and forward buttons.
- Users should be able to bookmark their favorite Pokemon's details page.

## Tests

- Implement tests for bullet points 1 and 2 in the acceptance criteria.

You don't have to spend too much time on styling if you're limited on time. Just focus on building an application that will make even Pikachu proud.


## When Finished
You have been invited as an outside collaborator in this repository. 
Please send the code test to us by:
* Create a new branch in this repository
* Create a pull request from that branch to the main branch
# NgProjectCroceRossa

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8.

## Development server

After cloning or pulling the repository, install the locked dependencies first:

```bash
npm ci
```

To start the Admin application, run:

```bash
npm start
```

Open `http://localhost:4200/`. The application automatically reloads when source files change.

To start the beneficiary/User flow on its dedicated local server, run:

```bash
npm run start:user
```

Then open `http://localhost:4300/home`.

## Code scaffolding

Angular CLI includes powerful schematics. To generate a component, run:

```bash
npx ng generate component component-name
```

For a complete list of available schematics:

```bash
npx ng generate --help
```

## Building

To build the Admin application, run:

```bash
npm run build
```

To build the User application separately, run:

```bash
npx ng build --configuration user
```

Build artifacts are stored in the `dist/` directory.

## Running unit tests

To execute the Vitest test runner:

```bash
npm test -- --watch=false
```

## Additional resources

For more information, see the [Angular CLI documentation](https://angular.dev/tools/cli).

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
      apiKey: 'AIzaSyAKGFltr_tyAPG3HaxCfS6vNsG-1PrI-SM',
      authDomain: 'spending-list-7cd09.firebaseapp.com',
      databaseURL: 'https://spending-list-7cd09.firebaseio.com',
      projectId: 'spending-list-7cd09',
      storageBucket: 'spending-list-7cd09.appspot.com',
      messagingSenderId: '546196364987'
  }
};

# typescript project

## Docker

- Create vite config in /home/wreiner/tmp/typescript_project/dist/vite.config.js

  ```
  import { defineConfig } from 'vite'
  import dns from 'dns'

  dns.setDefaultResultOrder('verbatim')

  export default defineConfig({
      server: {
          host: '0.0.0.0'
        },
  })
  ```

- Run container

  ```
  docker run --rm --name webengtsp -p5173:5173 -v /home/wreiner/tmp/typescript_project:/work -it --entrypoint bash node
  ```

- Inside container

  ```
  cd /work
  npm install
  npm run watch
  ```
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default({mode})=>{
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    plugins: [react()],
    server: {
      port: mode === "production"  ? 4173 : 3000 ,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  })
};
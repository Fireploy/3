import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from 'vite';
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport  => {
  const env = loadEnv(mode, process.cwd());
  //console.log('VITE_BASE_PATH:', env.VITE_BASE_PATH);  // Verifica la carga
  //console.log('VITE_PORT:', env.VITE_PORT);  // Verifica la carga

  return defineConfig({
    base: `${env.VITE_BASE_PATH}`,
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT),
      host: true
    },
    preview: {
      port: parseInt(env.VITE_PORT),
      host: true,  // permite 0.0.0.0
    },
  });
};

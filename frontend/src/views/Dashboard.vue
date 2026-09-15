<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerPerfil } from '@/services/authService';

const profesor = ref(null);
const error = ref('');
const cargando = ref(true);
const router = useRouter();

onMounted(async () => {
  try {
    const { data } = await obtenerPerfil();
    profesor.value = data;
  } catch (e) {
    error.value = 'No se pudo cargar tu perfil. Vuelve a iniciar sesión.';
  } finally {
    cargando.value = false;
  }
});

function cerrarSesion() {
  localStorage.removeItem('token');
  router.push('/login');
}
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard del profesor</h1>

    <p v-if="cargando">Cargando...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else-if="profesor" class="perfil">
      <p><strong>Nombre:</strong> {{ profesor.nombre }}</p>
      <p><strong>Correo:</strong> {{ profesor.correo }}</p>
      <p><strong>Área:</strong> {{ profesor.area }}</p>
    </div>

    <button @click="cerrarSesion">Cerrar sesión</button>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 420px;
  margin: 60px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: sans-serif;
}
.perfil p {
  margin: 8px 0;
}
.error {
  color: #b91c1c;
}
button {
  margin-top: 20px;
  padding: 10px 16px;
  cursor: pointer;
}
</style>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { iniciarSesion } from '@/services/authService';

const correo = ref('');
const contrasena = ref('');
const error = ref('');
const cargando = ref(false);
const router = useRouter();

function correoValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

async function enviar() {
  error.value = '';

  if (!correo.value || !contrasena.value) {
    error.value = 'Todos los campos son obligatorios';
    return;
  }
  if (!correoValido(correo.value)) {
    error.value = 'El correo no tiene un formato válido';
    return;
  }

  cargando.value = true;
  try {
    const { data } = await iniciarSesion({
      correo: correo.value,
      contrasena: contrasena.value,
    });
    localStorage.setItem('token', data.token);
    router.push('/dashboard');
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'Error al iniciar sesión';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="auth-form">
    <h1>Iniciar sesión</h1>

    <form @submit.prevent="enviar">
      <label>
        Correo institucional
        <input v-model="correo" type="email" placeholder="profesor@institucion.edu.co" />
      </label>

      <label>
        Contraseña
        <input v-model="contrasena" type="password" />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Ingresando...' : 'Iniciar sesión' }}
      </button>
    </form>

    <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
  </div>
</template>

<style scoped>
.auth-form {
  max-width: 360px;
  margin: 60px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: sans-serif;
}
label {
  display: block;
  margin-bottom: 14px;
  font-size: 14px;
}
input {
  display: block;
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  box-sizing: border-box;
}
.error {
  color: #b91c1c;
  font-size: 13px;
}
button {
  width: 100%;
  padding: 10px;
  cursor: pointer;
}
</style>
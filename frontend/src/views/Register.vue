<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registrar } from '@/services/authService';

const nombre = ref('');
const correo = ref('');
const contrasena = ref('');
const area = ref('');
const error = ref('');
const cargando = ref(false);
const router = useRouter();

function correoValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

async function enviar() {
  error.value = '';

  if (!nombre.value || !correo.value || !contrasena.value || !area.value) {
    error.value = 'Todos los campos son obligatorios';
    return;
  }
  if (!correoValido(correo.value)) {
    error.value = 'El correo no tiene un formato válido';
    return;
  }
  if (contrasena.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  cargando.value = true;
  try {
    await registrar({
      nombre: nombre.value,
      correo: correo.value,
      contrasena: contrasena.value,
      area: area.value,
    });
    router.push('/login');
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'Error al registrar';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="auth-form">
    <h1>Registrar profesor</h1>

    <form @submit.prevent="enviar">
      <label>
        Nombre
        <input v-model="nombre" type="text" />
      </label>

      <label>
        Correo institucional
        <input v-model="correo" type="email" placeholder="profesor@institucion.edu.co" />
      </label>

      <label>
        Contraseña
        <input v-model="contrasena" type="password" />
      </label>

      <label>
        Área o departamento
        <input v-model="area" type="text" />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Registrando...' : 'Registrar profesor' }}
      </button>
    </form>

    <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
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
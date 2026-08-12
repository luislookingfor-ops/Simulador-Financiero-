<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-container">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1>INGELAB</h1>
        <p>Sistema Simulador Financiero & Planificación</p>
      </div>

      <form @submit.prevent="submit" class="login-form">
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              required 
              placeholder="Ingrese su usuario"
              autocomplete="username"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              required 
              placeholder="Ingrese su contraseña"
              autocomplete="current-password"
            />
          </div>
        </div>

        <div v-if="errors && errors.username" class="error-message">
          {{ errors.username }}
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          <span v-if="loading">Iniciando sesión...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.$inertia) {
        this.$inertia.post('/login', this.form, {
          onFinish: () => {
            this.loading = false;
          }
        });
      } else if (window.hasOwnProperty('Inertia')) {
        window.Inertia.post('/login', this.form, {
          onFinish: () => {
            this.loading = false;
          }
        });
      } else {
        // Fallback for mock environment
        fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Inertia': 'true'
          },
          body: JSON.stringify(this.form)
        }).then(res => {
          this.loading = false;
          if (res.ok) {
            window.location.href = '/';
          } else {
            alert('Credenciales incorrectas');
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 40px 32px;
  box-sizing: border-box;
  text-align: center;
}

.login-header {
  margin-bottom: 32px;
}

.logo-container {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 16px auto;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.login-header h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: 0.05em;
}

.login-header p {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: #64748b;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 42px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.error-message {
  font-size: 0.8rem;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  padding: 10px 12px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

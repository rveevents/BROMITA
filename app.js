// Importar funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDT0-CpcZjea5H7H1MuDziCIZZR61Tv_Bk",
    authDomain: "autenticator-c20cf.firebaseapp.com",
    projectId: "autenticator-c20cf",
    storageBucket: "autenticator-c20cf.firebasestorage.app",
    messagingSenderId: "142199461841",
    appId: "1:142199461841:web:d7b67a06bc130eaf7db2f0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Variables de elementos DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

// Cambiar entre formularios
if (showRegister) {
    showRegister.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
}

if (showLogin) {
    showLogin.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
}

// Función de Login
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const messageDiv = document.getElementById('login-message');

        if (!email || !password) {
            showMessage(messageDiv, 'Por favor completa todos los campos', 'error');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showMessage(messageDiv, '¡Inicio de sesión exitoso!', 'success');
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 1000);
            })
            .catch((error) => {
                let errorMessage = 'Error al iniciar sesión';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'Usuario no encontrado';
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Contraseña incorrecta';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email inválido';
                }
                showMessage(messageDiv, errorMessage, 'error');
            });
    });
}

// Función de Registro
const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        const messageDiv = document.getElementById('register-message');

        if (!email || !password || !confirmPassword) {
            showMessage(messageDiv, 'Por favor completa todos los campos', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage(messageDiv, 'Las contraseñas no coinciden', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage(messageDiv, 'La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showMessage(messageDiv, '¡Cuenta creada exitosamente! Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 1500);
            })
            .catch((error) => {
                let errorMessage = 'Error al crear la cuenta';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'Este email ya está registrado';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email inválido';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Contraseña muy débil';
                }
                showMessage(messageDiv, errorMessage, 'error');
            });
    });
}

// Función para mostrar mensajes
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

// Verificar estado de autenticación en welcome.html
onAuthStateChanged(auth, (user) => {
    if (window.location.pathname.includes('welcome.html')) {
        if (user) {
            const userEmail = document.getElementById('user-email');
            if (userEmail) {
                userEmail.textContent = `Usuario: ${user.email}`;
            }
        } else {
            window.location.href = 'index.html';
        }
    }
});

// Función de Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
    });
}

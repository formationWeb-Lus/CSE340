// main.js
document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');

  // Vérifie que les éléments existent
  if (!togglePassword || !passwordField) return;

  togglePassword.addEventListener('click', () => {
    // Change le type du champ password
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Change le texte du bouton
    togglePassword.textContent = type === 'password' ? 'Show Password' : 'Hide Password';
  });
});

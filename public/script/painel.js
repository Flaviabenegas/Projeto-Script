const login = document.getElementById('btn-login');
const senha = document.getElementById('senha');
const emailform = document.getElementById('email') || document.getElementById('email-login');
const textoErro = document.getElementById('modalText');
const painelLogin = document.getElementById('loginPainel');
const loader = document.getElementById('loader'); 

if (login && emailform && senha) {
    
    const modalEmailErroEl = document.getElementById('modalEmailErro');
    const modalSucessoPainelEl = document.getElementById('modalSucessoPainel');
    
    const modalEmailErro = modalEmailErroEl ? new bootstrap.Modal(modalEmailErroEl) : null;
    const modalSucessoPainel = modalSucessoPainelEl ? new bootstrap.Modal(modalSucessoPainelEl) : null;

    login.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (emailform.value.trim() === "teste@teste" && senha.value === "teste") {
            login.disabled = true;
            login.innerText = "Aguarde...";
            
            if (loader) {
                loader.classList.remove('d-none');
                setTimeout(() => {
                    loader.classList.remove('opacity-0');
                    loader.classList.add('opacity-100');
                }, 10);
            }
            
           
            setTimeout(() => {
                if (loader) {
                    loader.classList.add('d-none');
                }
                
                if (modalSucessoPainel) {
                    modalSucessoPainel.show(); 
                }
                if (painelLogin) painelLogin.reset();
                
                
                setTimeout(() => {
                    window.location.href = '/painel'; 
                }, 2000); 

            }, 2000); 

        } else {
            if (textoErro) textoErro.innerText = "Email ou senha incorretos. Por favor, tente novamente.";
            if (modalEmailErro) modalEmailErro.show();
        }
    });
}
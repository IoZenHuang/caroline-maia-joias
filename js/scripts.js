/**
 * CAROLINE MAIA SEMIJOIAS - SCRIPTS E INTERAÇÕES DINÂMICAS (CRO FOCUS)
 */

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. ANO ATUAL NO RODAPÉ
    const anoSpan = document.getElementById('anoAtual');
    if (anoSpan) {
        anoSpan.textContent = new Date().getFullYear();
    }

    // 2. NAV BAR DINÂMICA AO ROLAR (GLASSMORPHISM)
    const navbar = document.querySelector('.navbar');
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    // Trigger on scroll and on load (in case page is loaded mid-scroll)
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // 3. ANIMAÇÕES DE ENTRADA SUAVE (INTERSECTION OBSERVER)
    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    
    if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once animated, stop observing this element
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px' // Trig slightly before they reach view
        });

        fadeElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // 4. MÁSCARA AUTOMÁTICA DE WHATSAPP (TELEFONE)
    const telInput = document.getElementById('telefone');
    if (telInput) {
        telInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // 5. TRATAMENTO DO FORMULÁRIO DO CLUBE VIP (CRO LEADS)
    const form = document.getElementById('formCadastro');
    const mensagemDiv = document.getElementById('cadastroMensagem');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
            } else {
                form.classList.remove('was-validated');
                
                // Envio assíncrono do formulário (via FormSubmit para o e-mail configurado)
                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                const ajaxAction = form.action.includes('formsubmit.co') 
                    ? form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/')
                    : form.action;

                fetch(ajaxAction, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                })
                .then(response => response.json())
                .then(data => console.log('Formulário enviado:', data))
                .catch(error => console.error('Erro no envio do formulário:', error));
                
                // Feedback premium para o cliente
                const nomeCliente = document.getElementById('nome').value.split(' ')[0]; // Pega primeiro nome
                
                if (mensagemDiv) {
                    mensagemDiv.classList.remove('d-none');
                    mensagemDiv.className = 'mt-4 text-center alert alert-success py-3';
                    mensagemDiv.innerHTML = `
                        <i class="bi bi-patch-check-fill fs-4 d-block mb-2"></i>
                        <strong>Parabéns, ${nomeCliente}!</strong><br>
                        Seu cupom de 10% OFF <strong>BEMVINDA10</strong> foi gerado e enviado para seu e-mail!
                    `;
                    
                    // Rolar suavemente para a mensagem
                    mensagemDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                // Reset do formulário
                form.reset();
            }
        });
    }

    // 6. ENVIAR PARA O WHATSAPP COM CONTEXTO DO PRODUTO (COMPRA RÁPIDA)
    const botoesProduto = document.querySelectorAll('.btn-product-buy');
    const whatsappBaseUrl = 'https://wa.me/5583988882535'; // Substituir pelo número real se necessário

    botoesProduto.forEach(botao => {
        botao.addEventListener('click', function () {
            const produtoNome = this.getAttribute('data-produto');
            const mensagem = `Olá! Estava navegando pelo site da Caroline Maia Semijoias e me apaixonei pelo produto: "${produtoNome}". Gostaria de saber mais informações e como posso realizar o pedido.`;
            const encodedText = encodeURIComponent(mensagem);
            const finalUrl = `${whatsappBaseUrl}?text=${encodedText}`;
            
            // Redireciona em nova aba
            window.open(finalUrl, '_blank', 'noopener');
        });
    });

    // 7. COMPENSAÇÃO DE CLIQUE EM LINKS INTERNOS (Foco no topo e rolagem suave)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Fecha o menu hamburguer no mobile após o clique
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }

                const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 70; // 70px de navbar offset
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
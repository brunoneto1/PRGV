export function carrosselImg() {
    document.addEventListener('DOMContentLoaded', function () {
        const images = document.querySelectorAll('#filme-background img');
        let index = 0;
    
        function showNextImage() {
            // Oculta todas as imagens
            images.forEach(img => img.style.opacity = 0);
    
            // Exibe a próxima imagem centralizada
            images[index].style.opacity = 1;
            images[index].style.transition = 'opacity 1s ease-in-out';
            images[index].style.margin = 'auto';
    
            // Incrementa o índice ou redefine para 0 se for a última imagem
            index = (index + 1) % images.length;
    
            // Chama recursivamente após 3 segundos
            setTimeout(showNextImage, 1000);
        }
    
        // Exibe a primeira imagem centralizada
        images[index].style.transition = 'opacity 1s ease-in-out';
        images[index].style.display = 'block';
        images[index].style.margin = 'auto';
    
        // Inicia o carrossel automático
        setTimeout(showNextImage, 1000);
    });
    
}
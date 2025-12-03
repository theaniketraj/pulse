import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  setup() {
    if (globalThis.window !== undefined) {
      // Add smooth mouse-following effect to hero logo
      globalThis.window.addEventListener('DOMContentLoaded', () => {
        const initLogoEffect = () => {
          const heroImage = document.querySelector('.VPHero .image-container, .VPHero .VPImage');
          if (!heroImage) return;

          let mouseX = 0, mouseY = 0;
          let currentX = 0, currentY = 0;
          let animationFrame: number;

          const updatePosition = () => {
            // Smooth interpolation - slower movement
            const ease = 0.08;
            currentX += (mouseX - currentX) * ease;
            currentY += (mouseY - currentY) * ease;

            // Apply transform with circular movement
            (heroImage as HTMLElement).style.transform = 
              `translate(${currentX}px, ${currentY}px) rotate(${currentX * 0.02}deg)`;

            animationFrame = requestAnimationFrame(updatePosition);
          };

          const handleMouseMove = (e: MouseEvent) => {
            const rect = heroImage.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from center with larger range
            const maxDistance = 35; // Increased movement area
            mouseX = ((e.clientX - centerX) / window.innerWidth) * maxDistance;
            mouseY = ((e.clientY - centerY) / window.innerHeight) * maxDistance;
          };

          const handleMouseLeave = () => {
            mouseX = 0;
            mouseY = 0;
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseleave', handleMouseLeave);
          
          updatePosition();

          // Cleanup
          return () => {
            cancelAnimationFrame(animationFrame);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
          };
        };

        // Initialize after a short delay to ensure DOM is ready
        setTimeout(initLogoEffect, 100);
      });
    }
  }
}

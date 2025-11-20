import { scenes } from "./scene.js";

const container = document.querySelector("[data-hero-scene]");
const scene = scenes[0];

function buildScene(container, scene) {
  // 1. IMAGE
  const img = document.createElement("img");
  img.src = scene.image;
  img.className = "hero-img";
  container.appendChild(img);

  // 2. PARTICLES (dots)
  if (scene.particles) {
    const particles = document.createElement("img");
    particles.src = scene.particles;
    particles.className = "hero-particles";
    container.appendChild(particles);
  }

  // 3. ORBITS 
  scene.orbits.forEach((orbit) => {
    const div = document.createElement("div");
    div.className = "orbit";
    div.style.width = orbit.radius * 2 + "px";
    div.style.height = orbit.radius * 2 + "px";
    div.style.transitionDelay = orbit.delay + "s";
    container.appendChild(div);
  });

  

    // figure out when the last orbit finishes
    const maxOrbitDelay = scene.orbits.reduce(
    (max, o) => Math.max(max, o.delay),
    0
  );
  const orbitAnimDuration = 0.5; // must match .orbit transition time in CSS
  const iconsBaseDelayMs = (maxOrbitDelay + orbitAnimDuration) * 1000; 
  // e.g. (2 + 0.5) * 1000 = 2500ms


  fetch(scene.iconsJson)
    .then((response) => response.json())
    .then((iconData) => {
      iconData.forEach((ic, i) => {
        const icon = document.createElement("img");
        icon.src = ic.file;
        icon.className = "hero-icon";
        icon.dataset.tooltip = ic.tooltip;
        icon.dataset.angle = ic.angle;   // 👈 add this

        const orbitCfg = scene.orbits[ic.orbit] || scene.orbits[0];
        const radius = orbitCfg.radius;

        const angleRad = (ic.angle * Math.PI) / 180;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;

        const offsetX = scene.centerOffset?.x || 0;
        const offsetY = scene.centerOffset?.y || 0;
        
        icon.style.left = `calc(50% + ${offsetX}px + ${x}px)`;
        icon.style.top  = `calc(50% + ${offsetY}px + ${y}px)`;
        

        container.appendChild(icon);
      });

      setupTooltip(container);

      // reveal icons strictly after orbits complete, one after another
        setTimeout(() => {
            const icons = container.querySelectorAll(".hero-icon");

        icons.forEach((ic, i) => {
            setTimeout(() => {
                ic.style.opacity = 1;
                // no transform here – CSS hover handles scale
            }, i * 150); // 150ms stagger between icons
            });
    }, iconsBaseDelayMs);



      requestAnimationFrame(() => startAnimation(container));
    })
    .catch((err) => {
      console.error("Error loading icon JSON:", err);
      requestAnimationFrame(() => startAnimation(container));
    });
}

function startAnimation(container) {
  const img = container.querySelector(".hero-img");
  if (img) {
    img.style.opacity = 1;
    img.style.transform = "translateY(0)";
  }

  const particles = container.querySelector(".hero-particles");
  if (particles) {
    particles.style.opacity = 1;
  }

  container.querySelectorAll(".orbit").forEach((o) => {
    o.style.opacity = 1;
    o.style.transform = "scale(1)";
  });
}

function setupTooltip(container) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    container.appendChild(tooltip);
  
    container.querySelectorAll(".hero-icon").forEach(icon => {
      icon.addEventListener("mouseenter", () => {
        const angle = parseFloat(icon.dataset.angle || "0");
  
        tooltip.innerText = icon.dataset.tooltip || "";
        tooltip.style.left = icon.style.left;
        tooltip.style.top  = icon.style.top;
        tooltip.style.opacity = 1;
  
        // if angle > 270 → tooltip on the right
        if (angle > 270) {
          tooltip.style.transform = "translate(35px, -50%)";         // a bit to the right
          tooltip.style.textAlign = "left";
        } else {
          // angle <= 270 → tooltip on the left
          tooltip.style.transform = "translate(calc(-100% - 35px), -50%)";        // to the left
          tooltip.style.textAlign = "right";
        }
      });
  
      icon.addEventListener("mouseleave", () => {
        tooltip.style.opacity = 0;
        // optional: reset transform so next hover starts clean
        tooltip.style.transform = "translate(-50%, -50%)";
      });
    });
  }
  

// function setupTooltip(container) {
//   const tooltip = document.createElement("div");
//   tooltip.className = "tooltip";
//   container.appendChild(tooltip);

//   container.querySelectorAll(".hero-icon").forEach((icon) => {
//     icon.addEventListener("mouseenter", () => {
//       tooltip.innerText = icon.dataset.tooltip || "";
//       tooltip.style.left = icon.style.left;
//       tooltip.style.top = icon.style.top;
//       tooltip.style.opacity = 1;
//       tooltip.style.transform = "translate(-50%, -100%) translateY(0)";
//     });

//     icon.addEventListener("mouseleave", () => {
//       tooltip.style.opacity = 0;
//       tooltip.style.transform = "translate(-50%, -100%) translateY(-6px)";
//     });
//   });
// }

// kick off
buildScene(container, scene);



// import { scenes } from "./scene.js";

// const container = document.querySelector("[data-hero-scene]");
// const scene = scenes[0]; // or pick by date, rotate, random

// async function buildScene(container, scene) {
  
//   // 1. IMAGE
//   const img = document.createElement("img");
//   img.src = scene.image;
//   img.className = "hero-img";
//   container.appendChild(img);

//   // 2. PARTICLES
//   const particles = document.createElement("img");
//   particles.src = scene.particles;
//   particles.className = "hero-particles";
//   container.appendChild(particles);

//   // ORBITS
//   scene.orbits.forEach((orbit, i) => {
//     const div = document.createElement("div");
//     div.className = "orbit";
//     div.style.width = orbit.radius * 2 + "px";
//     div.style.height = orbit.radius * 2 + "px";
//     div.style.transitionDelay = orbit.delay + "s";
//     container.appendChild(div);
//   });

//  // find when the last orbit finishes
//     const maxOrbitDelay = scene.orbits.reduce(
//     (max, o) => Math.max(max, o.delay),
//     0
//   );
//     const orbitAnimDuration = 0.5; // matches CSS transition time
//     const iconsBaseDelay = maxOrbitDelay + orbitAnimDuration; // e.g. 2 + 0.5 = 2.5s
// }
// // Load icon positions from JSON
// fetch(scene.iconsJson)
//   .then(response => response.json())
//   .then(iconData => {

//     iconData.forEach((ic, i) => {
//       const icon = document.createElement("img");
//       icon.src = ic.file;
//       icon.className = "hero-icon";
//       icon.dataset.tooltip = ic.tooltip;

//       // orbit + angle positioning
//       const orbitCfg = scene.orbits[ic.orbit] || scene.orbits[0];
//       const radius = orbitCfg.radius;

//       const angleRad = (ic.angle * Math.PI) / 180;
//       const x = Math.cos(angleRad) * radius;
//       const y = Math.sin(angleRad) * radius;

//       icon.style.left = `calc(50% + ${x}px)`;
//       icon.style.top = `calc(50% + ${y}px)`;

//       // delay after orbits finish
//       const iconsBaseDelay = parseFloat(container.dataset.iconsStart || "0");
//       icon.style.transitionDelay = iconsBaseDelay + i * 0.15 + "s";

//       container.appendChild(icon);
//     });

//     // MOVE these INSIDE the .then() block
//     setupTooltip(container);
//     requestAnimationFrame(() => startAnimation(container));

//   }); // <-- properly closes the .then()


// //  // 4. ICONS — new orbit-angle method
// //  scene.icons.forEach((ic, i) => {
// //     const icon = document.createElement("img");
// //     icon.src = ic.icon;
// //     icon.className = "hero-icon";
// //     icon.dataset.tooltip = ic.tooltip;

// //     // Pick orbit radius
// //     const orbitCfg = scene.orbits[ic.orbit] || scene.orbits[0];
// //     const radius = orbitCfg.radius;

// //     // Convert angle to radians
// //     const angleRad = (ic.angle * Math.PI) / 180;

// //     // Compute position
// //     const x = Math.cos(angleRad) * radius;
// //     const y = Math.sin(angleRad) * radius;

// //     // Center position relative to hero
// //     icon.style.left = `calc(50% + ${x}px)`;
// //     icon.style.top = `calc(50% + ${y}px)`;
// //     // only per-icon stagger, no base offset
// //     icon.style.transitionDelay = iconsBaseDelay + i * 0.15 + "s";


// //     container.appendChild(icon);
// //   });

// //   setupTooltip(container);
// //   requestAnimationFrame(() => startAnimation(container));




// function startAnimation(container) {
//   const img = container.querySelector(".hero-img");
//   if (img) {
//     img.style.opacity = 1;
//     img.style.transform = "translateY(0)";
//   }

//   const particles = container.querySelector(".hero-particles");
//   if (particles) {
//     particles.style.opacity = 1;
//   }

//   container.querySelectorAll(".orbit").forEach(o => {
//     o.style.opacity = 1;
//     o.style.transform = "scale(1)";
//   });

//   container.querySelectorAll(".hero-icon").forEach(ic => {
//     ic.style.opacity = 1;
//     ic.style.transform = "translate(-50%, -50%) scale(1)";
//   });
// }

// function setupTooltip(container) {
//   const tooltip = document.createElement("div");
//   tooltip.className = "tooltip";
//   container.appendChild(tooltip);

//   container.querySelectorAll(".hero-icon").forEach(icon => {
//     icon.addEventListener("mouseenter", () => {
//       tooltip.innerText = icon.dataset.tooltip || "";
//       tooltip.style.left = icon.style.left;
//       tooltip.style.top = icon.style.top;
//       tooltip.style.opacity = 1;
//       tooltip.style.transform = "translate(-50%, -100%) translateY(0)";
//     });

//     icon.addEventListener("mouseleave", () => {
//       tooltip.style.opacity = 0;
//       tooltip.style.transform = "translate(-50%, -100%) translateY(-6px)";
//     });
//   });
// }

// buildScene(container, scene);




//   // ORBITS
//   scene.orbits.forEach((orbit, i) => {
//     const div = document.createElement("div");
//     div.className = "orbit";
//     div.style.width = orbit.radius * 2 + "px";
//     div.style.height = orbit.radius * 2 + "px";
//     div.style.transitionDelay = orbit.delay + "s";
//     container.appendChild(div);
//   });

// // ICONS – position by orbit + angle
// scene.icons.forEach((ic, i) => {
//     const icon = document.createElement("img");
//     icon.src = ic.icon;
//     icon.className = "hero-icon";
  
//     // pick orbit radius (fallback to first orbit if none)
//     const orbitIndex = ic.orbit ?? 0;
//     const orbitCfg = scene.orbits[orbitIndex] || scene.orbits[0];
//     const radius = orbitCfg.radius;
  
//     // convert angle to radians
//     const angleRad = (ic.angle * Math.PI) / 180;
  
//     // cartesian coords around center
//     const x = Math.cos(angleRad) * radius;
//     const y = Math.sin(angleRad) * radius;
  
//     // place relative to center of hero
//     icon.style.left = `calc(50% + ${x}px)`;
//     icon.style.top  = `calc(50% + ${y}px)`;
  
//     icon.style.transitionDelay = 0.8 + i * 0.15 + "s";
//     icon.dataset.tooltip = ic.tooltip;
  
//     container.appendChild(icon);
//   });
  

//   setupTooltip(container);
  
//   requestAnimationFrame(() => startAnimation(container));
// }

// function startAnimation(container) {
//   container.querySelector(".hero-img").style.opacity = 1;
//   container.querySelector(".hero-img").style.transform = "translateY(0)";

//   container.querySelector(".hero-particles").style.opacity = 1;

//   container.querySelectorAll(".orbit").forEach(o => {
//     o.style.opacity = 1;
//     o.style.transform = "scale(1)";
//   });

//   container.querySelectorAll(".hero-icon").forEach(ic => {
//     ic.style.opacity = 1;
//     ic.style.transform = "translate(-50%, -50%) scale(1)";
//   });
// }

// /* Tooltip logic */
// function setupTooltip(container) {
//   const tooltip = document.createElement("div");
//   tooltip.className = "tooltip";
//   container.appendChild(tooltip);

//   container.querySelectorAll(".hero-icon").forEach(icon => {
//     icon.addEventListener("mouseenter", () => {
//       tooltip.innerText = icon.dataset.tooltip;
//       tooltip.style.left = icon.style.left;
//       tooltip.style.top = icon.style.top;
//       tooltip.style.opacity = 1;
//       tooltip.style.transform = "translate(-50%, -100%) translateY(0)";
//     });

//     icon.addEventListener("mouseleave", () => {
//       tooltip.style.opacity = 0;
//       tooltip.style.transform = "translate(-50%, -100%) translateY(-6px)";
//     });
//   });
// }

// buildScene(container, scene);


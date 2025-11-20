export const scenes = [
    {
      id: "scene-01",
      image: "assets/person-01.png",
  
      particles: "assets/dots.png",

      centerOffset: { x: 0, y: 0 },     // 👈 NEW

     
      orbits: [
        { radius: 190, delay: 1 },
        { radius: 260, delay: 1.5 },
        { radius: 330, delay: 2 }
      ],
  
        iconsJson: "assets/icons/icon-positions.json"
    }
  ];
  
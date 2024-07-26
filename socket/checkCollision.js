const checkForOrbCollisions = (pData, pConfig, orbs, settings) => {
  // ORB COLLISIONS
  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i];
    // AABB Test (Axis-Aligned Bounding Box)
    if (
      pData.locX + pData.radius + orb.radius > orb.locX &&
      pData.locX < orb.locX + pData.radius + orb.radius &&
      pData.locY + pData.radius + orb.radius > orb.locY &&
      pData.locY < orb.locY + pData.radius + orb.radius
    ) {
      // Pythagorean test (circle)
      const distance = Math.sqrt(
        (pData.locX - orb.locX) * (pData.locX - orb.locX) +
          (pData.locY - orb.locY) * (pData.locY - orb.locY)
      );
      if (distance < pData.radius + orb.radius) {
        // COLLISION!!!
        pData.score += 1; // Increment score
        pData.orbsAbsorbed += 1; // Increment orbs absorbed count
        if (pConfig.zoom > 1) {
          pConfig.zoom -= 0.001; // Update zoom so player doesn't get too big for screen
        }
        pData.radius += 0.05; // Increase player size
        if (pConfig.speed < -0.005) {
          pConfig.speed += 0.005; // Increase player speed
        } else if (pConfig.speed > 0.005) {
          pConfig.speed -= 0.005;
        }
        // Return index of the collided orb
        return i;
      }
    }
  }
  return null;
};
const checkForPlayerCollisions = (
  pData,
  pConfig,
  players,
  playersForUsers,
  playerId
) => {
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if (p.socketId && p.socketId != playerId) {
      let pLocx = p.playerData.locX;
      let pLocy = p.playerData.locY;
      let pR = p.playerData.radius;

      // More precise AABB Test - Axis-aligned bounding boxes
      if (
        pData.locX + pData.radius + pR > pLocx &&
        pData.locX - pData.radius - pR < pLocx &&
        pData.locY + pData.radius + pR > pLocy &&
        pData.locY - pData.radius - pR < pLocy
      ) {
        // Pythagorean test
        const distance = Math.sqrt(
          (pData.locX - pLocx) * (pData.locX - pLocx) +
            (pData.locY - pLocy) * (pData.locY - pLocy)
        );
        if (distance < pData.radius + pR) {
          // Collision detected
          if (pData.radius > pR) {
            pData.score += p.playerData.score + 10;
            pData.playersAbsorbed += 1;
            p.alive = false;
            pData.radius += p.playerData.radius * 0.25;
            const collisionData = {
              absorbed: p.playerData.name,
              absorbedBy: pData.name,
            };

            if (pConfig.zoom > 1) {
              pConfig.zoom -= pR * 0.25 * 0.001;
            }
            players.splice(i, 1, {}); // Remove player from server players array
            playersForUsers.splice(i, 1, {}); // Remove player from client players array
            return collisionData;
          }
        }
      }
    }
  }
  return null;
};

module.exports = { checkForOrbCollisions, checkForPlayerCollisions };

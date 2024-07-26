const io = require("../server").io;
module.exports = io;

const Player = require("./player");
const PlayerConfig = require("./playerconfig");
const PlayerData = require("./playerdata");
const Orb = require("./orb");
const checkForOrbCollisions = require("./checkCollision").checkForOrbCollisions;

const checkForPlayerCollisions =
  require("./checkCollision").checkForPlayerCollisions;

const orb = [];
const settings = {
  defaultNumberOfOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000,
  defaultGenericOrbSize: 5,
  radius: 5,
};
const players = [];
const playersForUsers = [];
let tiktok;

initGame();

io.on("connect", (socket) => {
  let player = {};

  socket.on("init", (playerObj, ackCallback) => {
    if (players.length === 0) {
      tiktok = setInterval(() => {
        io.to("game").emit("tick", playersForUsers);
      }, 16);
    }

    socket.join("game");
    const playerName = playerObj.playerName;
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    players.push(player);
    playersForUsers.push({ playerData });

    ackCallback({ orb, indexInPlayers: playersForUsers.length - 1 });
  });

  socket.on("tock", (data) => {
    if (!player.playerConfig) {
      return;
    }
    const speed = player.playerConfig.speed;
    const xV = (player.playerConfig.xVector = data.xVector);
    const yV = (player.playerConfig.yVector = data.yVector);
    if (
      (player.playerData.locX > 5 && xV < 0) ||
      (player.playerData.locX < settings.worldWidth && xV > 0)
    ) {
      player.playerData.locX += speed * xV;
    }
    if (
      (player.playerData.locY > 5 && yV > 0) ||
      (player.playerData.locY < settings.worldHeight && yV < 0)
    ) {
      player.playerData.locY -= speed * yV;
    }

    const checkOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orb,
      settings
    );

    if (checkOrb !== null) {
      orb.splice(checkOrb, 1, new Orb(settings));

      const orbdata = {
        checkOrb,
        newOrb: orb[checkOrb],
      };

      io.to("game").emit("orbSwitch", orbdata);
      io.to("game").emit("updateLeaderBoard", getLeaderBoard());
    }

    const absorbData = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      playersForUsers,
      socket.id
    );

    if (absorbData) {
      io.to("game").emit("playerAbsorbed", absorbData);
      io.to("game").emit("updateLeaderBoard", getLeaderBoard());
    }
  });

  socket.on("disconnect", (reason) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].socketId === player.socketId) {
        players.splice(i, 1, {});
        playersForUsers.splice(i, 1, {});
        break;
      }
    }

    if (players.length === 0) {
      clearInterval(tiktok);
    }
  });
});
function initGame() {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    const newOrb = new Orb(settings);
    orb.push(newOrb);
  }
}

function getLeaderBoard() {
  const leaderBoardArray = players.map((curPlayer) => {
    if (curPlayer.playerData) {
      return {
        name: curPlayer.playerData.name,
        score: curPlayer.playerData.score,
      };
    } else {
      return {};
    }
  });
  return leaderBoardArray;
}

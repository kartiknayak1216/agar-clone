const socket = io.connect("http://localhost:8000");
let orbs = [];
let player = {}; // Declare player here

const init = async () => {
  const initData = await socket.emitWithAck("init", {
    playerName: player.name,
  });

  setInterval(async () => {
    socket.emit("tock", {
      xVector: player.xVector ? player.xVector : 0.1,
      yVector: player.yVector ? player.yVector : 0.1,
    });
  }, 16);

  orbs = initData.orb;
  player.indexInPlayers = initData.indexInPlayers;
  draw();
};

socket.on("tick", (playersArray) => {
  players = playersArray;
  if (players[player.indexInPlayers]) {
    player.locX = players[player.indexInPlayers].playerData.locX;
    player.locY = players[player.indexInPlayers].playerData.locY;
  }
});

socket.on("orbSwitch", (data) => {
  orbs.splice(data.checkOrb, 1, data.newOrb);
});

socket.on("playerAbsorbed", (absorbData) => {
  document.querySelector(
    "#game-message"
  ).innerHTML = `${absorbData.absorbed} was absorbed by ${absorbData.absorbedBy}`;
  document.querySelector("#game-message").style.opacity = 1;
  window.setTimeout(() => {
    document.querySelector("#game-message").style.opacity = 0;
    window.location.reload();
  }, 2000);
});

socket.on("updateLeaderBoard", (leaderBoardArray) => {
  console.log(leaderBoardArray);
  // console.log(leaderBoardArray)
  leaderBoardArray.sort((a, b) => {
    return b.score - a.score;
  });
  document.querySelector(".leader-board").innerHTML = "";
  leaderBoardArray.forEach((p) => {
    if (!p.name) {
      return;
    }
    document.querySelector(".leader-board").innerHTML += `
          <li class="leaderboard-player">${p.name} - ${p.score}</li>
      `;
  });
  const el = leaderBoardArray.find((u) => u.name === player.name);
  document.querySelector(".player-score").innerHTML = el.score;
});
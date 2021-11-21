const SpotifyWebApi = require("spotify-web-api-node");
const {
  getSongsByFamilyIdWithFilteredUsersAndFilterdYears,
} = require("../models/mainModel");

// Add a sleep function
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

module.exports.buildPlaylist = async (options) => {
  return new Promise(async (resolve, reject) => {
    const spotify = new SpotifyWebApi();
    // try {

    const {
      familyId: familyId,
      playList: playlist,
      id: userId,
      token: spotifyApiToken,
    } = options;
    const list = await getSongsByFamilyIdWithFilteredUsersAndFilterdYears({
      id: familyId,
      userId: playlist.votter,
      year: playlist.year,
    });

    playlist.list = list;

    await spotify.setAccessToken(spotifyApiToken);

    // searching tracks
    let songsUris = await getTracks(spotify, playlist.list);
    //Make playlist in spotify
    const { body: createPlaylist } = await spotify.createPlaylist(userId, {
      name: playlist.name,
      public: playlist.public,
      description: playlist.description,
    });
    playlistId = createPlaylist.id;
    //splitList
    const playlistLimit = 100;
    let sliceArrSongs = await sliceArr(songsUris, playlistLimit);
    let i;
    const times = Math.ceil(Math.floor(songsUris.length) / playlistLimit);
    for (i = 0; i < times; i++) {
      // Set AccessToken again in case it changed
      await spotify.setAccessToken(spotifyApiToken);
      await spotify.addTracksToPlaylist(playlistId, sliceArrSongs[i]);
    }
    resolve(playlistId);
    // } catch (error) {
    //   reject(error);
    // }
  });
};

async function getTracks(spotify, list) {
  let songUris = [];
  try {
    for (const s of list) {
      let audioUrl = s.audio;
      let audioFile = "";
      let uri;
      if (audioUrl == !null)
        audioFile = audioUrl.substring(audioUrl.lastIndexOf("/") + 1);
      if (audioFile.includes("spotify-")) {
        uri = `spotify:track:${audioFile
          .replace("spotify-", "")
          .replace(".mp3", "")}`;

        songUris.push(uri);
      } else {
        let cleanTitle = await trackFiltering(s.title).replace(
          /[|&;$%@"<>()+.,]/g,
          ""
        );
        let artist = await s.artist.replace(/[|&;$%@"<>()+.,]/g, "");
        let name = `track:${cleanTitle} artist:${artist}`;
        await sleep(100); //build in Sleep

        let { body: song } = await spotify.searchTracks(name);
        if (song.tracks.items.length != 0) {
          uri = `spotify:track:${song.tracks.items[0].id.toString()}`;
          songUris.push(uri);
        } else {
          let { body: songTitleOnly } = await spotify.searchTracks(cleanTitle);
          if (songTitleOnly.tracks.items.length !== 0) {
            uri = `spotify:track:${songTitleOnly.tracks.items[0].id.toString()}`;
            songUris.push(uri);
          }
        }
      }
    }
    return songUris;
  } catch (error) {
    return songUris;
  }
}

function sliceArr(arr, size) {
  const times = Math.ceil(Math.floor(arr.length) / size);
  let splitArr = [];
  let startPoint = 0;
  for (let i = 1; i < times + 1; i++) {
    let endPoint = size * i;
    splitArr.push(arr.slice(startPoint, endPoint));
    startPoint = endPoint;
  }
  return splitArr;
}

function trackFiltering(trackName) {
  let newTrackName = trackName;
  if (trackName.includes("(Live)"))
    newTrackName = trackName.replace("(Live)", "");
  if (trackName.includes("(album versie)"))
    newTrackName = trackName.replace("(album versie)", "");
  return newTrackName;
}

const axios = require("axios");

module.exports = getDataFormVoteList = async (url, year) => {
  if (year < 2023) {
    return before2023Url(url, year);
  }

  if (year >= 2023) {
    return after2023Url(url, year);
  }
};

async function after2023Url(url, year) {
  if (url !== null) {
    if (url.length !== 36) {
      let urlObject = new URL(url);
      let urlId = urlObject.pathname.split("/").pop();
      url = urlId;
    }

    const getUrl = `https://npo.nl/luister/stem/npo-radio-2-top-2000/inzending/${url}`;
    const { data } = await axios.get(getUrl);

    try {
      // Get the number data out of the html
      const voteDataString = JSON.parse(data.split("<script>")[17].replace("self.__next_f.push(", "").replace(")</script>", ""));
      const tracks = voteDataString[1].split('tracks":[')[1].split(']}],')[0].split('},{');

      const songs = tracks.map(track => {
        const artistMatch = track.match(/"artist":"(.*?)"/);
        const titleMatch = track.match(/"title":"(.*?)"/);
        const imageMatch = track.match(/"image":{"default":"(.*?)"/);
        const imageBigMatch = track.match(/"image":{"default":"(.*?)"/);
        const audioMatch = track.match(/"audioPreview":"(.*?)"/);

        const artist = artistMatch ? artistMatch[1] : "";
        const title = titleMatch ? titleMatch[1] : "";
        const image = imageMatch ? imageMatch[1] : "";
        const imageBig = imageBigMatch ? imageBigMatch[1] : "";
        const audio = audioMatch ? audioMatch[1] : "";

        return { artist, title, image, imageBig, audio };
      });


      const list = {
        songs,
        year
      }
      return list
    } catch (error) {
      console.log(error);
    }
    return null;
  }
}

async function before2023Url(url, year) {
  if (url.length !== 40) {
    let urlObject = new URL(url);
    let urlId = urlObject.pathname.split("/").pop();
    url = urlId;
  }

  if (url !== null) {
    let yearAddon = `-${year}`;
    if (year === 2019) yearAddon = "";
    if (url.length === 40) {
      const getUrl = `https://stem-backend.npo.nl/api/form/top2000${yearAddon}/${url}`;

      const { data } = await axios.get(getUrl);

      const tracks = data.shortlist.map(item => {
        const { artist, title, image, imageBig, audio } = item._source;
        return { artist, title, image: image || "", imageBig: imageBig || "", audio: audio || "" };
      });

      const list = {
        songs: tracks,
        year
      };

      return list;
    }
  }
}

// LYRIC INFO
const songList = {
  1: "Don't want to be a fool for you, Just another player in your game for two, You may hate me but it ain't no lie, Baby bye bye bye, Bye bye, I Don't want to make it tough, I just want to tell you that I've had enough, It might sound crazy but it ain't no lie, Baby bye bye bye".split(', '),
  2: "Twenty-five years and my life is still, Trying to get up that great big hill of hope, For a destination, I realized quickly when I knew I should, That the world was made up of this brotherhood of man, For whatever that means, And so I cry sometimes when I'm lying in bed, Just to get it all out what's in my head, And I, I am feeling a little peculiar, And so I wake in the morning and I step outside, And I take a deep breath and I get real high, and I Scream from the top of my lungs, What's going on?, And I say hey yeah yeah hey yeah yeah, I said hey what's going on?, And I say hey yeah yeah hey yeah yeah,I said hey what's going on?".split(', ')
};


// INITIAL REDUX STATE
const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: "Bye Bye Bye",
      artist: "N'Sync",
      songId: 1,
      lyricsArray: songList[1],
      lyricsPosition: 0,
    },
    2: {
      title: "What's Goin' On",
      artist: "Four Non-Blondes",
      songId: 2,
      lyricsArray: songList[2],
      lyricsPosition: 0,
    },
  }
};


// REDUCERS
const lyricChangeReducer = (songsById=initialState.songsById, action) => {
  let newLyricsPosition;
  let newSongsByIdEntry;
  let newSongByIdStateSlice;
  let currentSongId = action.currentSongId;
  switch (action.type) {
    case 'NEXT_LYRIC':
      newLyricsPosition = songsById[currentSongId].lyricsPosition + 1;
      newSongsByIdEntry = Object.assign({}, songsById[currentSongId], { lyricsPosition: newLyricsPosition });
      newSongsById = Object.assign({}, songsById, { [currentSongId]: newSongsByIdEntry });
      return newSongsById;
    case 'RESTART_SONG':
      newSongsByIdEntry = Object.assign({}, songsById[currentSongId], { lyricsPosition: 0 });
      newSongsById = Object.assign({}, songsById, { [currentSongId]: newSongsByIdEntry });
      return newSongsById;
    default:
      return songsById;
  }
}

const songChangeReducer = (currentSongId=initialState.currentSongId, action) => {
  switch (action.type) {
    case 'CHANGE_SONG':
      return action.newSelectedSongId;
    default:
      return currentSongId;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSongId: songChangeReducer,
  songsById: lyricChangeReducer
});

// REDUX STORE
const { createStore } = Redux;
const store = createStore(rootReducer);


// JEST TESTS + SETUP
const { expect } = window;
console.log('--START TESTS--');

console.log('- rootReducer -')
expect(rootReducer(initialState, { type: null })).toEqual(initialState);
expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));
expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, { type: null }));

console.log('- lyricChangeReducer -')
console.log('default action');
expect(lyricChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

console.log('NEXT_LYRIC');
expect(lyricChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    lyricsArray: songList[1],
    lyricsPosition: 0,
  },
  2: {
    title: "What's Goin' On",
    artist: "Four Non-Blondes",
    songId: 2,
    lyricsArray: songList[2],
    lyricsPosition: 1,
  },
});

console.log('RESTART_SONG');
expect(lyricChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    lyricsArray: songList[1],
    lyricsPosition: 0,
  },
  2: {
    title: "What's Goin' On",
    artist: "Four Non-Blondes",
    songId: 2,
    lyricsArray: songList[2],
    lyricsPosition: 0,
  },
});

console.log('- songChangeReducer -')
console.log('CHANGE_SONG');
expect(songChangeReducer(initialState.currentSongId, { type: 'CHANGE_SONG', newSelectedSongId: 1 })).toEqual(1);

console.log('--END TESTS--');


// RENDERING STATE IN DOM
const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }
  const currentSongId = store.getState().currentSongId;
  if (currentSongId) {
    const currentSong = store.getState().songsById[currentSongId];
    const currentLyrics = currentSong.lyricsArray[currentSong.lyricsPosition];
    const currentLine = document.createTextNode(currentLyrics);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
    document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}

const renderSongs = () => {
  const songsById = store.getState().songsById;
  for (const songKey in songsById) {
    const song = songsById[songKey];
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(' by ' + song.artist);
    em.appendChild(songTitle);
    h3.appendChild(em);
    h3.appendChild(songArtist);
    h3.addEventListener('click', () => selectSong(song.songId));
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

window.onload = () => {
  renderSongs();
  renderLyrics();
}


// CLICK LISTENER
const userClick = () => {
  const state = store.getState();
  const currentSongId = state.currentSongId
  if (currentSongId) {
    const currentSong = state.songsById[currentSongId];
    if (currentSong.lyricsPosition === currentSong.lyricsArray.length - 1) {
      store.dispatch({ type: 'RESTART_SONG', currentSongId: currentSongId });
    } else {
      store.dispatch({ type: 'NEXT_LYRIC', currentSongId: currentSongId });
    }
  }
}

const selectSong = (newSongId) => {
  let state = store.getState();
  if (state.currentSongId) {
    store.dispatch({ type: 'RESTART_SONG', currentSongId: state.currentSongId });
  }
  store.dispatch({ type: 'CHANGE_SONG', newSelectedSongId: newSongId });
}

// SUBSCRIBE TO REDUX STORE
store.subscribe(renderLyrics);

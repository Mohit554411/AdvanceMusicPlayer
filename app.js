
import allSongDetails from './assets/jsonFile/allSongDetails.json' assert { type: 'json' };
import allPlaylistDetails from './assets/jsonFile/allPlaylistDetails.json' assert { type: 'json' };

// fecthing all the elements

const themeChangeCheckBoxElement = document.getElementById('themeChangeCheckBox');
const filterGenreElement = document.getElementById('filterGenre');
const songListElement = document.querySelector('.allSongList');
const audioElement = document.getElementById('audioElement');
const audio = document.getElementById('audioPlayer');
const albumImage = document.getElementById('albumImage');
const nextButton = document.getElementById('nextButton');
const preButton = document.getElementById('preButton');
const songNameElement = document.getElementById('songName');
const singerElement = document.getElementById('singer');
const lyricsElement = document.getElementById('lyrics');
const musicElement = document.getElementById('music');
const genreElement = document.getElementById('musicGenre');
const createPlaylistButton = document.getElementById('createPlaylistButton');
const allPlayListElement = document.querySelector('.allPlayList');
const playListAllSongList = document.querySelector('.playListAllSongList');
const addPlayListButton = document.getElementById('addPlaylist');
// global Variables

let activeSong = allSongDetails[0].songName;
let filteredSongs = allSongDetails;
let currentPlaylist = '';

document.addEventListener('DOMContentLoaded', () => {
    addingAllSongs(allSongDetails);
});
// adding event listener to the checkbox for the Dark theme
themeChangeCheckBoxElement.addEventListener('change', () => {
    if (themeChangeCheckBoxElement.checked) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    document.querySelector('.songDetailsConatiner').style.boxShadow = '0 0 5px 0px rgb(119 119 119)';
});

// adding event listener to the filter genre

filterGenreElement.addEventListener('change', (event) => {
    const selectedGenre = event.target.value;
    songListElement.innerHTML = '';
    if (selectedGenre === 'All') {
        filteredSongs = allSongDetails;
        addingAllSongs(allSongDetails);
        return;
    }
    filteredSongs = allSongDetails.filter((song) => song.genre === selectedGenre);
    addingAllSongs(filteredSongs);
});

// adding all the songs to the list
function addingAllSongs(songList) {
    songList.forEach((song) => {
        const songElement = document.createElement('p');
        songElement.classList.add('songStyle');
        songElement.classList.add('playSong');
        song.songName === activeSong && songElement.classList.add('activeSong');
        songElement.textContent = song.songName;
        songListElement.appendChild(songElement);
    });
}


// Playing the song when clicked on the song

songListElement.addEventListener('click', (event) => {
    const allChild = document.querySelectorAll('.playSong');
    allChild.forEach((child) => {
        child.classList.remove('activeSong');
    });
    if (event.target.classList.contains('playSong')) {
        event.target.classList.toggle('activeSong');
        const songName = event.target.textContent;
        activeSong = songName;
        const song = allSongDetails.find((song) => song.songName === songName);
        changeAudioSource(song);
    }
});

function changeAudioSource(song) {
    try {
        albumImage.src = song.imageurl;
        songNameElement.textContent = song.songName;
        singerElement.textContent = song.singer;
        lyricsElement.textContent = song.lyrics;
        musicElement.textContent = song.music;
        genreElement.textContent = song.genre;
        audioElement.src = `assets/songs/${song.songUrl}`;
        audio.load();
        setTimeout(() => {
            togglePlayPause(); // Play the audio
        }, 1000);
    } catch (error) {
        console.log(error);
    }
    // Reload the audio element to apply the new source
}

// Play or pause the audio
function togglePlayPause() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

// next and previous button functionality
nextButton.addEventListener('click', () => {
    changeTheSong('next');
});

preButton.addEventListener('click', () => {
    changeTheSong('pre');
});

function changeTheSong(operation) {
    const allChild = document.querySelectorAll('.playSong');
    let index = 0;
    allChild.forEach((child, i) => {
        if (child.classList.contains('activeSong')) {
            index = i;
        }
    });
    allChild[index].classList.remove('activeSong');
    if (operation === 'pre') {
        index = (index + 1) % allChild.length;
    } else {
        index = (index - 1 + allChild.length) % allChild.length;
    }
    allChild[index].classList.add('activeSong');
    activeSong = allChild[index].textContent;
    const song = allSongDetails.find((song) => song.songName === activeSong);
    changeAudioSource(song);
}

// Creating the playlist

createPlaylistButton.addEventListener('click', () => {
    const inputvalue = document.getElementById('createPlaylistInput').value.trim();
    if (inputvalue != '') {
        const allChild = document.querySelectorAll('.playList');
        if (allChild.length > 0 && [...allChild].some(child => child.textContent.toLowerCase() === inputvalue.toLowerCase())) {
            alert('Playlist already exists');
            return;
        }
        else {
            const playlistEle = document.createElement('div');
            playlistEle.classList.add('songStyle');
            playlistEle.classList.add('playList');
            playlistEle.textContent = inputvalue.charAt(0).toUpperCase() + inputvalue.slice(1);
            allPlayListElement.appendChild(playlistEle);
            document.getElementById('createPlaylistInput').value = '';
            allPlaylistDetails.push({
                playlistName: playlistEle.textContent,
                songsList: []
            });
        }
    }
});

allPlayListElement.addEventListener('click', (event) => {
    const allChild = document.querySelectorAll('.playList');
    allChild.forEach((child) => {
        child.classList.remove('activePlayList');
    });
    if (event.target.classList.contains('playList')) {
        event.target.classList.add('activePlayList');
        const playlistName = event.target.textContent;
        currentPlaylist = playlistName;
        const playlist = allPlaylistDetails.find((playlist) => playlist.playlistName === playlistName);
        playListAllSongList.innerHTML = '';
        playlist.songsList.length > 0 && playlist.songsList.forEach((song) => {
            const songElement = document.createElement('p');
            songElement.classList.add('songStyle');
            songElement.classList.add('playSong');
            // songElement.classList.add('removePlayListSong');
            songElement.textContent = song;
            playListAllSongList.appendChild(songElement);
        });
    }
});

addPlayListButton.addEventListener('click', () => {
    if (allPlaylistDetails.length === 0 || currentPlaylist === '') {
        alert('Please select a playlist');
        return;
    }
    else {
        const allChild = document.querySelectorAll('.playSong');
        let selectedSongs = [];
        allChild.forEach((child) => {
            if (child.classList.contains('activeSong')) {
                selectedSongs.push(child.textContent);
            }
        });
        if (selectedSongs.length > 0) {
            const playlist = allPlaylistDetails.find((playlist) => playlist.playlistName === currentPlaylist);
            selectedSongs.forEach((song) => {
                if (!playlist.songsList.includes(song)) {
                    playlist.songsList.push(song);
                    const songElement = document.createElement('p');
                    songElement.classList.add('songStyle');
                    songElement.classList.add('playSong');
                    // songElement.classList.add('removePlayListSong');
                    songElement.textContent = song;
                    playListAllSongList.appendChild(songElement);
                }
            });
        }
    }
});

playListAllSongList.addEventListener('click', (event) => {
    const allChild = document.querySelectorAll('.playSong');
    allChild.forEach((child) => {
        child.classList.remove('activeSong');
    });
    if (event.target.classList.contains('playSong')) {
        event.target.classList.add('activeSong');
        const songName = event.target.textContent;
        const song = allSongDetails.find((song) => song.songName === songName);
        changeAudioSource(song);
    }
});
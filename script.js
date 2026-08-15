/**
 * SoundPulse — Web-Based Music Player Application Logic
 * Feature Set:
 * - Search bar (title, artist, genre filtering)
 * - Category filter chips (Lo-fi, Rock, Electronic, Jazz, Ambient, Pop)
 * - Playlist Creation & Management (CRUD operations with localStorage persistence)
 * - Audio Playback Engine (Play, Pause, Next, Prev, Seek, Volume, Shuffle, Repeat)
 * - HTML5 Canvas Frequency Audio Visualizer via Web Audio API
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Song Database
     ========================================================================== */
  
  const SONGS_DATABASE = [
    {
      id: 'song-1',
      title: 'Midnight Chill Lounge',
      artist: 'Lo-Fi Beats Co.',
      category: 'Lo-fi',
      duration: '5:00',
      durationSec: 300,
      cover: 'assets/lofi.png',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 'song-2',
      title: 'Neon Horizon Synth',
      artist: 'Cyber Pulse',
      category: 'Electronic',
      duration: '5:00',
      durationSec: 300,
      cover: 'assets/electronic.png',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: 'song-3',
      title: 'Electric Voltage Anthem',
      artist: 'The Overdrive Band',
      category: 'Rock',
      duration: '5:00',
      durationSec: 300,
      cover: 'assets/rock.png',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
      id: 'song-4',
      title: 'Velvet Saxophone Session',
      artist: 'Midnight Jazz Trio',
      category: 'Jazz',
      duration: '5:00',
      durationSec: 300,
      cover: 'assets/jazz.png',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
      id: 'song-5',
      title: 'Cosmic Drift Ambient',
      artist: 'Starlight Dreamer',
      category: 'Ambient',
      duration: '5:00',
      durationSec: 300,
      cover: 'assets/lofi.png',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    {
      id: 'song-6',
      title: 'Summer Pop Groove',
      artist: 'Solaris Waves',
      category: 'Pop',
      duration: '5:00',
      durationSec: 300,
      cover: 'assets/electronic.png',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    },
    {
      id: 'song-7',
      title: 'Rainy Cafe Study',
      artist: 'Coffee & Books',
      category: 'Lo-fi',
      duration: '5:00',
      durationSec: 300,
      cover: 'assets/lofi.png',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
    },
    {
      id: 'song-8',
      title: 'Cybernetic Overdrive',
      artist: 'HyperDrive X',
      category: 'Electronic',
      duration: '5:00',
      durationSec: 300,
      cover: 'assets/electronic.png',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    }
  ];

  /* ==========================================================================
     2. DOM Element References (Initialized FIRST to prevent TDZ errors)
     ========================================================================== */
  
  const audioPlayer = document.getElementById('audio-player');
  
  // Navigation & Header
  const navAllSongs = document.getElementById('nav-all-songs');
  const navFavorites = document.getElementById('nav-favorites');
  const favCountBadge = document.getElementById('fav-count');
  const playlistsListContainer = document.getElementById('playlists-list');
  const btnOpenCreatePlaylist = document.getElementById('btn-open-create-playlist');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const categoryListContainer = document.getElementById('category-list');

  // Sidebar, Right Panel, Header & Compact View Toggles
  const sidebar = document.getElementById('sidebar');
  const rightPanel = document.getElementById('right-panel');
  const topBar = document.querySelector('.top-bar');
  const appContainer = document.querySelector('.app-container');
  const btnCompactToggle = document.getElementById('btn-compact-toggle');
  const btnTogglePanel = document.getElementById('btn-toggle-panel');
  const btnToggleCompactView = document.getElementById('btn-toggle-compact-view');
  const viewTitle = document.getElementById('view-title');
  const songCountLabel = document.getElementById('song-count-label');
  const btnDeletePlaylist = document.getElementById('btn-delete-playlist');
  const songsContainer = document.getElementById('songs-container');
  const emptyState = document.getElementById('empty-state');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  // Player Bar Controls
  const playerThumb = document.getElementById('player-thumb');
  const playerTitle = document.getElementById('player-title');
  const playerArtist = document.getElementById('player-artist');
  const playerLikeBtn = document.getElementById('player-like-btn');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const prevBtn = document.getElementById('prev-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const nextBtn = document.getElementById('next-btn');
  const repeatBtn = document.getElementById('repeat-btn');
  const currentTimeLabel = document.getElementById('current-time');
  const totalDurationLabel = document.getElementById('total-duration');
  const seekBar = document.getElementById('seek-bar');
  const seekProgress = document.getElementById('seek-progress');
  const muteBtn = document.getElementById('mute-btn');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeBar = document.getElementById('volume-bar');
  const volumeProgress = document.getElementById('volume-progress');

  // Right Panel & Vinyl
  const vinylWrapper = document.querySelector('.vinyl-wrapper');
  const panelAlbumArt = document.getElementById('panel-album-art');
  const panelTrackTitle = document.getElementById('panel-track-title');
  const panelTrackArtist = document.getElementById('panel-track-artist');
  const panelTrackGenre = document.getElementById('panel-track-genre');
  const queueList = document.getElementById('queue-list');
  const btnPlayAllQueue = document.getElementById('btn-play-all-queue');
  const topNowPlayingText = document.getElementById('top-now-playing-text');

  // Modals
  const modalCreatePlaylist = document.getElementById('modal-create-playlist');
  const formCreatePlaylist = document.getElementById('form-create-playlist');
  const modalAddToPlaylist = document.getElementById('modal-add-to-playlist');
  const modalTargetSongPreview = document.getElementById('modal-target-song-preview');
  const modalPlaylistsList = document.getElementById('modal-playlists-list');

  /* ==========================================================================
     3. Global Application State & Storage Sync
     ========================================================================== */
  
  let currentTrackIndex = 0;
  let isPlaying = false;
  let isShuffle = false;
  let repeatMode = 'none'; // 'none', 'all', 'one'
  let activeCategory = 'All';
  let searchTerm = '';
  let activeView = 'all'; // 'all', 'favorites', or 'playlist-{id}'
  let activePlaylistId = null;
  let pendingAddToPlaylistSongId = null;

  // Local Storage Data
  let favorites = JSON.parse(localStorage.getItem('soundpulse_favorites') || '[]');
  let playlists = JSON.parse(localStorage.getItem('soundpulse_playlists') || '[]');

  function saveFavoritesToStorage() {
    localStorage.setItem('soundpulse_favorites', JSON.stringify(favorites));
    favCountBadge.textContent = favorites.length;
  }

  function savePlaylistsToStorage() {
    localStorage.setItem('soundpulse_playlists', JSON.stringify(playlists));
    renderPlaylistsSidebar();
  }

  if (playlists.length === 0) {
    playlists = [
      {
        id: 'pl-chill',
        name: 'Chill Study Beats',
        description: 'Relaxing lo-fi and ambient tracks',
        songIds: ['song-1', 'song-5', 'song-7']
      },
      {
        id: 'pl-energetic',
        name: 'Workout Energy',
        description: 'Upbeat rock and electronic tracks',
        songIds: ['song-2', 'song-3', 'song-8']
      }
    ];
    savePlaylistsToStorage();
  }

  /* ==========================================================================
     4. Visualizer Setup (standalone — does NOT touch the audio element)
     ========================================================================== */

  const canvas = document.getElementById('visualizer-canvas');
  const canvasCtx = canvas ? canvas.getContext('2d') : null;
  // Simulated bar heights for animated visualizer (no Web Audio API)
  const VIZ_BARS = 32;
  const vizHeights = new Array(VIZ_BARS).fill(0).map(() => Math.random() * 0.3);
  const vizTargets = new Array(VIZ_BARS).fill(0).map(() => Math.random() * 0.4);

  function drawVisualizer() {
    if (!canvasCtx || !canvas) return;
    requestAnimationFrame(drawVisualizer);

    const width = canvas.width;
    const height = canvas.height;
    canvasCtx.clearRect(0, 0, width, height);

    const barWidth = (width / VIZ_BARS) * 1.5;
    let x = 0;

    for (let i = 0; i < VIZ_BARS; i++) {
      if (isPlaying) {
        // Drift toward a random target
        vizHeights[i] += (vizTargets[i] - vizHeights[i]) * 0.12;
        if (Math.abs(vizTargets[i] - vizHeights[i]) < 0.01) {
          vizTargets[i] = 0.05 + Math.random() * 0.85;
        }
      } else {
        // Decay to near-zero when paused
        vizHeights[i] *= 0.88;
      }

      const barHeight = vizHeights[i] * height * 0.85;
      const gradient = canvasCtx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(0.5, '#a855f7');
      gradient.addColorStop(1, '#06b6d4');
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
      x += barWidth + 2;
    }
  }

  // Start the visualizer loop immediately — completely independent of audio routing
  if (canvasCtx) drawVisualizer();

  /* Toast notification helper */
  function showErrorToast(message) {
    const existing = document.getElementById('soundpulse-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'soundpulse-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '90px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(239,68,68,0.92)',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      zIndex: '9999',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      transition: 'opacity 0.4s'
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
    setTimeout(() => { toast.remove(); }, 3400);
  }

  /* ==========================================================================
     5. Playback Logic & Helper Functions
     ========================================================================== */

  function getCurrentFilteredSongs() {
    return SONGS_DATABASE.filter(song => {
      if (activeView === 'favorites') {
        if (!favorites.includes(song.id)) return false;
      } else if (activeView.startsWith('playlist-')) {
        const plId = activeView.replace('playlist-', '');
        const pl = playlists.find(p => p.id === plId);
        if (!pl || !pl.songIds.includes(song.id)) return false;
      }
      if (activeCategory !== 'All' && song.category !== activeCategory) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = song.title.toLowerCase().includes(query);
        const matchesArtist = song.artist.toLowerCase().includes(query);
        const matchesGenre = song.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesArtist && !matchesGenre) return false;
      }
      return true;
    });
  }

  function loadSong(index, autoPlay = false) {
    if (index < 0 || index >= SONGS_DATABASE.length) return;

    currentTrackIndex = index;
    const song = SONGS_DATABASE[currentTrackIndex];

    audioPlayer.src = song.url;
    audioPlayer.muted = false; // guarantee never muted
    audioPlayer.load();

    // Sync audio element volume with range bar
    const vol = parseFloat(volumeBar.value);
    audioPlayer.volume = isNaN(vol) ? 0.8 : vol;

    // Update Player Bar UI
    playerThumb.src = song.cover;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    updateLikeButtonState(song.id);

    // Update Right Panel UI
    panelAlbumArt.src = song.cover;
    panelTrackTitle.textContent = song.title;
    panelTrackArtist.textContent = song.artist;
    panelTrackGenre.textContent = song.category;

    // Reset progress
    seekBar.value = 0;
    seekProgress.style.width = '0%';
    currentTimeLabel.textContent = '0:00';
    totalDurationLabel.textContent = song.duration || '0:00';

    topNowPlayingText.textContent = `Playing: ${song.title}`;

    renderQueue();
    highlightActiveSongCard();

    if (autoPlay) {
      playSong();
    }
  }

  function playSong() {
    audioPlayer.play().then(() => {
      isPlaying = true;
      playPauseIcon.className = 'ri-pause-fill';
      playPauseBtn.title = 'Pause';
      vinylWrapper.classList.add('playing');
      highlightActiveSongCard();
    }).catch((err) => {
      console.warn('Audio playback was prevented (autoplay policy or network):', err);
      // Don't force-play; let the user click play again
    });
  }

  function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseIcon.className = 'ri-play-fill';
    playPauseBtn.title = 'Play';
    vinylWrapper.classList.remove('playing');
    highlightActiveSongCard();
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseSong();
    } else {
      if (!audioPlayer.src || audioPlayer.src === window.location.href) {
        loadSong(0, true);
      } else {
        playSong();
      }
    }
  }

  function nextSong() {
    const list = getCurrentFilteredSongs();
    const activeList = list.length > 0 ? list : SONGS_DATABASE;
    const currentId = SONGS_DATABASE[currentTrackIndex]?.id;
    let listIdx = activeList.findIndex(s => s.id === currentId);

    if (isShuffle) {
      let randomListIdx = Math.floor(Math.random() * activeList.length);
      if (randomListIdx === listIdx && activeList.length > 1) {
        randomListIdx = (listIdx + 1) % activeList.length;
      }
      const targetSong = activeList[randomListIdx];
      const targetDbIdx = SONGS_DATABASE.findIndex(s => s.id === targetSong.id);
      loadSong(targetDbIdx >= 0 ? targetDbIdx : 0, true);
    } else {
      let nextListIdx = (listIdx + 1) % activeList.length;
      const targetSong = activeList[nextListIdx];
      const targetDbIdx = SONGS_DATABASE.findIndex(s => s.id === targetSong.id);
      loadSong(targetDbIdx >= 0 ? targetDbIdx : 0, true);
    }
  }

  function prevSong() {
    if (audioPlayer.currentTime > 3) {
      audioPlayer.currentTime = 0;
      return;
    }
    const list = getCurrentFilteredSongs();
    const activeList = list.length > 0 ? list : SONGS_DATABASE;
    const currentId = SONGS_DATABASE[currentTrackIndex]?.id;
    let listIdx = activeList.findIndex(s => s.id === currentId);

    let prevListIdx = (listIdx - 1 + activeList.length) % activeList.length;
    const targetSong = activeList[prevListIdx];
    const targetDbIdx = SONGS_DATABASE.findIndex(s => s.id === targetSong.id);
    loadSong(targetDbIdx >= 0 ? targetDbIdx : 0, true);
  }

  /* ==========================================================================
     6. Audio Event Listeners (Progress, Seek, Volume)
     ========================================================================== */

  audioPlayer.addEventListener('timeupdate', () => {
    const duration = audioPlayer.duration;
    const current = audioPlayer.currentTime;

    if (!isNaN(duration) && duration > 0) {
      const percentage = (current / duration) * 100;
      seekBar.value = percentage;
      seekProgress.style.width = `${percentage}%`;
      currentTimeLabel.textContent = formatTime(current);
      totalDurationLabel.textContent = formatTime(duration);
    }
  });

  audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 'one') {
      audioPlayer.currentTime = 0;
      playSong();
    } else if (repeatMode === 'all' || currentTrackIndex < SONGS_DATABASE.length - 1 || isShuffle) {
      nextSong();
    } else {
      pauseSong();
    }
  });

  audioPlayer.addEventListener('error', () => {
    const song = SONGS_DATABASE[currentTrackIndex];
    console.error('Failed to load audio:', song?.url);
    showErrorToast(`⚠️ Could not load "${song?.title || 'track'}" — skipping to next.`);
    isPlaying = false;
    highlightActiveSongCard();
    // Auto-skip to next song after a short delay
    setTimeout(() => {
      if (currentTrackIndex < SONGS_DATABASE.length - 1) {
        nextSong();
      } else {
        pauseSong();
      }
    }, 1500);
  });

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    seekProgress.style.width = `${value}%`;
    if (!isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
      audioPlayer.currentTime = (value / 100) * audioPlayer.duration;
    }
  };

  seekBar.addEventListener('input', handleSeek);
  seekBar.addEventListener('change', handleSeek);

  volumeBar.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    audioPlayer.volume = value;
    volumeProgress.style.width = `${value * 100}%`;

    if (value === 0) {
      volumeIcon.className = 'ri-volume-mute-fill';
    } else if (value < 0.5) {
      volumeIcon.className = 'ri-volume-down-fill';
    } else {
      volumeIcon.className = 'ri-volume-up-fill';
    }
  });

  muteBtn.addEventListener('click', () => {
    if (audioPlayer.volume > 0) {
      audioPlayer.dataset.lastVolume = audioPlayer.volume;
      audioPlayer.volume = 0;
      volumeBar.value = 0;
      volumeProgress.style.width = '0%';
      volumeIcon.className = 'ri-volume-mute-fill';
    } else {
      const restored = parseFloat(audioPlayer.dataset.lastVolume || '0.8');
      audioPlayer.volume = restored;
      volumeBar.value = restored;
      volumeProgress.style.width = `${restored * 100}%`;
      volumeIcon.className = restored < 0.5 ? 'ri-volume-down-fill' : 'ri-volume-up-fill';
    }
  });

  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    shuffleBtn.title = isShuffle ? 'Shuffle On' : 'Shuffle Off';
  });

  repeatBtn.addEventListener('click', () => {
    if (repeatMode === 'none') {
      repeatMode = 'all';
      repeatBtn.classList.add('active');
      repeatBtn.innerHTML = '<i class="ri-repeat-line"></i>';
      repeatBtn.title = 'Repeat All';
    } else if (repeatMode === 'all') {
      repeatMode = 'one';
      repeatBtn.classList.add('active');
      repeatBtn.innerHTML = '<i class="ri-repeat-2-line"></i>';
      repeatBtn.title = 'Repeat One';
    } else {
      repeatMode = 'none';
      repeatBtn.classList.remove('active');
      repeatBtn.innerHTML = '<i class="ri-repeat-line"></i>';
      repeatBtn.title = 'Repeat Off';
    }
  });

  playPauseBtn.addEventListener('click', togglePlayPause);
  nextBtn.addEventListener('click', nextSong);
  prevBtn.addEventListener('click', prevSong);

  /* ==========================================================================
     7. Rendering Logic (Songs Grid, Categories, Playlists)
     ========================================================================== */

  function renderSongsGrid() {
    songsContainer.innerHTML = '';

    let filteredSongs = getCurrentFilteredSongs();

    // Update count labels
    songCountLabel.textContent = `Showing ${filteredSongs.length} track${filteredSongs.length !== 1 ? 's' : ''}`;
    favCountBadge.textContent = favorites.length;

    // Show empty state if no songs match
    if (filteredSongs.length === 0) {
      songsContainer.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    songsContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');

    filteredSongs.forEach(song => {
      const isLiked = favorites.includes(song.id);
      const isCurrent = (SONGS_DATABASE[currentTrackIndex].id === song.id);

      const card = document.createElement('div');
      card.className = `song-card ${isCurrent && isPlaying ? 'playing' : ''}`;
      card.dataset.songId = song.id;

      card.innerHTML = `
        <div class="card-art-box" data-action="play" data-song-id="${song.id}">
          <img src="${song.cover}" alt="${song.title}">
          <div class="play-overlay-btn" data-action="play" data-song-id="${song.id}">
            <div class="play-btn-circle">
              <i class="${isCurrent && isPlaying ? 'ri-pause-fill' : 'ri-play-fill'}"></i>
            </div>
          </div>
          <button class="like-badge ${isLiked ? 'liked' : ''}" data-action="like" data-song-id="${song.id}" title="${isLiked ? 'Remove Favorite' : 'Add Favorite'}">
            <i class="${isLiked ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
          </button>
        </div>
        <div class="card-details" data-action="play" data-song-id="${song.id}" style="cursor: pointer;">
          <div class="card-title" title="${song.title}">${song.title}</div>
          <div class="card-artist" title="${song.artist}">${song.artist}</div>
        </div>
        <div class="card-footer">
          <span class="genre-tag">${song.category}</span>
          <span class="duration-tag">${song.duration}</span>
          ${activeView.startsWith('playlist-') ? `
            <button class="remove-playlist-btn" data-action="remove-playlist" data-song-id="${song.id}" title="Remove from Playlist" style="background: rgba(239, 68, 68, 0.15); border: none; color: #ef4444; border-radius: 6px; cursor: pointer; font-size: 14px; padding: 4px 8px; transition: all 0.2s;">
              <i class="ri-delete-bin-line"></i> Remove
            </button>
          ` : `
            <button class="add-playlist-btn" data-action="add-playlist" data-song-id="${song.id}" title="Add to Playlist">
              <i class="ri-playlist-add-line"></i>
            </button>
          `}
        </div>
      `;

      songsContainer.appendChild(card);
    });

    attachCardEventListeners();
  }

  function attachCardEventListeners() {
    songsContainer.querySelectorAll('[data-action]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = element.dataset.action;
        const songId = element.dataset.songId;
        const songIdx = SONGS_DATABASE.findIndex(s => s.id === songId);

        if (action === 'play') {
          if (currentTrackIndex === songIdx) {
            togglePlayPause();
          } else {
            loadSong(songIdx, true);
          }
        } else if (action === 'like') {
          toggleFavorite(songId);
        } else if (action === 'add-playlist') {
          openAddToPlaylistModal(songId);
        } else if (action === 'remove-playlist') {
          if (activePlaylistId) {
            const pl = playlists.find(p => p.id === activePlaylistId);
            if (pl) {
              pl.songIds = pl.songIds.filter(id => id !== songId);
              savePlaylistsToStorage();
              renderSongsGrid();
            }
          }
        }
      });
    });
  }

  function highlightActiveSongCard() {
    const currentSong = SONGS_DATABASE[currentTrackIndex];
    if (!currentSong) return;

    document.querySelectorAll('.song-card').forEach(card => {
      const playIcon = card.querySelector('.play-btn-circle i');
      if (card.dataset.songId === currentSong.id) {
        if (isPlaying) {
          card.classList.add('playing');
          if (playIcon) playIcon.className = 'ri-pause-fill';
        } else {
          card.classList.remove('playing');
          if (playIcon) playIcon.className = 'ri-play-fill';
        }
      } else {
        card.classList.remove('playing');
        if (playIcon) playIcon.className = 'ri-play-fill';
      }
    });
  }

  function renderPlaylistsSidebar() {
    if (!playlistsListContainer) return;
    playlistsListContainer.innerHTML = '';

    playlists.forEach(pl => {
      const item = document.createElement('div');
      const isActive = (activeView === `playlist-${pl.id}`);
      item.className = `playlist-item ${isActive ? 'active' : ''}`;
      item.dataset.playlistId = pl.id;

      item.innerHTML = `
        <span class="name"><i class="ri-playlist-2-line"></i> ${pl.name}</span>
        <span class="count">${pl.songIds.length}</span>
      `;

      item.addEventListener('click', () => {
        activeView = `playlist-${pl.id}`;
        activePlaylistId = pl.id;
        viewTitle.textContent = pl.name;
        btnDeletePlaylist.classList.remove('hidden');
        updateActiveNavState();
        renderSongsGrid();
      });

      playlistsListContainer.appendChild(item);
    });
  }

  function renderQueue() {
    queueList.innerHTML = '';

    for (let i = 0; i < SONGS_DATABASE.length; i++) {
      if (i === currentTrackIndex) continue;
      const song = SONGS_DATABASE[i];

      const item = document.createElement('div');
      item.className = 'queue-item';
      item.innerHTML = `
        <img src="${song.cover}" class="queue-thumb" alt="${song.title}">
        <div class="queue-info">
          <div class="queue-title">${song.title}</div>
          <div class="queue-artist">${song.artist}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        loadSong(i, true);
      });

      queueList.appendChild(item);
    }
  }

  /* ==========================================================================
     8. Search & Filter Handlers
     ========================================================================== */

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    clearSearchBtn.classList.toggle('hidden', searchTerm.length === 0);
    renderSongsGrid();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchTerm = '';
    clearSearchBtn.classList.add('hidden');
    renderSongsGrid();
  });

  categoryListContainer.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      categoryListContainer.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category;
      renderSongsGrid();
    });
  });

  resetFilterBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchTerm = '';
    clearSearchBtn.classList.add('hidden');
    activeCategory = 'All';
    categoryListContainer.querySelectorAll('.category-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.category === 'All');
    });
    renderSongsGrid();
  });

  /* ==========================================================================
     9. Navigation View Switching
     ========================================================================== */

  // ── Unified Compact View Mode (Left Panel + Right Panel + Header) ─────────
  function setCompactMode(isCompact) {
    if (sidebar) sidebar.classList.toggle('compact-mode', isCompact);
    if (rightPanel) rightPanel.classList.toggle('compact-mode', isCompact);
    if (topBar) topBar.classList.toggle('compact-mode', isCompact);
    if (appContainer) appContainer.classList.toggle('compact-mode', isCompact);

    if (btnToggleCompactView) {
      btnToggleCompactView.classList.toggle('active', isCompact);
      btnToggleCompactView.title = isCompact ? 'Exit Compact View' : 'Toggle Compact View';
      const icon = btnToggleCompactView.querySelector('i');
      if (icon) icon.className = isCompact ? 'ri-layout-right-fill' : 'ri-layout-right-line';
    }

    if (btnCompactToggle) {
      btnCompactToggle.title = isCompact ? 'Expand Left Panel' : 'Collapse Left Panel';
    }
    if (btnTogglePanel) {
      btnTogglePanel.title = isCompact ? 'Expand Right Panel' : 'Collapse Right Panel';
    }

    localStorage.setItem('soundpulse_compact', isCompact);
  }

  function toggleCompactMode() {
    const currentState = appContainer ? appContainer.classList.contains('compact-mode') : false;
    setCompactMode(!currentState);
  }

  // Restore saved compact mode state from localStorage
  (function initCompactMode() {
    const savedCompact = localStorage.getItem('soundpulse_compact') === 'true';
    if (savedCompact) {
      setCompactMode(true);
    }
  })();

  if (btnToggleCompactView) {
    btnToggleCompactView.addEventListener('click', toggleCompactMode);
  }

  if (btnCompactToggle) {
    btnCompactToggle.addEventListener('click', toggleCompactMode);
  }

  if (btnTogglePanel) {
    btnTogglePanel.addEventListener('click', toggleCompactMode);
  }

  navAllSongs.addEventListener('click', () => {
    activeView = 'all';
    activePlaylistId = null;
    viewTitle.textContent = 'All Songs';
    btnDeletePlaylist.classList.add('hidden');
    updateActiveNavState();
    renderSongsGrid();
  });

  navFavorites.addEventListener('click', () => {
    activeView = 'favorites';
    activePlaylistId = null;
    viewTitle.textContent = 'Favorites';
    btnDeletePlaylist.classList.add('hidden');
    updateActiveNavState();
    renderSongsGrid();
  });

  function updateActiveNavState() {
    navAllSongs.classList.toggle('active', activeView === 'all');
    navFavorites.classList.toggle('active', activeView === 'favorites');
    renderPlaylistsSidebar();
  }

  /* ==========================================================================
     10. Favorites & Playlist Management (Local Storage Sync)
     ========================================================================== */

  function toggleFavorite(songId) {
    const idx = favorites.indexOf(songId);
    if (idx > -1) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(songId);
    }

    saveFavoritesToStorage();
    updateLikeButtonState(SONGS_DATABASE[currentTrackIndex].id);
    renderSongsGrid();
  }

  function updateLikeButtonState(currentSongId) {
    const isLiked = favorites.includes(currentSongId);
    playerLikeBtn.classList.toggle('liked', isLiked);
    playerLikeBtn.querySelector('i').className = isLiked ? 'ri-heart-fill' : 'ri-heart-line';
  }

  playerLikeBtn.addEventListener('click', () => {
    const currentSong = SONGS_DATABASE[currentTrackIndex];
    if (currentSong) {
      toggleFavorite(currentSong.id);
    }
  });

  // Playlist Creation Modal
  btnOpenCreatePlaylist.addEventListener('click', () => {
    modalCreatePlaylist.classList.remove('hidden');
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalCreatePlaylist.classList.add('hidden');
      modalAddToPlaylist.classList.add('hidden');
    });
  });

  formCreatePlaylist.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('playlist-name-input');
    const descInput = document.getElementById('playlist-desc-input');

    const newPlaylist = {
      id: 'pl-' + Date.now(),
      name: nameInput.value.trim(),
      description: descInput.value.trim(),
      songIds: []
    };

    playlists.push(newPlaylist);
    savePlaylistsToStorage();

    nameInput.value = '';
    descInput.value = '';
    modalCreatePlaylist.classList.add('hidden');

    // Switch to newly created playlist
    activeView = `playlist-${newPlaylist.id}`;
    activePlaylistId = newPlaylist.id;
    viewTitle.textContent = newPlaylist.name;
    btnDeletePlaylist.classList.remove('hidden');
    updateActiveNavState();
    renderSongsGrid();
  });

  // Delete Playlist Button
  btnDeletePlaylist.addEventListener('click', () => {
    if (!activePlaylistId) return;
    const pl = playlists.find(p => p.id === activePlaylistId);
    if (!pl) return;

    if (confirm(`Are you sure you want to delete playlist "${pl.name}"?`)) {
      playlists = playlists.filter(p => p.id !== activePlaylistId);
      savePlaylistsToStorage();

      activeView = 'all';
      activePlaylistId = null;
      viewTitle.textContent = 'All Songs';
      btnDeletePlaylist.classList.add('hidden');
      updateActiveNavState();
      renderSongsGrid();
    }
  });

  // Add to Playlist Modal Handler
  function openAddToPlaylistModal(songId) {
    pendingAddToPlaylistSongId = songId;
    const song = SONGS_DATABASE.find(s => s.id === songId);
    if (!song) return;

    modalTargetSongPreview.innerHTML = `
      <img src="${song.cover}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;">
      <div>
        <strong style="display: block; font-size: 14px;">${song.title}</strong>
        <span style="font-size: 12px; color: var(--text-muted);">${song.artist}</span>
      </div>
    `;

    modalPlaylistsList.innerHTML = '';

    if (playlists.length === 0) {
      modalPlaylistsList.innerHTML = `<p style="font-size: 13px; color: var(--text-muted); text-align: center;">No playlists created yet. Create one first!</p>`;
    } else {
      playlists.forEach(pl => {
        const inPlaylist = pl.songIds.includes(songId);
        const option = document.createElement('div');
        option.className = 'modal-playlist-option';

        option.innerHTML = `
          <span><i class="ri-playlist-2-line"></i> ${pl.name}</span>
          <span style="font-size: 12px; color: ${inPlaylist ? 'var(--cyan-accent)' : 'var(--text-dim)'}">
            ${inPlaylist ? '<i class="ri-check-line"></i> Added' : '+ Add'}
          </span>
        `;

        option.addEventListener('click', () => {
          if (inPlaylist) {
            pl.songIds = pl.songIds.filter(id => id !== songId);
          } else {
            pl.songIds.push(songId);
          }
          savePlaylistsToStorage();
          openAddToPlaylistModal(songId); // refresh modal state
          renderSongsGrid();
        });

        modalPlaylistsList.appendChild(option);
      });
    }

    modalAddToPlaylist.classList.remove('hidden');
  }

  // Play All Queue button
  btnPlayAllQueue.addEventListener('click', () => {
    loadSong(0, true);
  });

  /* ==========================================================================
     11. Helper Functions & Initialization
     ========================================================================== */

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Initial Boot — set volume from slider default before anything plays
  audioPlayer.volume = parseFloat(volumeBar.value) || 0.8;
  audioPlayer.muted = false;
  volumeProgress.style.width = `${(parseFloat(volumeBar.value) || 0.8) * 100}%`;

  renderSongsGrid();
  renderPlaylistsSidebar();
  loadSong(0, false);

});

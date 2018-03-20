import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
   super(props);
   const album = albumData.find( album => {
    return album.slug === this.props.match.params.slug
  });

   this.state = {
     album: album,
     currentSong: album.songs[0],
     isPlaying: false,
     currentTime: 0,
     duration: album.songs[0].duration,
     currentVolume: 0.1
    }
   this.audioElement = document.createElement('audio');
   this.audioElement.src = album.songs[0].audioSrc;
  }
  formatTime(timeInSeconds, radix) {
    if (typeof(parseInt(timeInSeconds, radix) === "number")) {
      var minutes = Math.floor(timeInSeconds/60);
      var remainingSeconds = Math.floor(((timeInSeconds/60) - minutes) * 60);
      if (remainingSeconds.toString().length === 1){
        return minutes.toString() + ":0" + remainingSeconds.toString();
      } else if (remainingSeconds.toString().length > 1){
        return minutes.toString() + ":" + remainingSeconds.toString();
       }
      else {
        return ("-:--");
      }
    }
  }
  componentDidMount() {
    this.eventListeners = {
     timeupdate: e => {
       this.setState({ currentTime: this.formatTime(this.audioElement.currentTime)});
     },
     durationchange: e => {
       this.setState({ duration: this.formatTime(this.audioElement.duration)});

     }
   };
   this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
   this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);

  }
  componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }

   handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: (newTime) });
  }
  handleVolumeChange(e){
    const volume = e.target.value;
    this.audioElement.volume = volume;
    this.setState({currentVolume: volume})
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true })
  }
  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }
  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }
  handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
   }
   handlePrevClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.max(0, currentIndex - 1);
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play(newSong);
   }
   handleNextClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.max(0, currentIndex + 1);
     if (newIndex < this.state.album.songs.length) {
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play(newSong);
    }
   }
  render() {
    return (
      <section className="album">
        <section id="album-info">
        <img id="album-cover-art" src={this.state.album.albumCover} alt="album cover"/>
           <div className="album-details">
              <h1 id="album-title">{this.state.album.title}</h1>
              <h2 className="artist">{this.state.album.artist}</h2>
              <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
        </section>
            <table id="song-list">
              <colgroup>
                <col id="song-number-column" />
                <col id="song-title-column" />
                <col id="song-duration-column" />
              </colgroup>
              <tbody className="song-list-body">
              {
                this.state.album.songs.map((song, index) =>
                <tr className="song" key={index} onClick={ () => this.handleSongClick(song) } >
                  <td className="song-actions">
                    <button>
                      <span className="song-number">{index+1}</span>
                      <span className="ion-play"></span>
                      <span className="ion-pause"></span>
                    </button>
                  </td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-duration">{this.formatTime(song.duration)}</td>
              </tr>
              )}
              </tbody>
            </table>
            <PlayerBar
               isPlaying={this.state.isPlaying}
               currentSong={this.state.currentSong}
               currentTime={this.state.currentTime}
               duration={this.state.duration}
               currentVolume={this.state.currentVolume}
               handleSongClick={() => this.handleSongClick(this.state.currentSong)}
               handlePrevClick={() => this.handlePrevClick()}
               handleNextClick={() => this.handleNextClick()}
               handleTimeChange={(e) => this.handleTimeChange(e)}
               handleVolumeChange={(e) => this.handleVolumeChange(e)}
            />
      </section>
    );
  }
}

export default Album;

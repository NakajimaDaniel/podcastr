import { useContext, useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider' 
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {

  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);

  const {episodelist, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState, playNext, playPrevious, hasNext, hasPrevious, toggleLoop, isLooping, toggleShuffle, isShuffling} = usePlayer()

  const episode = episodelist[currentEpisodeIndex]

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  useEffect(() => {

    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando"/>
        <strong>Tocando Agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider trackStyle={{backgroundColor: '#84d361'}} railStyle={{backgroundColor: '#9f775ff'}} handleStyle={{borderColor: '#84d361', borderWidth: 4} }  />
            ) : (
              <div className={styles.emptySlider}/>
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (

          <audio src={episode.url} ref={audioRef} onPlay={() => setPlayingState(true)} onPause={() => setPlayingState(false)} autoPlay loop={isLooping} onLoadedMetadata={setupProgressListener} />

        )}


        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodelist.length == 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="embaralhar"/>
          </button>

          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="tocar anterior"/>
          </button>

          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            {isPlaying ? <img src="/pause.svg" alt="tocar"/> : <img src="/play.svg" alt="tocar"/>}
          </button>

          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="tocar proximo"/>
          </button>

          <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="repetir"/>
          </button>
        </div>
      </footer>
    </div>
  )
}
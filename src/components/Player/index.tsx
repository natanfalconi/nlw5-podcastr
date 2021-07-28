import Image from 'next/image'
import styles from './styles.module.scss'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import { convertDurationToTimeString } from '../../utils/convertDuration'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import playing from '../../../public/playing.svg'
import shuffle from '../../../public/shuffle.svg'
import previous from '../../../public/play-previous.svg'
import play from '../../../public/play.svg'
import pause from '../../../public/pause.svg'
import next from '../../../public/play-next.svg'
import repeat from '../../../public/repeat.svg'


export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0)

    const { episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling
    } = usePlayer()

    function setupProgressListener() {
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    } 


    useEffect(() => {
        if (!audioRef.current) {
            return
        }

        if (isPlaying) {
            audioRef.current.play()
        } else (
            audioRef.current.pause()
        )
    }, [isPlaying])


    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <Image src={playing} alt="Tocando agora" />
                <strong>Tocando Agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
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
                            <Slider
                                max={episode.duration}
                                value={progress}                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>

                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {/* TAG AUDIO */}

                {episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedData={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <Image src={shuffle} alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <Image src={previous} alt="Tocar Anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playerButton}
                        disabled={!episode}
                        onClick={togglePlay}

                    >
                        {isPlaying
                            ? <Image src={pause} alt="Tocar" />
                            : <Image src={play} alt="Tocar" />}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <Image src={next} alt="Tocar próxima" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <Image src={repeat} alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}
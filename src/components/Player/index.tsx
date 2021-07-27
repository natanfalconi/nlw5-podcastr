import Image from 'next/image'
import styles from './styles.module.scss'
import { useContext } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext'

import playing from '../../../public/playing.svg'
import shuffle from '../../../public/shuffle.svg'
import previous from '../../../public/play-previous.svg'
import play from '../../../public/play.svg'
import next from '../../../public/play-next.svg'
import repeat from '../../../public/repeat.svg'


export function Player(){

    const { episodeList, currentEpisodeIndex } = useContext(PlayerContext)

    const episode = episodeList[currentEpisodeIndex]
    
    return(
        <div className={styles.playerContainer}>
            <header>
                <Image src={playing} alt="Tocando agora" />
                <strong>Tocando Agora {episode?.title}</strong>
            </header>

            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>

            <footer className={styles.empty}>
                <div className={styles.progress}>
                    <span>00:00</span>

                    <div className={styles.slider}>
                        <div className={styles.emptySlider} />
                    </div>
                    <span>00:00</span>
                </div>

                <div className={styles.buttons}>
                    <button type="button">
                        <Image src={shuffle} alt="Embaralhar" />
                    </button>
                    <button type="button">
                        <Image src={previous} alt="Tocar Anterior" />
                    </button>
                    <button type="button" className={styles.playerButton}>
                        <Image src={play} alt="Tocar" />
                    </button>
                    <button type="button">
                        <Image src={next} alt="Tocar próxima" />
                    </button>
                    <button type="button">
                        <Image src={repeat} alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}
import { GetStaticProps } from 'next'
import Image from 'next/image'

import Link from 'next/link'

import Head from 'next/head'

import { format, parseISO } from 'date-fns'
import ptBR from "date-fns/locale/pt-BR"

import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDuration'
import { usePlayer } from '../contexts/PlayerContext'

import styles from './home.module.scss'

import playGreen from '../../public/play-green.svg'


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  lastesEpisodes: Episode[];
  allEpisodes: Episode[];
}


export default function Home({ lastesEpisodes, allEpisodes }: HomeProps) {

  const { playList } = usePlayer()

  const episodeList = [...lastesEpisodes, ...allEpisodes]

  return (
    <div className={styles.homePage}>

      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latesEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {lastesEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                {/* <Image width={200} height={200} src={episode.thumbnail} alt={episode.title} objectFit="cover"/> */}

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <Image src={playGreen} alt="Tocar episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody> 
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td>
                    <Image 
                      width={100} 
                      height={100}
                      src={episode.thumbnail} 
                      alt={episode.title}
                      objectFit="cover"
                    />
                    </td>
                    <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, index + lastesEpisodes.length)}>
                        <Image src={playGreen} alt="Tocar episodio" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>

          </table>
      </section>
    </div>
  )
}
// Nome das variavéis
// SSR - getServerSideProps - recarregado toda vez que o usuário acessa a página
// SSG - getStaticProps - recarregado uma vez(gerando um html estático) com tempo para novo reload (Só funciona em produção)
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {        //?_limit=12&_sort=published_at&_order=desc
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  // const data = await response.json()

  const episodes = data.map(episodes => {
    return {
      id: episodes.id,
      title: episodes.title,
      thumbnail: episodes.thumbnail,
      members: episodes.members,
      publishedAt: format(parseISO(episodes.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episodes.file.duration),
      durationAsString: convertDurationToTimeString(Number(episodes.file.duration)),
      url: episodes.file.url
    }
  })

  const lastesEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      lastesEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }

}

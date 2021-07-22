import { GetStaticProps  } from 'next'

import { format, parseISO} from 'date-fns'
import ptBR from "date-fns/locale/pt-BR"

import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDuration'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  episodes: Array<Episode>
}


export default function Home(props: HomeProps) {

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>

    </div>
  )
}
// Nome das variavéis
// SSR - getServerSideProps - recarregado toda vez que o usuário acessa a página
// SSG - getStaticProps - recarregado uma vez(gerando um html estático) com tempo para novo reload (Só funciona em produção)
export  const getStaticProps: GetStaticProps = async () =>{
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
      description: episodes.description,
      url: episodes.file.url
    }
  })

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8
  }

}
 
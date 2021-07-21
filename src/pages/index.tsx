
export default function Home(props) {

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
export async function getStaticProps(){
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8
  }

}
 